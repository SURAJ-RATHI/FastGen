import express from 'express';
import Razorpay from 'razorpay';
import User from '../models/User.js';

const router = express.Router();

// Initialize Razorpay

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
}

// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} catch (error) {
}

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Validate request body
    const { amount, currency = 'INR', plan } = req.body;
    const userId = req.user.userId;

    if (!amount || !plan) {
      return res.status(400).json({ error: 'Amount and plan are required' });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    // Check Razorpay configuration
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    // Check if Razorpay is properly initialized
    if (!razorpay) {
      return res.status(500).json({ error: 'Payment service initialization failed' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `rcpt_${userId.slice(-8)}_${Date.now().toString().slice(-8)}`, // Max 40 chars
      notes: {
        userId: userId,
        plan: plan,
        timestamp: new Date().toISOString()
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });

  } catch (error) {
    
    // Handle Razorpay specific errors
    if (error.statusCode === 400 && error.error?.code === 'BAD_REQUEST_ERROR') {
      if (error.error.description?.includes('receipt')) {
        res.status(400).json({ error: 'Invalid receipt format' });
      } else if (error.error.description?.includes('amount')) {
        res.status(400).json({ error: 'Invalid amount provided' });
      } else {
        res.status(400).json({ error: error.error.description || 'Invalid request' });
      }
    } else if (error.message && error.message.includes('key_id')) {
      res.status(500).json({ error: 'Invalid Razorpay configuration' });
    } else if (error.message && error.message.includes('amount')) {
      res.status(400).json({ error: 'Invalid amount provided' });
    } else {
      res.status(500).json({ error: 'Failed to create payment order' });
    }
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature, plan } = req.body;
    const userId = req.user.userId;

    if (!orderId || !paymentId || !signature || !plan) {
      return res.status(400).json({ error: 'Missing required payment details' });
    }

    // Verify payment signature
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update user subscription
    const subscriptionData = {
      plan: plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + (plan === 'pro' ? 30 : 365) * 24 * 60 * 60 * 1000), // 30 days for pro, 365 for enterprise
      paymentId: paymentId,
      orderId: orderId
    };

    await User.findByIdAndUpdate(userId, {
      subscription: subscriptionData
    });

    res.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: subscriptionData
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get user subscription status
router.get('/subscription-status', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('subscription');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscription = user.subscription || { status: 'free', plan: 'free' };

    // Check if subscription is expired
    if (subscription.status === 'active' && subscription.endDate && new Date() > new Date(subscription.endDate)) {
      subscription.status = 'expired';
      await User.findByIdAndUpdate(userId, { 'subscription.status': 'expired' });
    }

    res.json({
      success: true,
      subscription: subscription
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

export default router;
