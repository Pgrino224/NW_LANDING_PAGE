import pkg from 'pg';
const { Client } = pkg;
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed - Use GET' })
    }
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    // Connect to database
    await client.connect();

    // Fetch all emails from the database
    const result = await client.query('SELECT email FROM beta_signups ORDER BY created_at ASC');
    const emails = result.rows;

    await client.end();

    if (emails.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'No emails found in database',
          sent: 0
        })
      }
    }

    // Send emails to all users
    let successCount = 0;
    let failedCount = 0;
    const failed = [];

    for (const row of emails) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: 'NetWorth <welcome@acepyr.com>',
          to: row.email,
          subject: 'Welcome to NetWorth by Acepyr!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #000000;">Welcome to NetWorth by Acepyr!</h2>

              <p style="color: #000000;">Thank you for signing up for NetWorth!</p>

              <p style="color: #000000;">We're excited to have you join our community of financial innovators. You'll receive updates about our launch and exclusive access to new features.</p>

              <p style="color: #000000;">Get ready to democratize financial knowledge and build your NetWorth!</p>

              <p style="color: #000000;">Stay tuned!</p>

              <br>
              <p style="color: #000000;"><strong>- The Acepyr Team</strong></p>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                You're receiving this because you signed up for NetWorth at acepyr.com
              </p>
            </div>
          `
        })

        if (emailError) {
          console.error(`Failed to send to ${row.email}:`, emailError)
          failedCount++;
          failed.push(row.email);
        } else {
          successCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error sending to ${row.email}:`, error)
        failedCount++;
        failed.push(row.email);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Bulk email send completed',
        total: emails.length,
        sent: successCount,
        failed: failedCount,
        failedEmails: failed
      })
    }

  } catch (error) {
    console.error('Bulk email error:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send bulk emails',
        details: error.message
      })
    }
  } finally {
    try {
      await client.end();
    } catch (e) {
      // Client already closed
    }
  }
}
