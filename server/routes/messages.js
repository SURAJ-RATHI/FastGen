import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';

const router = express.Router();

// POST /messages — Add a message to a chat
router.post('/', async (req, res) => {
  const { chatId, sender, content } = req.body;

  if (!chatId || !sender || !content) {
    return res.status(400).json({ error: 'chatId, sender, and content are required' });
  }

  try {
    const message = await Message.create({
      chat: chatId,
      sender,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// GET /messages/:chatId — Get all messages in a chat
router.get('/:chatId', async (req, res) => {
  const { chatId } = req.params;

  // Validate chatId is a valid ObjectId
  if (!chatId || chatId === 'undefined' || chatId === 'NaN' || !mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: 'Invalid chat ID' });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .sort({ sentAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
