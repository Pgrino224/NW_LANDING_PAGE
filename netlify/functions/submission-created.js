const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // This function triggers automatically on any form submission
  console.log('Function triggered!');
  const payload = JSON.parse(event.body);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  // Only process signup form submissions
  if (payload.payload.form_name !== 'signup') {
    console.log('Not a signup form, form_name was:', payload.payload.form_name);
    return { statusCode: 200 };
  }
  
  console.log('Processing signup form...');

  try {
    const email = payload.payload.data.email;
    
    if (!email) {
      console.error('No email provided in form submission');
      return { statusCode: 400 };
    }

    // Send welcome email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'NetWorth <welcome@nettworth.live>',
        to: [email],
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', errorText);
      return { statusCode: 500 };
    }

    const result = await response.json();
    console.log('Welcome email sent successfully:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Welcome email sent' })
    };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send welcome email' })
    };
  }
};