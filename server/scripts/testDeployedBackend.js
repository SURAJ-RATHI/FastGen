import axios from 'axios';

const testDeployedBackend = async () => {
  const backendURL = 'https://fastgen-5i9n.onrender.com';
  
  console.log(`🔗 Testing deployed backend: ${backendURL}`);
  
  try {
    // Test health endpoint
    console.log('Testing /health endpoint...');
    const healthResponse = await axios.get(`${backendURL}/health`, {
      timeout: 10000
    });
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test CORS endpoint
    console.log('\nTesting /test-cors endpoint...');
    const corsResponse = await axios.get(`${backendURL}/test-cors`, {
      timeout: 10000,
      headers: {
        'Origin': 'https://fastgen-ai.vercel.app'
      }
    });
    console.log('✅ CORS test passed:', corsResponse.data);
    
    // Test payment endpoint (should return 401 without auth)
    console.log('\nTesting /api/payments/create-order endpoint...');
    try {
      const paymentResponse = await axios.post(`${backendURL}/api/payments/create-order`, {
        amount: 100,
        plan: 'pro'
      }, {
        timeout: 10000,
        headers: {
          'Origin': 'https://fastgen-ai.vercel.app',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Payment endpoint accessible:', paymentResponse.status);
    } catch (paymentError) {
      if (paymentError.response?.status === 401) {
        console.log('✅ Payment endpoint accessible (401 Unauthorized - expected)');
      } else {
        console.log('❌ Payment endpoint error:', paymentError.response?.status, paymentError.message);
      }
    }
    
    console.log('\n🎉 Backend is working! Update your frontend with:');
    console.log(`VITE_APP_BE_BASEURL=${backendURL}`);
    
  } catch (error) {
    console.log('❌ Backend test failed:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testDeployedBackend();
