import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
      user: process.env.EMAIL_USER || 'kodr.test@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email route
router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, and message are required' 
      });
    }

    // Log the email details
    console.log('Sending email:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());

    // Create email transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"FastGen App" <kodr.test@gmail.com>',
      to: to,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>From:</strong> ${to}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3>Message:</h3>
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from the FastGen contact form.
          </p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n=== EMAIL SENT SUCCESSFULLY ===');
    console.log('📧 TO:', to);
    console.log('📝 SUBJECT:', subject);
    console.log('💬 MESSAGE:', message);
    console.log('⏰ TIMESTAMP:', new Date().toISOString());
    console.log('📋 STATUS: Email sent successfully');
    console.log('📬 Message ID:', info.messageId);
    console.log('=====================================\n');

    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully! Your message has been sent and will be responded to soon.',
      details: { 
        submitted: true,
        timestamp: new Date().toISOString(),
        messageId: info.messageId,
        note: 'Email sent successfully to ' + to
      }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

export default router;
