import mongoose from 'mongoose';

const userUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: "2024-01-15" for January 15, 2024
    required: true
  },
  chatbotChats: {
    type: Number,
    default: 0
  },
  videoRecommendations: {
    type: Number,
    default: 0
  },
  contentGenerations: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create compound index to ensure one usage record per user per day
userUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

// Static method to get or create usage record for current day
userUsageSchema.statics.getOrCreateUsage = async function(userId) {
  const currentDate = new Date().toISOString().slice(0, 10); // "2024-01-15"
  
  let usage = await this.findOne({ userId, date: currentDate });
  
  if (!usage) {
    usage = await this.create({
      userId,
      date: currentDate,
      chatbotChats: 0,
      videoRecommendations: 0,
      contentGenerations: 0
    });
  }
  
  return usage;
};

// Method to check if user can perform action
userUsageSchema.methods.canPerformAction = function(actionType, userPlan) {
  if (userPlan === 'pro' || userPlan === 'enterprise') {
    return { allowed: true, remaining: 'unlimited' };
  }
  
  const limits = {
    chatbotChats: 10,
    videoRecommendations: 2,
    contentGenerations: 2
  };
  
  const currentUsage = this[actionType] || 0;
  const limit = limits[actionType];
  
  return {
    allowed: currentUsage < limit,
    remaining: Math.max(0, limit - currentUsage),
    limit: limit,
    used: currentUsage
  };
};

// Method to increment usage
userUsageSchema.methods.incrementUsage = function(actionType) {
  this[actionType] = (this[actionType] || 0) + 1;
  return this.save();
};

const UserUsage = mongoose.model('UserUsage', userUsageSchema);

export default UserUsage;
