import 'dotenv/config';
import axios from 'axios';

const debugPaymentEndpoint = async () => {
  const backendURL = 'https://fastgen-5i9n.onrender.com';
  
  console.log('🔍 Debugging payment endpoint...');
  
  // Test different scenarios
  const testCases = [
    {
      name: 'Health check',
      method: 'GET',
      url: '/health',
      data: null
    },
    {
      name: 'Payment endpoint without auth',
      method: 'POST',
      url: '/api/payments/create-order',
      data: { amount: 99, plan: 'pro' }
    },
    {
      name: 'Payment endpoint with minimal data',
      method: 'POST',
      url: '/api/payments/create-order',
      data: { amount: 100, plan: 'pro' }
    },
    {
      name: 'Payment endpoint with invalid data',
      method: 'POST',
      url: '/api/payments/create-order',
      data: { amount: 'invalid', plan: 'pro' }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n📋 Testing: ${testCase.name}`);
      
      const config = {
        method: testCase.method,
        url: `${backendURL}${testCase.url}`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://fastgen-ai.vercel.app'
        }
      };
      
      if (testCase.data) {
        config.data = testCase.data;
      }
      
      const response = await axios(config);
      console.log(`✅ ${testCase.name} - Success: ${response.status}`);
      if (response.data) {
        console.log('Response:', JSON.stringify(response.data, null, 2));
      }
      
    } catch (error) {
      console.log(`❌ ${testCase.name} - Error: ${error.message}`);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else if (error.request) {
        console.log('Request error - backend might be down');
      } else {
        console.log('Other error:', error.message);
      }
    }
  }
  
  console.log('\n💡 Possible issues:');
  console.log('1. Backend crashed due to recent code changes');
  console.log('2. Environment variables missing in production');
  console.log('3. Database connection issues');
  console.log('4. Razorpay configuration problems');
  console.log('5. Render service limits exceeded');
};

debugPaymentEndpoint();
