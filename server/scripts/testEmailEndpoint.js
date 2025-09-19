import axios from 'axios';
import 'dotenv/config';

const BASE_URL = process.env.BE_BASEURL || 'http://localhost:3000';

async function testEmailEndpoint() {
  console.log('🧪 Testing Email Endpoint...');
  console.log('Base URL:', BASE_URL);
  
  const testData = {
    to: 'kodr.test@gmail.com',
    subject: 'Test Email from FastGen',
    message: 'This is a test message from the email endpoint test script.\n\nTimestamp: ' + new Date().toISOString()
  };

  try {
    console.log('\n📤 Sending test email...');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/api/email/send-email`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Email endpoint test successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('\n❌ Email endpoint test failed!');
    console.log('Error:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received. Server might not be running.');
      console.log('Request:', error.request);
    }
  }
}

testEmailEndpoint();
