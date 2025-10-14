import pkg from 'pg';
const { Client } = pkg;
import { Resend } from 'resend'
import crypto from 'crypto'
import disposableDomains from 'disposable-email-domains'

const resend = new Resend(process.env.RESEND_API_KEY)

// Verify Turnstile token with Cloudflare
async function verifyTurnstile(token) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });

  const data = await response.json();
  return data.success;
}

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
    const { email, referrerXHandle, turnstileToken, timeSpent } = JSON.parse(event.body)

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      }
    }

    // Normalize X handle - remove @ symbol and whitespace, convert to lowercase
    let normalizedHandle = null;
    if (referrerXHandle && referrerXHandle.trim()) {
      normalizedHandle = referrerXHandle.trim().replace(/^@/, '').toLowerCase();
      // Add @ prefix for consistency
      normalizedHandle = `@${normalizedHandle}`;
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Security verification is required' })
      }
    }

    const isTurnstileValid = await verifyTurnstile(turnstileToken);
    if (!isTurnstileValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Security verification failed. Please try again.' })
      }
    }

    // Time-based validation (reject if < 2 seconds or > 30 minutes)
    if (timeSpent < 2 || timeSpent > 1800) {
      console.log(`Suspicious timing: ${timeSpent} seconds`);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid submission. Please try again.' })
      }
    }

    // Check for disposable email domains
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Disposable email addresses are not allowed' })
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Get client IP address
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     event.headers['x-nf-client-connection-ip'] ||
                     event.headers['client-ip'] ||
                     'unknown';

    // Connect to database
    await client.connect();

    // Get active bounty event ID
    const bountyResult = await client.query(
      'SELECT id FROM bounty_events WHERE is_active = true LIMIT 1'
    );
    const activeBountyId = bountyResult.rows.length > 0 ? bountyResult.rows[0].id : null;

    // Check rate limiting - count signups from this IP in the last hour
    const rateLimitResult = await client.query(
      `SELECT COUNT(*) as count FROM beta_signups
       WHERE ip_address = $1
       AND created_at > NOW() - INTERVAL '1 hour'`,
      [clientIP]
    );

    const signupCount = parseInt(rateLimitResult.rows[0]?.count || 0);
    if (signupCount >= 5) {
      await client.end();
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ error: 'Too many signup attempts. Please try again later.' })
      };
    }

    // Save to Neon database with verification token, IP address, and bounty_event_id
    await client.query(
      'INSERT INTO beta_signups (email, referrer_x_handle, verification_token, token_expires_at, ip_address, bounty_event_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [email, normalizedHandle, verificationToken, expiresAt.toISOString(), clientIP, activeBountyId, new Date().toISOString()]
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