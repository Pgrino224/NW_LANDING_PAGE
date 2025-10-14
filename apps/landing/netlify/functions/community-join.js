import pkg from 'pg';
const { Client } = pkg;

export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
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
    const { userXHandle, referrerXHandle } = JSON.parse(event.body);

    if (!userXHandle) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User X handle is required' })
      };
    }

    // Clean handles (remove @ if present)
    const cleanUserHandle = userXHandle.trim().replace('@', '');
    const cleanReferrerHandle = referrerXHandle ? referrerXHandle.trim().replace('@', '') : null;

    await client.connect();

    // Get active bounty event
    const bountyResult = await client.query(
      'SELECT id FROM bounty_events WHERE is_active = true LIMIT 1'
    );

    const bountyEventId = bountyResult.rows.length > 0 ? bountyResult.rows[0].id : null;

    // Insert community join
    await client.query(
      'INSERT INTO community_joins (user_x_handle, referrer_x_handle, bounty_event_id, created_at) VALUES ($1, $2, $3, $4)',
      [cleanUserHandle, cleanReferrerHandle, bountyEventId, new Date().toISOString()]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully joined the community!'
      })
    };
  } catch (error) {
    console.error('Community join error:', error);

    // Check if it's a duplicate entry
    if (error.code === '23505') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'You have already joined the community'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process community join. Please try again.'
      })
    };
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Client already closed
    }
  }
}
