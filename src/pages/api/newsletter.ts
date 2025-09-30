export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Here you would normally integrate with your email service provider
    // For now, we'll just log it and return success
    console.log('Newsletter subscription:', email);
    
    // You can integrate with services like:
    // - Mailchimp
    // - ConvertKit
    // - SendGrid
    // - EmailJS
    // Example with fetch to a service:
    /*
    const response = await fetch('https://api.mailchimp.com/3.0/lists/{list_id}/members', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    });
    */

    return res.status(200).json({ 
      message: 'Successfully subscribed to newsletter',
      email 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}