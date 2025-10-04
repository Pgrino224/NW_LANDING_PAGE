import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

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

  try {
    const { email } = JSON.parse(event.body)
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      }
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('beta_signups')
      .insert([{ 
        email,
        created_at: new Date().toISOString()
      }])
    
    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save signup')
    }
    
    // Send welcome email with Resend
    try {
      const { error: emailError } = await resend.emails.send({
        from: 'NetWorth <noreply@networth.live>',
        to: email,
        subject: 'Welcome to NetWorth Beta!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #333; }
                .content { line-height: 1.6; color: #555; }
                .cta { background: #ffffef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">NetWorth</div>
              </div>
              
              <div class="content">
                <h1>Welcome to NetWorth Beta!</h1>
                
                <p>Thank you for signing up for early access to NetWorth - where we're democratizing financial knowledge through gamification.</p>
                
                <p>You're now on our exclusive beta list. Here's what happens next:</p>
                
                <ul>
                  <li>Early access to our role-playing financial education platform</li>
                  <li>Be among the first to experience SYNCR analytics</li>
                  <li>Help shape the future of financial learning</li>
                  <li>Exclusive updates and insights from our team</li>
                </ul>
                
                <p>We'll be in touch soon with your beta access and next steps.</p>
                
                <p>Ready to build your NetWorth?</p>
                
                <p>Best regards,<br>
                <strong>The NetWorth Team</strong></p>
              </div>
              
              <div class="footer">
                <p>You're receiving this email because you signed up for NetWorth beta access at nettworth.live</p>
                <p>NetWorth - Democratizing Financial Knowledge</p>
              </div>
            </body>
          </html>
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
  }
}