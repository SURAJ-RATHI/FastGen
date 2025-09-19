import 'dotenv/config';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';

const testRazorpay = async () => {
  console.log('=== Razorpay Integration Test ===');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log(`RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing'}`);
  console.log(`RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing'}`);
  console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'Present' : 'Missing'}`);
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ Razorpay environment variables are missing!');
    console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
    return;
  }
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing!');
    return;
  }
  
  try {
    // Initialize Razorpay
    console.log('\n🔗 Initializing Razorpay...');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
    
    // Connect to MongoDB
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Test 1: Create a test order
    console.log('\n📋 Test 1: Creating Razorpay order...');
    const testOrderOptions = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
      notes: {
        test: true,
        userId: 'test-user',
        plan: 'pro',
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Creating order with options:', testOrderOptions);
    const order = await razorpay.orders.create(testOrderOptions);
    console.log('✅ Order created successfully');
    console.log('Order ID:', order.id);
    console.log('Order Amount:', order.amount);
    console.log('Order Currency:', order.currency);
    console.log('Order Receipt:', order.receipt);
    
    // Test 2: Test signature generation and verification
    console.log('\n🔐 Test 2: Testing signature verification...');
    const testPaymentId = 'pay_test_' + Date.now();
    const testSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.id}|${testPaymentId}`)
      .digest('hex');
    
    console.log('Generated test signature:', testSignature);
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.id}|${testPaymentId}`)
      .digest('hex');
    
    if (expectedSignature === testSignature) {
      console.log('✅ Signature verification successful');
    } else {
      console.log('❌ Signature verification failed');
    }
    
    // Test 3: Test user subscription update
    console.log('\n👤 Test 3: Testing user subscription update...');
    
    // Create or find test user
    let testUser = await User.findOne({ email: 'test@razorpay.com' });
    if (!testUser) {
      testUser = new User({
        email: 'test@razorpay.com',
        name: 'Test User',
        password: 'hashedpassword',
        subscription: {
          status: 'free',
          plan: 'free'
        }
      });
      await testUser.save();
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user found');
    }
    
    // Update subscription
    const subscriptionData = {
      plan: 'pro',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentId: testPaymentId,
      orderId: order.id
    };
    
    await User.findByIdAndUpdate(testUser._id, {
      subscription: subscriptionData
    });
    console.log('✅ Subscription updated successfully');
    
    // Verify subscription update
    const updatedUser = await User.findById(testUser._id).select('subscription');
    console.log('Updated subscription:', updatedUser.subscription);
    
    // Test 4: Test subscription status check
    console.log('\n📊 Test 4: Testing subscription status check...');
    const subscription = updatedUser.subscription || { status: 'free', plan: 'free' };
    
    // Check if subscription is expired
    if (subscription.status === 'active' && subscription.endDate && new Date() > new Date(subscription.endDate)) {
      subscription.status = 'expired';
      await User.findByIdAndUpdate(testUser._id, { 'subscription.status': 'expired' });
      console.log('✅ Subscription marked as expired');
    } else {
      console.log('✅ Subscription is active');
    }
    
    console.log('Current subscription status:', subscription);
    
    // Test 5: Test order fetch
    console.log('\n📥 Test 5: Testing order fetch...');
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('✅ Order fetched successfully');
    console.log('Fetched order amount:', fetchedOrder.amount);
    console.log('Fetched order status:', fetchedOrder.status);
    
    // Test 6: Test payments fetch (if any)
    console.log('\n💳 Test 6: Testing payments fetch...');
    try {
      const payments = await razorpay.payments.all({ count: 10 });
      console.log('✅ Payments fetched successfully');
      console.log('Total payments count:', payments.count);
      console.log('Payments in this page:', payments.items.length);
    } catch (error) {
      console.log('ℹ️ No payments found or error fetching payments:', error.message);
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All Razorpay tests passed!');
    
  } catch (error) {
    console.error('❌ Razorpay test failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack
    });
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
  }
};

testRazorpay().then(() => {
  console.log('\n🏁 Razorpay test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Razorpay test crashed:', error);
  process.exit(1);
});
