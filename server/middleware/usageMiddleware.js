import UserUsage from '../models/UserUsage.js';
import User from '../models/User.js';

// Middleware to check usage limits for free users
export const checkUsageLimit = (actionType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.user.userId;
      
      // Get user's subscription plan
      const user = await User.findById(userId).select('subscription');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userPlan = user.subscription?.plan || 'free';
      const subscriptionStatus = user.subscription?.status || 'free';
      const endDate = user.subscription?.endDate;
      
      // Check if subscription is expired
      if (userPlan !== 'free' && endDate && new Date() > new Date(endDate)) {
        // Update subscription status to expired
        await User.findByIdAndUpdate(userId, { 
          'subscription.status': 'expired',
          'subscription.plan': 'free'
        });
        // Continue with free plan limits
      } else if ((userPlan === 'pro' || userPlan === 'enterprise') && subscriptionStatus === 'active') {
        // Pro and Enterprise users with active subscriptions have unlimited access
        return next();
      }

      // Get or create usage record for current day
      const usage = await UserUsage.getOrCreateUsage(userId);
      
      // Check if user can perform the action
      const canPerform = usage.canPerformAction(actionType, 'free'); // Always use free limits for expired/free users
      
      // Log usage check for debugging
      console.log(`Usage check for user ${userId}, action: ${actionType}, plan: free, used: ${canPerform.used}, limit: ${canPerform.limit}, allowed: ${canPerform.allowed}`);
      
      if (!canPerform.allowed) {
        console.log(`Usage limit exceeded for user ${userId}, action: ${actionType}, used: ${canPerform.used}/${canPerform.limit}`);
        return res.status(429).json({
          error: 'Daily usage limit exceeded',
          message: `You have reached your daily limit of ${canPerform.limit} ${actionType.replace(/([A-Z])/g, ' $1').toLowerCase()}. Upgrade to Pro for unlimited access.`,
          usage: {
            used: canPerform.used,
            limit: canPerform.limit,
            remaining: canPerform.remaining
          },
          upgradeRequired: true
        });
      }

      // Pre-increment usage atomically to reserve the slot
      try {
        await usage.incrementUsage(actionType);
        console.log(`Pre-incremented ${actionType} usage for user ${userId}`);
        
        // Add flag to indicate usage was already incremented
        req.usageIncremented = true;
        req.usage = usage;
        req.canPerform = canPerform;
      } catch (incrementError) {
        console.error('Failed to increment usage:', incrementError);
        // If increment fails, block the request
        return res.status(500).json({ 
          error: 'Failed to process request',
          message: 'Unable to track usage. Please try again.'
        });
      }
      
      next();
    } catch (error) {
      console.error('Usage middleware error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        userId: req.user?.userId,
        actionType,
        errorMessage: error.message,
        errorName: error.name
      });
      
      // Block requests when usage check fails to prevent bypassing limits
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: 'Unable to process request. Please try again later.'
      });
    }
  };
};

// Middleware to increment usage after successful action
export const incrementUsage = (actionType) => {
  return async (req, res, next) => {
    try {
      if (req.usage && req.canPerform) {
        await req.usage.incrementUsage(actionType);
        console.log(`Incremented ${actionType} usage for user ${req.user.userId}`);
      }
      next();
    } catch (error) {
      console.error('Usage increment error:', error);
      // Don't fail the request if usage increment fails
      next();
    }
  };
};
