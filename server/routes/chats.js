import express from 'express';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const router = express.Router();

// Create new chat
router.post('/', async (req, res) => {
  console.log('=== createChat route hit ===');
  console.log('req.user:', req.user);
  
  if (!req.user) {
    console.log('No user found for createChat, returning 401');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const newChat = await Chat.create({ user: req.user.userId });
    console.log('New chat created:', newChat);
    
    if (!newChat._id) {
      console.error('Chat created but no _id returned!');
      return res.status(500).json({ error: 'Failed to create new chat: No ID returned' });
    }
    
    res.status(201).json(newChat);
  } catch (error) {
    console.error('=== Error in createChat ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create new chat' });
  }
});

// fetch chat - OPTIMIZED
router.get('/getChat', async (req, res) => {
  console.log('=== getChat route hit ===');
  console.log('req.user:', req.user);
  
  if (!req.user) {
    console.log('No user found, returning 401');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { 
      includeArchived = false, 
      limit = 20, 
      page = 1,
      sort = 'updatedAt'
    } = req.query;
    
    console.log('User authenticated, fetching chats for user:', req.user.userId);
    
    // Build query - exclude archived by default unless specifically requested
    const query = { user: req.user.userId };
    if (!includeArchived) {
      query.archived = { $ne: true };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Optimized query - only get essential fields and limit messages
    const chats = await Chat.find(query)
      .select('title startedAt updatedAt messages')
      .populate({
        path: 'messages',
        select: 'content sender sentAt',
        options: { 
          sort: { sentAt: 1 },
          limit: 1 // Only get first message for preview
        }
      })
      .sort({ [sort]: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    console.log('Chats found:', chats.length);
    res.json(chats);
  } catch (error) {
    console.error('=== Error in getChat ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get shared chat (public access) - MUST come before /:chatId to avoid route conflicts
router.get('/public/:chatId', async (req, res) => {
  const { chatId } = req.params;
  
  try {
    // Find the chat directly by ID
    const chat = await Chat.findById(chatId)
      .populate({
        path: 'messages',
        options: { sort: { sentAt: 1 } } // Sort messages by sentAt
      })
      .populate('user', 'name email');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Return chat data (without sensitive user info)
    res.json({
      chatId: chat._id,
      title: chat.title,
      startedAt: chat.startedAt,
      messages: chat.messages,
      sharedBy: chat.user.name || 'Anonymous',
      shareType: 'public'
    });

  } catch (error) {
    console.error('Error fetching shared chat:', error);
    res.status(500).json({ error: 'Failed to fetch shared chat' });
  }
});

// Get single chat by ID
router.get('/:chatId', async (req, res) => {
  const { chatId } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId })
      .populate({
        path: 'messages',
        options: { sort: { sentAt: 1 } }
      });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Get archived chats
router.get('/archived/list', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const archivedChats = await Chat.find({ 
      user: req.user.userId, 
      archived: true 
    })
      .populate({
        path: 'messages',
        options: { sort: { sentAt: 1 } }
      })
      .sort({ updatedAt: -1 });

    res.json(archivedChats);
  } catch (error) {
    console.error('Error fetching archived chats:', error);
    res.status(500).json({ error: 'Failed to fetch archived chats' });
  }
});

// Delete chat
router.delete('/:chatId', async (req, res) => {
  const { chatId } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Find the chat and verify ownership
    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Delete all messages associated with this chat
    await Message.deleteMany({ chat: chatId });
    
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// Share chat functionality
router.post('/:chatId/share', async (req, res) => {
  const { chatId } = req.params;
  const { shareType, email, permission } = req.body; // shareType: 'public', 'private', 'email'
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Find the chat and verify ownership
    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId })
      .populate('messages');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    let shareResult = {};

    switch (shareType) {
      case 'public':
        // Use chat ID directly for sharing
        shareResult = {
          type: 'public',
          shareId: chatId,
          shareUrl: `${process.env.FRONTEND_URL || 'https://fastgen-ai.vercel.app'}/shared-chat/${chatId}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        };
        break;

      case 'email':
        if (!email) {
          return res.status(400).json({ error: 'Email is required for email sharing' });
        }
        // Here you would implement email sending logic
        // For now, just return success
        shareResult = {
          type: 'email',
          email: email,
          message: 'Chat shared via email successfully'
        };
        break;

      case 'private':
        // Use chat ID directly for private sharing
        shareResult = {
          type: 'private',
          shareId: chatId,
          shareUrl: `${process.env.FRONTEND_URL || 'https://fastgen-ai.vercel.app'}/shared-chat/${chatId}`,
          requiresPassword: true,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid share type' });
    }

    res.json({ 
      success: true, 
      chatId: chatId,
      chatTitle: chat.title,
      share: shareResult
    });

  } catch (error) {
    console.error('Error sharing chat:', error);
    res.status(500).json({ error: 'Failed to share chat' });
  }
});



// Bulk delete chats
router.delete('/bulk/delete', async (req, res) => {
  const { chatIds } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
    return res.status(400).json({ error: 'Chat IDs array is required' });
  }

  try {
    // Verify ownership of all chats
    const chats = await Chat.find({ 
      _id: { $in: chatIds }, 
      user: req.user.userId 
    });

    if (chats.length !== chatIds.length) {
      return res.status(400).json({ error: 'Some chats not found or access denied' });
    }

    // Delete all messages associated with these chats
    await Message.deleteMany({ chat: { $in: chatIds } });
    
    // Delete the chats
    await Chat.deleteMany({ _id: { $in: chatIds } });
    
    res.json({ 
      message: `${chats.length} chats deleted successfully`,
      deletedCount: chats.length
    });
  } catch (error) {
    console.error('Error bulk deleting chats:', error);
    res.status(500).json({ error: 'Failed to delete chats' });
  }
});

// Archive chat (soft delete)
router.put('/:chatId/archive', async (req, res) => {
  const { chatId } = req.params;
  const { archived } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Find the chat and verify ownership
    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Update archived status
    await Chat.findByIdAndUpdate(chatId, { archived: archived });
    
    res.json({ 
      success: true, 
      message: `Chat ${archived ? 'archived' : 'unarchived'} successfully`,
      archived: archived
    });
  } catch (error) {
    console.error('Error archiving chat:', error);
    res.status(500).json({ error: 'Failed to archive chat' });
  }
});

// Restore archived chat
router.put('/:chatId/restore', async (req, res) => {
  const { chatId } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Find the chat and verify ownership
    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Restore chat (set archived to false)
    await Chat.findByIdAndUpdate(chatId, { archived: false });
    
    res.json({ 
      success: true, 
      message: 'Chat restored successfully',
      archived: false
    });
  } catch (error) {
    console.error('Error restoring chat:', error);
    res.status(500).json({ error: 'Failed to restore chat' });
  }
});

// Get chat statistics
router.get('/stats/summary', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const totalChats = await Chat.countDocuments({ user: req.user.userId });
    const activeChats = await Chat.countDocuments({ user: req.user.userId, archived: { $ne: true } });
    const archivedChats = await Chat.countDocuments({ user: req.user.userId, archived: true });
    
    // Get total messages across all chats
    const totalMessages = await Message.countDocuments({
      chat: { $in: await Chat.find({ user: req.user.userId }).distinct('_id') }
    });

    // Get recent activity (chats created in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentChats = await Chat.countDocuments({
      user: req.user.userId,
      createdAt: { $gte: weekAgo }
    });

    res.json({
      totalChats,
      activeChats,
      archivedChats,
      totalMessages,
      recentChats,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching chat statistics:', error);
    res.status(500).json({ error: 'Failed to fetch chat statistics' });
  }
});

export default router;