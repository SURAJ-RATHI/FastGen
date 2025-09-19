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
      
      // Pro and Enterprise users have unlimited access
      if (userPlan === 'pro' || userPlan === 'enterprise') {
        return next();
      }

      // Get or create usage record for current month
      const usage = await UserUsage.getOrCreateUsage(userId);
      
      // Check if user can perform the action
      const canPerform = usage.canPerformAction(actionType, userPlan);
      
      if (!canPerform.allowed) {
        return res.status(429).json({
          error: 'Monthly usage limit exceeded',
          message: `You have reached your monthly limit of ${canPerform.limit} ${actionType.replace(/([A-Z])/g, ' $1').toLowerCase()}. Upgrade to Pro for unlimited access.`,
          usage: {
            used: canPerform.used,
            limit: canPerform.limit,
            remaining: canPerform.remaining
          },
          upgradeRequired: true
        });
      }

      // Add usage info to request for potential increment
      req.usage = usage;
      req.canPerform = canPerform;
      
      next();
    } catch (error) {
      console.error('Usage middleware error:', error);
      res.status(500).json({ error: 'Failed to check usage limits' });
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
