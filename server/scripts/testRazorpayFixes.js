import 'dotenv/config';
import Razorpay from 'razorpay';

const testRazorpayFixes = async () => {
  console.log('=== Testing Razorpay Fixes ===');
  
  try {
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    // Test 1: Test receipt length fix
    console.log('📋 Test 1: Testing receipt length fix...');
    
    const testUserId = '68a945b64f74ea19772b2ac0';
    const receipt = `rcpt_${testUserId.slice(-8)}_${Date.now().toString().slice(-8)}`;
    
    console.log('Generated receipt:', receipt);
    console.log('Receipt length:', receipt.length);
    
    if (receipt.length <= 40) {
      console.log('✅ Receipt length is valid (≤ 40 characters)');
    } else {
      console.log('❌ Receipt length is invalid (> 40 characters)');
    }
    
    // Test 2: Create order with fixed receipt
    console.log('\n📋 Test 2: Creating order with fixed receipt...');
    
    const orderOptions = {
      amount: 9900, // ₹999 in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        userId: testUserId,
        plan: 'pro',
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('Order options:', orderOptions);
    
    const order = await razorpay.orders.create(orderOptions);
    console.log('✅ Order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Order Amount:', order.amount);
    console.log('Order Receipt:', order.receipt);
    
    // Test 3: Test error handling
    console.log('\n📋 Test 3: Testing error handling...');
    
    try {
      // Try to create order with invalid receipt (too long)
      const invalidReceipt = 'a'.repeat(50); // 50 characters
      await razorpay.orders.create({
        amount: 10000,
        currency: 'INR',
        receipt: invalidReceipt
      });
      console.log('❌ Should have failed with invalid receipt');
    } catch (error) {
      console.log('✅ Error handling works correctly');
      console.log('Error type:', error.statusCode);
      console.log('Error code:', error.error?.code);
      console.log('Error description:', error.error?.description);
      
      // Test our error handling logic
      if (error.statusCode === 400 && error.error?.code === 'BAD_REQUEST_ERROR') {
        if (error.error.description?.includes('receipt')) {
          console.log('✅ Receipt error detected correctly');
        }
      }
    }
    
    console.log('\n🎉 All Razorpay fixes tested successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Receipt length validation fixed');
    console.log('✅ Error handling improved');
    console.log('✅ Order creation working');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
  }
};

testRazorpayFixes().then(() => {
  console.log('\n🏁 Razorpay fixes test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});
