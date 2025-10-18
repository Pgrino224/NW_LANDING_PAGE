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

    // Get current bounty leaderboard from cache
    const result = await client.query(`
      SELECT
        lc.referrer_handle as handle,
        lc.user_name as name,
        lc.total_score as score,
        lc.breakdown,
        be.name as bounty_name,
        lc.last_updated
      FROM leaderboard_cache lc
      JOIN bounty_events be ON lc.bounty_event_id = be.id
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
        communityJoins: breakdown.community_joins || 0,
        mentions: breakdown.comment_mentions || 0,
        likes: breakdown.likes || 0,
        retweets: breakdown.retweets || 0,
        replies: breakdown.comments || 0,
        totalEngagement: (breakdown.likes || 0) + (breakdown.retweets || 0) + (breakdown.comments || 0),
        posts: breakdown.posts || 0
      };
    });

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        noBountyActive: false,
        leaderboard: leaderboardData
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
