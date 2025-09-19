import axios from 'axios';

const testBackend = async () => {
  const backendURL = 'https://fastgen-5i9n.onrender.com';
  
  console.log('🔍 Testing backend connectivity...');
  
  try {
    // Test health endpoint
    console.log('Testing /health endpoint...');
    const healthResponse = await axios.get(`${backendURL}/health`, {
      timeout: 10000
    });
    console.log('✅ Backend is running!');
    console.log('Status:', healthResponse.status);
    console.log('Data:', healthResponse.data);
    
    // Test payment endpoint
    console.log('\nTesting /api/payments/create-order endpoint...');
    try {
      const paymentResponse = await axios.post(`${backendURL}/api/payments/create-order`, {
        amount: 999,
        plan: 'pro'
      }, {
        headers: {
          'Origin': 'https://fastgen-ai.vercel.app',
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 10000
      });
      
      console.log('✅ Payment endpoint accessible:', paymentResponse.status);
    } catch (paymentError) {
      if (paymentError.response?.status === 401) {
        console.log('✅ Payment endpoint accessible (401 Unauthorized - expected)');
      } else {
        console.log('❌ Payment endpoint error:', paymentError.message);
        console.log('Status:', paymentError.response?.status);
      }
    }
    
  } catch (error) {
    console.log('❌ Backend is not accessible!');
    console.log('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend is likely sleeping (free tier)');
      console.log('   - Wait 30-60 seconds for it to wake up');
      console.log('   - Or upgrade to paid tier for always-on service');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Backend URL might be wrong or service is down');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('💡 Backend is taking too long to respond');
    }
  }
};

testBackend();
