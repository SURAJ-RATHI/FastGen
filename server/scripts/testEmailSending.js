import axios from 'axios';
import 'dotenv/config';

const BASE_URL = process.env.BE_BASEURL || 'http://localhost:3000';

async function testEmailSending() {
  console.log('🧪 Testing Email Sending Functionality...');
  console.log('Base URL:', BASE_URL);
  
  const testData = {
    to: 'kodr.test@gmail.com',
    subject: 'Test Email from FastGen - Contact Form',
    message: `Hello!

This is a test message from the FastGen contact form.

Test Details:
- Name: Test User
- Email: test@example.com
- Message: Testing email functionality
- Timestamp: ${new Date().toISOString()}

If you receive this email, the contact form is working correctly!

Best regards,
FastGen Team`
  };

  try {
    console.log('\n📤 Sending test email...');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/api/email/send-email`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Email sending test successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n📧 Check your email inbox at kodr.test@gmail.com for the test message!');

  } catch (error) {
    console.log('\n❌ Email sending test failed!');
    console.log('Error:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received. Server might not be running.');
      console.log('Make sure to start the server with: npm start');
    }
  }
}

testEmailSending();
