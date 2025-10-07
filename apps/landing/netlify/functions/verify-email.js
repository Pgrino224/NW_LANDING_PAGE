import pkg from 'pg';
const { Client } = pkg;

export async function handler(event, context) {
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
    const token = event.queryStringParameters?.token;

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Verification token is required' })
      };
    }

    await client.connect();

    // Find user with this token
    const result = await client.query(
      'SELECT email, token_expires_at, email_verified FROM beta_signups WHERE verification_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      await client.end();
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid verification token' })
      };
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.email_verified) {
      await client.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Email already verified'
        })
      };
    }

    // Check if token expired
    if (new Date() > new Date(user.token_expires_at)) {
      await client.end();
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Verification token has expired' })
      };
    }

    // Mark as verified and clear the token
    await client.query(
      'UPDATE beta_signups SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1',
      [token]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email verified successfully!'
      })
    };

  } catch (error) {
    console.error('Verification error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Verification failed. Please try again.' })
    };
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Client already closed or never connected
    }
  }
}
