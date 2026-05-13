const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers for the frontend to access
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { humidity, temperature, subscribers } = req.body;

  if (!humidity || !temperature || !subscribers || !Array.isArray(subscribers)) {
    return res.status(400).json({ error: 'Missing required fields: humidity, temperature, subscribers (array).' });
  }

  // Bloom Logic: High humidity and temp between 24-30°C
  const isBloomLikely = humidity > 80 && temperature >= 24 && temperature <= 30;

  if (isBloomLikely) {
    try {
      // Setup Nodemailer (Using ethereal.email for demonstration/mocking)
      // In production, use real SMTP credentials from env variables
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: 'elisha.schmeler@ethereal.email', // Replace with process.env.SMTP_USER
          pass: 'U7X8N6J4Z6H6X9X1'              // Replace with process.env.SMTP_PASS
        }
      });

      const mailPromises = subscribers.map(email => 
        transporter.sendMail({
          from: '"Adarsh Farm 🌸" <alerts@adarshfarm.com>',
          to: email,
          subject: "Night-Bloom Expected! 🌸",
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h1 style="color: #FF3377;">Night-Bloom Alert!</h1>
              <p>Hello Farmer,</p>
              <p>Conditions at the farm are perfect for a dragon fruit bloom tonight:</p>
              <ul>
                <li><b>Temperature:</b> ${temperature}°C</li>
                <li><b>Humidity:</b> ${humidity}%</li>
              </ul>
              <p>Don't miss this spectacular event! Get your cameras ready.</p>
              <br>
              <p style="color: #666; font-size: 12px;">Adarsh Dragon Fruit Farm Monitoring System</p>
            </div>
          `
        })
      );

      await Promise.all(mailPromises);
      return res.status(200).json({ 
        success: true, 
        message: 'Bloom alert notifications sent!',
        data: { humidity, temperature }
      });
    } catch (error) {
      console.error('Mail Error:', error);
      return res.status(500).json({ error: 'Failed to send notifications' });
    }
  }

  return res.status(200).json({ 
    success: false, 
    message: 'Conditions not optimal for bloom alert.',
    data: { humidity, temperature }
  });
};
