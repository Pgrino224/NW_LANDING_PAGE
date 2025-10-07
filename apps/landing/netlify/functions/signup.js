import pkg from 'pg';
const { Client } = pkg;
import { Resend } from 'resend'
import crypto from 'crypto'

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
    const { email, referrerXHandle } = JSON.parse(event.body)

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Connect to database
    await client.connect();

    // Save to Neon database with verification token
    await client.query(
      'INSERT INTO beta_signups (email, referrer_x_handle, verification_token, token_expires_at, created_at) VALUES ($1, $2, $3, $4, $5)',
      [email, referrerXHandle || null, verificationToken, expiresAt.toISOString(), new Date().toISOString()]
    );

    await client.end();

    // Create verification URL
    const verificationUrl = `https://acepyr.com/verify?token=${verificationToken}`;

    // Send verification email with Resend
    try {
      const { error: emailError } = await resend.emails.send({
        from: 'NetWorth <welcome@acepyr.com>',
        to: email,
        subject: 'Verify your email for NetWorth',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000000;">Welcome to NetWorth by Acepyr!</h2>

            <p style="color: #000000;">Thank you for signing up for NetWorth!</p>

            <p style="color: #000000;">Please verify your email address to complete your registration:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #FF8480; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
            </div>

            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>

            <p style="color: #000000;">We're excited to have you join our community of financial innovators!</p>

            <br>
            <p style="color: #000000;"><strong>- The Acepyr Team</strong></p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              This verification link expires in 24 hours. You're receiving this because you signed up for NetWorth at acepyr.com
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
        message: 'Please check your email to verify your account!'
      })
    }
  } catch (error) {
    console.error('Signup error:', error)

    // Check if it's a duplicate key error
    if (error.code === '23505') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'This email is already registered'
        })
      }
    }

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