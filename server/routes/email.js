import express from 'express';

const router = express.Router();

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

    // Store the contact form submission in a simple way
    // This will log it to console and you can manually forward to kodr.test@gmail.com
    const contactSubmission = {
      timestamp: new Date().toISOString(),
      to: to,
      subject: subject,
      message: message,
      status: 'pending_forward'
    };

    // Log the contact form submission clearly
    console.log('\n=== NEW CONTACT FORM SUBMISSION ===');
    console.log('📧 TO:', to);
    console.log('📝 SUBJECT:', subject);
    console.log('💬 MESSAGE:', message);
    console.log('⏰ TIMESTAMP:', contactSubmission.timestamp);
    console.log('📋 STATUS: Ready to forward to kodr.test@gmail.com');
    console.log('=====================================\n');

    // You can manually copy the above details and send to kodr.test@gmail.com
    // Or set up a simple forwarding system later

    res.json({ 
      success: true, 
      message: 'Contact form submitted successfully! Your message has been received and will be responded to soon.',
      details: { 
        submitted: true,
        timestamp: contactSubmission.timestamp,
        note: 'Message logged and ready for manual forwarding'
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
