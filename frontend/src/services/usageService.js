import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BE_BASEURL || 'https://fastgen-5i9n.onrender.com';

class UsageService {
  // Get current usage status
  async getUsageStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/usage/status`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting usage status:', error);
      throw error;
    }
  }

  // Format usage data for display
  formatUsageForDisplay(usageData) {
    if (!usageData || !usageData.success) {
      return null;
    }

    const { plan, usage } = usageData;
    
    return {
      plan,
      chatbotChats: {
        used: usage.chatbotChats.used,
        limit: usage.chatbotChats.limit,
        remaining: usage.chatbotChats.remaining,
        isUnlimited: usage.chatbotChats.limit === 'unlimited'
      },
      videoRecommendations: {
        used: usage.videoRecommendations.used,
        limit: usage.videoRecommendations.limit,
        remaining: usage.videoRecommendations.remaining,
        isUnlimited: usage.videoRecommendations.limit === 'unlimited'
      },
      contentGenerations: {
        used: usage.contentGenerations.used,
        limit: usage.contentGenerations.limit,
        remaining: usage.contentGenerations.remaining,
        isUnlimited: usage.contentGenerations.limit === 'unlimited'
      }
    };
  }

  // Check if user is approaching limit
  isApproachingLimit(usageItem) {
    if (usageItem.isUnlimited) return false;
    return usageItem.remaining <= 1 && usageItem.remaining > 0;
  }

  // Check if user has reached limit
  hasReachedLimit(usageItem) {
    if (usageItem.isUnlimited) return false;
    return usageItem.remaining === 0;
  }
}

export default new UsageService();
