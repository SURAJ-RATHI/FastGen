import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true // Add index for faster queries
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 10000 // Prevent extremely long messages
  },
  sentAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting
  }
}, {
  timestamps: true
});

// Add compound index for chat + sentAt for efficient message retrieval
messageSchema.index({ chat: 1, sentAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
