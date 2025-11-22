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
userUsageSchema.statics.getOrCreateUsage = async function(userId, timezone = 'UTC') {
  try {
    // Use UTC by default to maintain consistency
    // Future improvement: Store user timezone and use it here
    const now = new Date();
    
    // For now, use UTC midnight for all users
    // This ensures consistency across the system
    const currentDate = now.toISOString().slice(0, 10); // "2024-01-15"
    
    let usage = await this.findOne({ userId, date: currentDate });
    
    if (!usage) {
      try {
        usage = await this.create({
          userId,
          date: currentDate,
          chatbotChats: 0,
          videoRecommendations: 0,
          contentGenerations: 0
        });
      } catch (createError) {
        // Handle race condition: if another request created the record between findOne and create
        if (createError.code === 11000 || createError.name === 'MongoServerError') {
          // Duplicate key error - try to find the record again
          usage = await this.findOne({ userId, date: currentDate });
          if (!usage) {
            throw new Error('Failed to create or find usage record after duplicate key error');
          }
        } else {
          throw createError;
        }
      }
    }
    
    return usage;
  } catch (error) {
    console.error('Error in getOrCreateUsage:', error);
    throw error;
  }
};

// Method to check if user can perform action
userUsageSchema.methods.canPerformAction = function(actionType, userPlan) {
  return {
    allowed: true,
    remaining: 999999,
    limit: 999999,
    used: this[actionType] || 0
  };
};

// Method to increment usage atomically
userUsageSchema.methods.incrementUsage = async function(actionType) {
  try {
    // Ensure _id exists
    if (!this._id) {
      throw new Error('Cannot increment usage: Usage record has no _id');
    }
    
    // Ensure actionType field exists
    if (this[actionType] === undefined) {
      this[actionType] = 0;
    }
    
    // Use atomic findOneAndUpdate to prevent race conditions
    const UserUsageModel = this.constructor;
    const updated = await UserUsageModel.findOneAndUpdate(
      { _id: this._id },
      { $inc: { [actionType]: 1 } },
      { new: true }
    );
    
    if (!updated) {
      // Fallback to regular save if atomic update fails
      console.warn(`Atomic increment failed for ${actionType}, attempting regular save`);
      this[actionType] = (this[actionType] || 0) + 1;
      await this.save();
      return this;
    }
    
    // Update local instance with new values
    this[actionType] = updated[actionType];
    
    return updated;
  } catch (error) {
    console.error(`Error incrementing ${actionType} usage:`, error);
    console.error(`Error details: _id=${this._id}, actionType=${actionType}, currentValue=${this[actionType]}`);
    throw error;
  }
};

const UserUsage = mongoose.model('UserUsage', userUsageSchema);

export default UserUsage;
