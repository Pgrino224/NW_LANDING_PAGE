import pkg from 'pg';
const { Client } = pkg;

export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    await client.connect();

    // Check if there's an active bounty
    const activeBountyCheck = await client.query(
      'SELECT id FROM bounty_events WHERE is_active = true LIMIT 1'
    );

    if (activeBountyCheck.rows.length === 0) {
      await client.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          noBountyActive: true,
          leaderboard: []
        })
      };
    }

    // Check if groups are enabled for this bounty
    const bountyConfigResult = await client.query(
      'SELECT group_config FROM bounty_events WHERE is_active = true LIMIT 1'
    );

    const groupsEnabled = bountyConfigResult.rows[0]?.group_config?.enabled || false;

    // Get current bounty leaderboard from cache with group info
    const result = await client.query(`
      SELECT
        lc.referrer_handle as handle,
        lc.user_name as name,
        lc.total_score as score,
        lc.breakdown,
        be.name as bounty_name,
        lc.last_updated,
        bs.group_number
      FROM leaderboard_cache lc
      JOIN bounty_events be ON lc.bounty_event_id = be.id
      LEFT JOIN (
        SELECT DISTINCT ON (referrer_x_handle)
          CASE
            WHEN LOWER(referrer_x_handle) LIKE '@%' THEN LOWER(referrer_x_handle)
            ELSE CONCAT('@', LOWER(referrer_x_handle))
          END as normalized_handle,
          group_number
        FROM beta_signups
        WHERE bounty_event_id = (SELECT id FROM bounty_events WHERE is_active = true LIMIT 1)
      ) bs ON LOWER(lc.referrer_handle) = LOWER(bs.normalized_handle)
      WHERE be.is_active = true
      ORDER BY lc.total_score DESC
    `);

    const leaderboardData = result.rows.map((row, index) => {
      const breakdown = row.breakdown;
      return {
        rank: index + 1,
        handle: row.handle,
        name: row.name || row.handle,
        score: row.score,
        signups: breakdown.referral_signups || 0,
        mentions: breakdown.comment_mentions || 0,
        likes: breakdown.likes || 0,
        retweets: breakdown.retweets || 0,
        replies: breakdown.comments || 0,
        totalEngagement: (breakdown.likes || 0) + (breakdown.retweets || 0) + (breakdown.comments || 0),
        posts: breakdown.posts || 0,
        groupNumber: row.group_number
      };
    });

    // If groups are enabled, organize data by groups
    let responseData;
    if (groupsEnabled) {
      const group1 = leaderboardData.filter(e => e.groupNumber === 1)
        .map((e, idx) => ({ ...e, rank: idx + 1 }));
      const group2 = leaderboardData.filter(e => e.groupNumber === 2)
        .map((e, idx) => ({ ...e, rank: idx + 1 }));
      const group3 = leaderboardData.filter(e => e.groupNumber === 3)
        .map((e, idx) => ({ ...e, rank: idx + 1 }));

      responseData = {
        groupsEnabled: true,
        groups: {
          group1,
          group2,
          group3
        }
      };
    } else {
      responseData = {
        groupsEnabled: false,
        leaderboard: leaderboardData
      };
    }

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        noBountyActive: false,
        ...responseData
      })
    };
  } catch (error) {
    console.error('Leaderboard error:', error);

    try {
      await client.end();
    } catch (e) {
      // Already closed
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch leaderboard',
        details: error.message
      })
    };
  }
}
