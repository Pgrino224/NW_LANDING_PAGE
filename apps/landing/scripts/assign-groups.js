import pkg from 'pg';
const { Client } = pkg;

/**
 * Smart Group Assignment Script
 *
 * Assigns participants to groups using a snake draft algorithm to ensure
 * fair competition by distributing top performers across all groups.
 *
 * Snake Draft Pattern:
 * - Round 1: Group 1, 2, 3
 * - Round 2: Group 3, 2, 1 (reverse)
 * - Round 3: Group 1, 2, 3
 * - And so on...
 */

async function assignGroups() {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get active bounty
    const bountyResult = await client.query(
      'SELECT id, name FROM bounty_events WHERE is_active = true LIMIT 1'
    );

    if (bountyResult.rows.length === 0) {
      console.log('❌ No active bounty found');
      process.exit(1);
    }

    const activeBounty = bountyResult.rows[0];
    console.log(`📊 Active bounty: ${activeBounty.name} (ID: ${activeBounty.id})`);

    // Get all participants sorted by current signup count (DESC)
    const participantsResult = await client.query(`
      SELECT
        CASE
          WHEN LOWER(referrer_x_handle) LIKE '@%' THEN LOWER(referrer_x_handle)
          ELSE CONCAT('@', LOWER(referrer_x_handle))
        END as referrer_handle,
        COUNT(*) as signup_count
      FROM beta_signups
      WHERE bounty_event_id = $1
        AND email_verified = true
        AND referrer_x_handle IS NOT NULL
        AND referrer_x_handle != ''
      GROUP BY referrer_handle
      ORDER BY signup_count DESC
    `, [activeBounty.id]);

    const participants = participantsResult.rows;
    console.log(`👥 Found ${participants.length} participants to assign`);

    if (participants.length === 0) {
      console.log('⚠️  No participants found for this bounty');
      process.exit(0);
    }

    // Snake draft assignment
    const groupAssignments = {};
    let currentRound = 0;

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      const positionInRound = i % 3;
      const isReverseRound = Math.floor(i / 3) % 2 === 1;

      let groupNumber;
      if (isReverseRound) {
        // Reverse order: 3, 2, 1
        groupNumber = 3 - positionInRound;
      } else {
        // Normal order: 1, 2, 3
        groupNumber = positionInRound + 1;
      }

      groupAssignments[participant.referrer_handle] = groupNumber;

      console.log(
        `  ${i + 1}. ${participant.referrer_handle.padEnd(20)} | ` +
        `${participant.signup_count.toString().padStart(3)} signups → Group ${groupNumber}`
      );
    }

    // Update beta_signups with group assignments
    console.log('\n📝 Updating database...');
    let updateCount = 0;

    for (const [handle, groupNumber] of Object.entries(groupAssignments)) {
      const result = await client.query(
        `UPDATE beta_signups
         SET group_number = $1
         WHERE bounty_event_id = $2
           AND LOWER(
             CASE
               WHEN LOWER(referrer_x_handle) LIKE '@%' THEN LOWER(referrer_x_handle)
               ELSE CONCAT('@', LOWER(referrer_x_handle))
             END
           ) = LOWER($3)`,
        [groupNumber, activeBounty.id, handle]
      );
      updateCount += result.rowCount;
    }

    // Update bounty_events to mark groups as enabled
    await client.query(
      `UPDATE bounty_events
       SET group_config = '{"enabled": true, "assignment_strategy": "snake_draft", "assigned_at": "'|| NOW() ||'"}'::jsonb
       WHERE id = $1`,
      [activeBounty.id]
    );

    console.log(`\n✅ Successfully assigned ${participants.length} participants to groups`);
    console.log(`   Total signup records updated: ${updateCount}`);

    // Show group distribution
    const distributionResult = await client.query(
      `SELECT group_number, COUNT(DISTINCT referrer_x_handle) as participant_count
       FROM beta_signups
       WHERE bounty_event_id = $1 AND group_number IS NOT NULL
       GROUP BY group_number
       ORDER BY group_number`,
      [activeBounty.id]
    );

    console.log('\n📊 Group Distribution:');
    for (const row of distributionResult.rows) {
      console.log(`   Group ${row.group_number}: ${row.participant_count} participants`);
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);

    try {
      await client.end();
    } catch (e) {
      // Already closed
    }

    process.exit(1);
  }
}

// Run the script
assignGroups();
