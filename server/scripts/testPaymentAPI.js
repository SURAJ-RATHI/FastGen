import 'dotenv/config';
import axios from 'axios';

const testPaymentAPI = async () => {
  console.log('=== Payment API Connection Test ===');
  
  // Test different backend URLs
  const backendURLs = [
    'https://fastgen-backend.onrender.com',
    'https://fastgen-ai-backend.vercel.app',
    'http://localhost:5000',
    'http://localhost:3000'
  ];
  
  console.log('Testing backend connectivity...\n');
  
  for (const baseURL of backendURLs) {
    try {
      console.log(`🔗 Testing: ${baseURL}`);
      
      // Test health endpoint
      const healthResponse = await axios.get(`${baseURL}/health`, {
        timeout: 5000
      });
      
      console.log(`✅ Health check passed: ${healthResponse.status}`);
      console.log(`   Response:`, healthResponse.data);
      
      // Test CORS endpoint
      const corsResponse = await axios.get(`${baseURL}/test-cors`, {
        timeout: 5000,
        headers: {
          'Origin': 'https://fastgen-ai.vercel.app'
        }
      });
      
      console.log(`✅ CORS test passed: ${corsResponse.status}`);
      console.log(`   CORS Response:`, corsResponse.data);
      
      // Test payment endpoint (without auth)
      try {
        const paymentResponse = await axios.post(`${baseURL}/api/payments/create-order`, {
          amount: 100,
          plan: 'pro'
        }, {
          timeout: 5000,
          headers: {
            'Origin': 'https://fastgen-ai.vercel.app',
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Payment endpoint accessible: ${paymentResponse.status}`);
      } catch (paymentError) {
        if (paymentError.response?.status === 401) {
          console.log(`✅ Payment endpoint accessible (401 Unauthorized - expected)`);
        } else {
          console.log(`❌ Payment endpoint error: ${paymentError.response?.status} - ${paymentError.message}`);
        }
      }
      
      console.log(`\n🎉 ${baseURL} is working!\n`);
      
    } catch (error) {
      console.log(`❌ ${baseURL} failed:`);
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
      console.log('');
    }
  }
  
  console.log('\n=== Frontend Configuration Recommendation ===');
  console.log('Based on the tests above, update your frontend .env file:');
  console.log('VITE_APP_BE_BASEURL=<working_backend_url>');
  console.log('\nFor Vercel deployment, set this as an environment variable in Vercel dashboard.');
};

testPaymentAPI().then(() => {
  console.log('\n🏁 Payment API test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Payment API test crashed:', error);
  process.exit(1);
});
