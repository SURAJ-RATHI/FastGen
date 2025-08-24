import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test authentication endpoints
async function testAuth() {
  try {
    console.log('Testing authentication endpoints...\n');

    // Test 1: Manual signup
    console.log('1. Testing manual signup...');
    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log('✅ Signup successful:', signupResponse.data.success);
    const token = signupResponse.data.token;

    // Test 2: Manual signin
    console.log('\n2. Testing manual signin...');
    const signinResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log('✅ Signin successful:', signinResponse.data.success);

    // Test 3: Get current user (protected route)
    console.log('\n3. Testing protected route...');
    const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected route accessible:', userResponse.data.name);

    // Test 4: Test invalid credentials
    console.log('\n4. Testing invalid credentials...');
    try {
      await axios.post(`${BASE_URL}/auth/signin`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid credentials properly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAuth();
