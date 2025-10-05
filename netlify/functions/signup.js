import pkg from 'pg';
const { Client } = pkg;
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    const { email } = JSON.parse(event.body)

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      }
    }

    // Connect to database
    await client.connect();

    // Save to Neon database
    await client.query(
      'INSERT INTO beta_signups (email, created_at) VALUES ($1, $2)',
      [email, new Date().toISOString()]
    );

    await client.end();
    
    // Send welcome email with Resend
    try {
      const { error: emailError } = await resend.emails.send({
        from: 'NetWorth <welcome@acepyr.com>',
        to: email,
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
        console.error('Email error:', emailError)
        // Don't fail the whole request if email fails
      }
    } catch (emailError) {
      console.error('Resend error:', emailError)
      // Continue even if email fails
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Successfully signed up for beta!' 
      })
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process signup. Please try again.'
      })
    }
  } finally {
    // Ensure client is closed even if there's an error
    try {
      await client.end();
    } catch (e) {
      // Client already closed or never connected
    }
  }
}