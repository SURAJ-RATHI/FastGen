import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import UserUsage from '../models/UserUsage.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's current usage status
router.get('/status', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's subscription plan
    const user = await User.findById(userId).select('subscription');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPlan = user.subscription?.plan || 'free';
    
    // Get or create usage record for current month
    const usage = await UserUsage.getOrCreateUsage(userId);
    
    // Define limits based on plan
    const limits = {
      free: {
        chatbotChats: 5,
        videoRecommendations: 2,
        contentGenerations: 2
      },
      pro: {
        chatbotChats: 'unlimited',
        videoRecommendations: 'unlimited',
        contentGenerations: 'unlimited'
      },
      enterprise: {
        chatbotChats: 'unlimited',
        videoRecommendations: 'unlimited',
        contentGenerations: 'unlimited'
      }
    };

    const planLimits = limits[userPlan] || limits.free;
    
    // Calculate usage status for each feature
    const usageStatus = {
      chatbotChats: {
        used: usage.chatbotChats || 0,
        limit: planLimits.chatbotChats,
        remaining: planLimits.chatbotChats === 'unlimited' ? 'unlimited' : Math.max(0, planLimits.chatbotChats - (usage.chatbotChats || 0))
      },
      videoRecommendations: {
        used: usage.videoRecommendations || 0,
        limit: planLimits.videoRecommendations,
        remaining: planLimits.videoRecommendations === 'unlimited' ? 'unlimited' : Math.max(0, planLimits.videoRecommendations - (usage.videoRecommendations || 0))
      },
      contentGenerations: {
        used: usage.contentGenerations || 0,
        limit: planLimits.contentGenerations,
        remaining: planLimits.contentGenerations === 'unlimited' ? 'unlimited' : Math.max(0, planLimits.contentGenerations - (usage.contentGenerations || 0))
      }
    };

    res.json({
      success: true,
      plan: userPlan,
      month: usage.month,
      usage: usageStatus
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to get usage status' });
  }
});

export default router;
