import 'dotenv/config';
import axios from 'axios';

const debugFrontendConnection = async () => {
  console.log('=== Frontend Connection Debug ===');
  
  const backendURL = 'https://fastgen-5i9n.onrender.com';
  
  console.log('🔍 Testing different scenarios that could cause ERR_NETWORK...\n');
  
  // Test 1: Check if backend is accessible from different origins
  console.log('📋 Test 1: Testing CORS from different origins...');
  
  const origins = [
    'https://fastgen-ai.vercel.app',
    'https://fastgen.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  for (const origin of origins) {
    try {
      console.log(`   Testing origin: ${origin}`);
      const response = await axios.get(`${backendURL}/test-cors`, {
        headers: { 'Origin': origin },
        timeout: 5000
      });
      console.log(`   ✅ ${origin} - CORS OK`);
    } catch (error) {
      console.log(`   ❌ ${origin} - CORS Error: ${error.message}`);
    }
  }
  
  // Test 2: Test payment endpoint with different configurations
  console.log('\n📋 Test 2: Testing payment endpoint configurations...');
  
  const testConfigs = [
    {
      name: 'With credentials + CORS origin',
      config: {
        headers: {
          'Origin': 'https://fastgen-ai.vercel.app',
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 10000
      }
    },
    {
      name: 'Without credentials',
      config: {
        headers: {
          'Origin': 'https://fastgen-ai.vercel.app',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    },
    {
      name: 'Minimal headers',
      config: {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    }
  ];
  
  for (const testConfig of testConfigs) {
    try {
      console.log(`   Testing: ${testConfig.name}`);
      const response = await axios.post(`${backendURL}/api/payments/create-order`, {
        amount: 100,
        plan: 'pro'
      }, testConfig.config);
      
      console.log(`   ✅ ${testConfig.name} - Success: ${response.status}`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`   ✅ ${testConfig.name} - Expected 401 (no auth)`);
      } else {
        console.log(`   ❌ ${testConfig.name} - Error: ${error.message}`);
        if (error.code === 'ERR_NETWORK') {
          console.log(`      🔍 ERR_NETWORK detected - this is the issue!`);
        }
      }
    }
  }
  
  // Test 3: Check if it's a timeout issue
  console.log('\n📋 Test 3: Testing timeout scenarios...');
  
  const timeoutTests = [1000, 5000, 10000, 30000];
  
  for (const timeout of timeoutTests) {
    try {
      console.log(`   Testing timeout: ${timeout}ms`);
      const response = await axios.get(`${backendURL}/health`, {
        timeout: timeout
      });
      console.log(`   ✅ ${timeout}ms - Success`);
    } catch (error) {
      console.log(`   ❌ ${timeout}ms - Error: ${error.message}`);
    }
  }
  
  // Test 4: Check if it's a Render cold start issue
  console.log('\n📋 Test 4: Testing Render cold start...');
  
  try {
    console.log('   Testing after 2 second delay...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await axios.get(`${backendURL}/health`, {
      timeout: 15000
    });
    console.log('   ✅ Cold start test - Success');
  } catch (error) {
    console.log(`   ❌ Cold start test - Error: ${error.message}`);
  }
  
  // Test 5: Check if it's a mixed content issue
  console.log('\n📋 Test 5: Testing HTTPS/HTTP scenarios...');
  
  const protocols = ['https', 'http'];
  
  for (const protocol of protocols) {
    try {
      const testURL = `${protocol}://fastgen-5i9n.onrender.com/health`;
      console.log(`   Testing: ${testURL}`);
      const response = await axios.get(testURL, {
        timeout: 5000
      });
      console.log(`   ✅ ${protocol} - Success`);
    } catch (error) {
      console.log(`   ❌ ${protocol} - Error: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Debug Summary:');
  console.log('If you see ERR_NETWORK errors above, the issue is:');
  console.log('1. Frontend might be using wrong URL (localhost instead of deployed URL)');
  console.log('2. CORS configuration issue');
  console.log('3. Render cold start timeout');
  console.log('4. Mixed content (HTTP vs HTTPS)');
  console.log('5. Network connectivity issue');
  
  console.log('\n💡 Solutions:');
  console.log('1. Check browser Network tab to see actual request URL');
  console.log('2. Verify VITE_APP_BE_BASEURL in Vercel environment variables');
  console.log('3. Clear browser cache and hard refresh');
  console.log('4. Check if Render service is running (might be sleeping)');
};

debugFrontendConnection().then(() => {
  console.log('\n🏁 Frontend connection debug completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Debug crashed:', error);
  process.exit(1);
});
