import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import User from "../models/User.js"
import UserPreference from "../models/UserPreference.js"
import Message from "../models/Message.js"
import Chat from "../models/Chat.js"
import dotenv from "dotenv" 
import fs from 'fs'
import path from "path"
import multer from 'multer';

const router = express.Router()
dotenv.config();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Simple in-memory storage for long-term memory (can be upgraded to database later)
const userMemory = new Map();

// Function to add message to long-term memory
function addToMemory(userId, chatId, message, sender) {
  try {
    const userIdStr = userId.toString();
    if (!userMemory.has(userIdStr)) {
      userMemory.set(userIdStr, []);
    }
    
    userMemory.get(userIdStr).push({
      content: message,
      metadata: {
        userId: userIdStr,
        chatId: chatId.toString(),
        sender: sender,
        timestamp: new Date().toISOString(),
        type: 'chat_message'
      }
    });
    
    // Keep only last 200 messages per user to prevent memory overflow
    if (userMemory.get(userIdStr).length > 200) {
      userMemory.get(userIdStr).splice(0, 100);
    }
  } catch (error) {
    console.error('Error adding to memory:', error);
  }
}

// Function to retrieve relevant context from long-term memory
function retrieveRelevantContext(userId, currentQuery, limit = 8) {
  try {
    const userIdStr = userId.toString();
    if (!userMemory.has(userIdStr)) {
      return [];
    }
    
    const userMessages = userMemory.get(userIdStr);
    const queryWords = currentQuery.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    if (queryWords.length === 0) {
      // If no meaningful words, return recent messages
      return userMessages
        .slice(-limit)
        .map(msg => ({
          content: msg.content,
          metadata: msg.metadata
        }));
    }
    
    // Simple relevance scoring based on word overlap and recency
    const scoredMessages = userMessages.map((msg, index) => {
      const contentWords = msg.content.toLowerCase().split(/\s+/);
      const overlap = queryWords.filter(word => 
        contentWords.some(contentWord => 
          contentWord.includes(word) || word.includes(contentWord)
        )
      ).length;
      
      // Boost score for recent messages
      const recencyBoost = Math.max(0, (index - userMessages.length + 50) / 50);
      const finalScore = overlap + (recencyBoost * 0.5);
      
      return { ...msg, score: finalScore, originalIndex: index };
    });
    
    // Return top scored messages
    return scoredMessages
      .filter(msg => msg.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(msg => ({
        content: msg.content,
        metadata: msg.metadata
      }));
  } catch (error) {
    console.error('Error retrieving context:', error);
    return [];
  }
}

// Function to generate chat title based on conversation content
async function generateChatTitle(messages) {
  try {
    if (messages.length < 2) {
      return 'New Chat';
    }
    
    // Take first few messages to generate title
    const conversationPreview = messages.slice(0, 3).map(msg => 
      `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n');
    
    const titlePrompt = `Generate a short, descriptive title (3-6 words) for this conversation. The title should be specific and helpful for identifying the chat later.

Conversation preview:
${conversationPreview}

Requirements:
- Keep it under 6 words
- Make it descriptive and specific
- Use title case (Capitalize Each Word)
- Focus on the main topic or purpose
- Avoid generic terms like "chat" or "conversation"

Title:`;
    
    const titleResult = await generateWithFallback(titlePrompt);
    
    // Clean up the title - remove quotes, extra text, etc.
    let cleanTitle = titleResult.trim();
    
    // Remove quotes if present
    if ((cleanTitle.startsWith('"') && cleanTitle.endsWith('"')) || 
        (cleanTitle.startsWith("'") && cleanTitle.endsWith("'"))) {
      cleanTitle = cleanTitle.slice(1, -1);
    }
    
    // Remove "Title:" prefix if present
    if (cleanTitle.toLowerCase().startsWith('title:')) {
      cleanTitle = cleanTitle.substring(6).trim();
    }
    
    // Limit length and ensure it's not empty
    if (cleanTitle.length > 50) {
      cleanTitle = cleanTitle.substring(0, 50).trim();
    }
    
    if (!cleanTitle || cleanTitle === 'New Chat') {
      return 'New Chat';
    }
    
    return cleanTitle;
  } catch (error) {
    console.error('Error generating chat title:', error);
    return 'New Chat';
  }
}

// Function to build comprehensive conversation context
async function buildConversationContext(userId, chatId, currentQuery) {
  try {
    // Get recent messages for immediate context
    const recentMessages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get relevant long-term memory
    const relevantMemory = retrieveRelevantContext(userId, currentQuery, 8);
    
    // Get user's overall chat history summary
    const userChats = await Chat.find({ user: userId })
      .populate('messages')
      .sort({ updatedAt: -1 })
      .limit(3);
    
    let context = "";
    
    // Add recent conversation context
    if (recentMessages.length > 0) {
      context += `\nRECENT CONVERSATION CONTEXT (Last ${recentMessages.length} messages):
${recentMessages.reverse().map(msg => `- ${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}`).join('\n')}`;
    }
    
    // Add relevant long-term memory
    if (relevantMemory.length > 0) {
      context += `\n\nRELEVANT PAST CONVERSATIONS (Semantically related):
${relevantMemory.map(mem => `- ${mem.metadata.sender === 'user' ? 'User' : 'AI'} (${new Date(mem.metadata.timestamp).toLocaleDateString()}): ${mem.content.substring(0, 120)}${mem.content.length > 120 ? '...' : ''}`).join('\n')}`;
    }
    
    // Add conversation patterns and user preferences
    if (userChats.length > 0) {
      const totalMessages = userChats.reduce((sum, chat) => sum + chat.messages.length, 0);
      context += `\n\nUSER CONVERSATION PATTERNS:
- Total conversations: ${userChats.length}
- Total messages across conversations: ${totalMessages}
- Most recent conversation: ${userChats[0]?.startedAt ? new Date(userChats[0].startedAt).toLocaleDateString() : 'Unknown'}`;
    }
    
    return context;
  } catch (error) {
    console.error('Error building context:', error);
    return "";
  }
}

const rawKeys = process.env.GEMINI_KEYS.split(',').map(k => k.trim());
const apiKeys = rawKeys.map(key => ({ key, active: true }));

// api rotation function
async function generateWithFallback(prompt) {
  for (const apiKeyObj of apiKeys) {
    if (!apiKeyObj.active) continue;

    try {
      const genAI = new GoogleGenerativeAI(apiKeyObj.key);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      });

      // Simplified prompt engineering for better responses
      const enhancedPrompt = `You are FastGen AI, a helpful and intelligent assistant. Provide clear, accurate, and well-structured responses.

User Query: ${prompt}

Please provide a helpful and informative response.`;
      
      const result = await model.generateContent([{ text: enhancedPrompt }]);
      const ans = result.response.text();

      return ans; // return if success
    } catch (err) {
      console.error(`API Key failed:`, err.message);

      // Check if it's a quota or usage error
      if (
        err.message.includes('quota') ||
        err.message.includes('quota_exceeded') ||
        err.message.includes('RESOURCE_EXHAUSTED') ||
        err.message.includes('PERMISSION_DENIED')
      ) {
        apiKeyObj.active = false; // deactivate key temporarily
        console.log(`API key deactivated due to quota/permission issues: ${apiKeyObj.key.substring(0, 10)}...`);
      }
      else {
        console.error(`API key error (non-quota):`, err.message);
        // Don't throw immediately, try other keys first
        continue;
      }
    }
  }

  throw new Error("All API keys failed or exhausted");
}

// gemini res request
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Extract data from form fields
    const chatId = req.body.chatId;
    const prompt = req.body.prompt;
    const contentType = req.body.contentType;
    const platform = req.body.platform;
    const parsedFileName = req.body.parsedFileName;

    console.log('=== REQUEST DEBUG ===');
    console.log('chatId:', chatId);
    console.log('prompt:', prompt);
    console.log('contentType:', contentType);
    console.log('platform:', platform);
    console.log('parsedFileName:', parsedFileName);
    console.log('file:', req.file);
    console.log('=== END DEBUG ===');

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Handle content generation (viral posts, blogs, etc.)
    if (contentType === 'viral-post') {
      try {
        const answer = await generateWithFallback(prompt);
        
        // Create a simple message record for content generation
        const userMessage = await Message.create({
          chat: chatId || 'content-generation',
          sender: 'user',
          content: prompt,
        });

        return res.json({ 
          answer,
          messageId: userMessage._id,
          contentType: 'viral-post',
          platform: platform
        });
      } catch (error) {
        console.error('Content generation error:', error);
        return res.status(500).json({ 
          error: "Failed to generate content",
          details: error.message 
        });
      }
    }

    // Handle regular chat requests
    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required for regular chat requests" });
    }

    const userMessage = await Message.create({
      chat: chatId,
      sender: 'user',
      content: prompt,
    });

    // Add message to chat's messages array
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: userMessage._id }
    });

    const userPref = await UserPreference.findOne({ user: req.user.userId });
    const user = await User.findById(req.user.userId);

    // Build comprehensive conversation context using RAG
    const conversationContext = await buildConversationContext(req.user.userId, chatId, prompt);

    let parseText = "";
    let parsedFilePath = "";

    const uploadDir = path.join(process.cwd(), 'uploads');

    if (parsedFileName) {
       parsedFilePath = path.join(uploadDir, parsedFileName);
      if (fs.existsSync(parsedFilePath)) {
        parseText = fs.readFileSync(parsedFilePath, 'utf-8');
      } else {
        return res.status(400).json({ error: "File not found or unreadable" });
      }
    }

    // Enhanced user info extraction
    const userName = user?.displayName || user?.name || userPref?.name || 'User';
    const userEmail = user?.email || 'Not specified';
    const userEducation = userPref?.educationStatus || 'Not specified';
    const userStyle = userPref?.explanationStyle || 'Not specified';
    const userLanguage = userPref?.comfortLanguage || 'Not specified';
    const userGender = userPref?.gender || 'Not specified';

    const userInfo = `USER PROFILE:
- Name: ${userName}
- Email: ${userEmail}
- Education Level: ${userEducation}
- Preferred Style: ${userStyle}
- Comfortable Language: ${userLanguage}
- Gender: ${userGender}

Use this information to personalize your responses appropriately.`;

    const systemInstructions = `
You are **FastGen AI**, an intelligent, adaptive, and user-friendly assistant.  
Your mission is to respond like ChatGPT: clear, helpful, structured, and friendly — while naturally adapting tone to the user.  

---

## 1. CONVERSATION FLOW
- Do **not** start every message with "Hello User!".  
- Use a greeting only:  
  - ✅ At the **first interaction** (personalized if user details like name are known).  
  - ✅ At a **new context shift** (e.g., starting a fresh topic).  
  - ❌ Not on every reply in an ongoing chat.  
- Avoid repetitive apologies. Instead, adapt behavior silently.  

---

## 2. TONE ADAPTATION
- Mirror the **user's tone and style**:  
  - If they're formal → be formal  
  - If they're casual → be casual  
  - If they're technical → be technical  
  - If they're creative → be creative  
- **Adapt silently** without mentioning the change.  

---

## 3. RESPONSE STRUCTURE
- **Be concise** but comprehensive  
- Use **bullet points** when listing multiple items  
- Use **numbered lists** for step-by-step instructions  
- Use **bold** for emphasis on key points  
- Use **code blocks** for code, commands, or technical terms  
- Use **blockquotes** for important notes or warnings  

---

## 4. CONTEXT AWARENESS
- Reference **previous conversation** when relevant  
- Build on **earlier points** naturally  
- Acknowledge **user's progress** or learning  
- Connect **related topics** when helpful  

---

## 5. PERSONALIZATION
${userInfo}

---

## 6. CONVERSATION CONTEXT
${conversationContext.length > 0 ? `Recent relevant context:
${conversationContext.map((ctx, i) => `${i + 1}. ${ctx.content}`).join('\n')}` : 'No recent context available.'}

---

## 7. CURRENT QUERY
User Query: ${prompt}

---

**Remember**: Be helpful, accurate, and naturally conversational. Adapt to the user's style without being obvious about it.`;

    let finalPrompt = systemInstructions;

    if (parseText) {
      finalPrompt += `\n text/file: ${parseText}`;
    }

    console.log('=== DEBUG INFO ===');
    console.log('User ID:', req.user.userId);
    console.log('User Name:', userName);
    console.log('User Email:', userEmail);
    console.log('User Education:', userEducation);
    console.log('User Style:', userStyle);
    console.log('Conversation Context Length:', conversationContext.length);
    console.log('Final Prompt Length:', finalPrompt.length);
    console.log('=== END DEBUG ===');

    const ans = await generateWithFallback(finalPrompt)

    console.log('Gemini answer:', ans);

    // Validate response quality
    if (!ans || ans.trim().length < 10) {
      throw new Error('AI response too short or empty');
    }

    if (parsedFilePath && fs.existsSync(parsedFilePath)) {
      fs.unlinkSync(parsedFilePath);
    }

    res.json({ answer: ans });

    // Store both user message and AI response in long-term memory
    addToMemory(req.user.userId, chatId, prompt, 'user');
    addToMemory(req.user.userId, chatId, ans, 'ai');

    const aiMessage = await Message.create({
      chat: chatId,
      sender: 'ai',
      content: ans,
    });

    // Add AI message to chat's messages array
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: aiMessage._id }
    });

    // Generate/update chat title after a few messages (every 4 messages)
    try {
      const messageCount = await Message.countDocuments({ chat: chatId });
      if (messageCount === 4 || messageCount === 8) { // Generate title at 4th and 8th message
        const chatMessages = await Message.find({ chat: chatId })
          .sort({ createdAt: 1 })
          .limit(4);
        
        const newTitle = await generateChatTitle(chatMessages);
        
        // Update chat title
        await Chat.findByIdAndUpdate(chatId, { title: newTitle });
        console.log(`Updated chat title to: ${newTitle}`);
      }
    } catch (error) {
      console.error('Error updating chat title:', error);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process Gemini request' });
  }
});

// Route to update chat title manually
router.put('/chat-title/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    // Verify user owns this chat
    const chat = await Chat.findOne({ _id: chatId, user: req.user.userId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Update chat title
    await Chat.findByIdAndUpdate(chatId, { title: title.trim() });

    res.json({ success: true, title: title.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
});

export default router;