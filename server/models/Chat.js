import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for faster user queries
  },
  title: {
    type: String,
    default: 'New Chat',
    trim: true,
    maxlength: 200 // Prevent extremely long titles
  },
  archived: {
    type: Boolean,
    default: false,
    index: true // Add index for filtering archived chats
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  startedAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for sorting
  }
}, {
  timestamps: true
});

// Add compound index for user + archived + startedAt
chatSchema.index({ user: 1, archived: 1, startedAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
