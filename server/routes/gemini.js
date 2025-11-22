import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import User from "../models/User.js"
import UserPreference from "../models/UserPreference.js"
import Message from "../models/Message.js"
import Chat from "../models/Chat.js"
import pineconeService from "../services/pineconeService.js"
import dotenv from "dotenv" 
import fs from 'fs'
import path from "path"

const router = express.Router()
dotenv.config();

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

// Function to retrieve relevant past messages from database
async function retrieveRelevantPastMessages(userId, currentChatId, currentQuery, limit = 6) {
  try {
    const queryWords = currentQuery.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    if (queryWords.length === 0) {
      // If no meaningful words, return recent messages from other chats
      const userChats = await Chat.find({ user: userId, _id: { $ne: currentChatId } })
        .select('_id')
        .sort({ updatedAt: -1 })
        .limit(5);
      
      if (userChats.length === 0) return [];
      
      const chatIds = userChats.map(chat => chat._id);
      const recentMessages = await Message.find({ 
        chat: { $in: chatIds },
        sender: 'user' // Focus on user messages for context
      })
        .select('content sender createdAt')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return recentMessages;
    }
    
    // Search for relevant messages using text search
    const userChats = await Chat.find({ user: userId, _id: { $ne: currentChatId } })
      .select('_id title')
      .sort({ updatedAt: -1 })
      .limit(20); // Check more chats for better context
    
    if (userChats.length === 0) return [];
    
    const chatIds = userChats.map(chat => chat._id);
    
    // Get messages from other chats and score them (both user and AI messages)
    const pastMessages = await Message.find({ 
      chat: { $in: chatIds }
    })
      .select('content sender createdAt')
      .sort({ createdAt: -1 })
      .limit(100); // Get more messages to score
    
    // Score messages based on word overlap and semantic similarity
    const scoredMessages = pastMessages.map(msg => {
      const contentWords = msg.content.toLowerCase().split(/\s+/);
      
      // Exact word matches (higher score)
      const exactMatches = queryWords.filter(word => 
        contentWords.includes(word)
      ).length;
      
      // Partial word matches (medium score)
      const partialMatches = queryWords.filter(word => 
        contentWords.some(contentWord => 
          contentWord.includes(word) || word.includes(contentWord)
        )
      ).length - exactMatches;
      
      // Check for key phrases (names, important terms)
      const hasKeyPhrases = queryWords.some(word => 
        word.length > 3 && msg.content.toLowerCase().includes(word)
      );
      
      // Calculate weighted score
      const score = (exactMatches * 3) + (partialMatches * 1) + (hasKeyPhrases ? 2 : 0);
      
      return { ...msg, score };
    });
    
    // Return top scored messages
    return scoredMessages
      .filter(msg => msg.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error retrieving past messages:', error);
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

// Function to build comprehensive conversation context - PINECONE ENHANCED
async function buildConversationContext(userId, chatId, currentQuery) {
  try {
    console.log(`Building context for user ${userId}, chat ${chatId}, query: "${currentQuery}"`);
    
    // Get recent messages for immediate context (optimized query)
    const recentMessages = await Message.find({ chat: chatId })
      .select('content sender createdAt')
      .sort({ createdAt: -1 })
      .limit(3) // Reduced from 5 to 3 for faster processing
      .lean(); // Use lean() for better performance
    
    console.log(`Found ${recentMessages.length} recent messages`);
    
    let context = "";
    
    // Add recent conversation context
    if (recentMessages.length > 0) {
      context += `\nRECENT CONTEXT (Last ${recentMessages.length} messages):
${recentMessages.reverse().map(msg => `- ${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}`).join('\n')}`;
    }
    
    // Try Pinecone search with timeout to prevent hanging
    try {
      console.log('Attempting Pinecone search...');
      const pineconePromise = pineconeService.searchSimilarMessages(
        userId, 
        currentQuery, 
        5, // Reduced from 8 to 5 for faster processing
        chatId // Exclude current chat
      );
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Pinecone timeout')), 3000)
      );
      
      const relevantMessages = await Promise.race([pineconePromise, timeoutPromise]);
      
      console.log(`Pinecone search returned ${relevantMessages.length} relevant messages`);
      
      if (relevantMessages.length > 0) {
        context += `\n\nRELEVANT PAST CONVERSATIONS (semantic search):
${relevantMessages.map(msg => `- ${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content.substring(0, 60)}${msg.content.length > 60 ? '...' : ''} (relevance: ${(msg.score * 100).toFixed(1)}%)`).join('\n')}`;
      } else {
        console.log('No relevant messages found via Pinecone');
      }
    } catch (pineconeError) {
      console.error('Pinecone search failed or timed out, skipping fallback for speed:', pineconeError.message);
      // Skip database fallback for speed - just use recent context
    }
    
    console.log(`Final context length: ${context.length} characters`);
    return context;
  } catch (error) {
    console.error('Error building context:', error);
    return "";
  }
}

const rawKeys = process.env.GEMINI_KEYS.split(',').map(k => k.trim());
const apiKeys = rawKeys.map(key => ({ key, active: true }));

// Streaming response generator
async function* generateStreamingResponse(prompt) {
  let lastUsedKeyIndex = -1;
  
  for (let attempt = 0; attempt < apiKeys.length; attempt++) {
    const keyIndex = (lastUsedKeyIndex + 1) % apiKeys.length;
    const currentKey = apiKeys[keyIndex];
    
    if (!currentKey.active) {
      continue;
    }
    
    try {
      console.log(`Attempting streaming with key ${keyIndex + 1}/${apiKeys.length}`);
      
      const genAI = new GoogleGenerativeAI(currentKey.key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield { text: chunkText };
        }
      }
      
      // Success - mark this key as used and return
      lastUsedKeyIndex = keyIndex;
      return;
      
    } catch (error) {
      console.error(`Streaming failed with key ${keyIndex + 1}:`, error.message);
      
      // If it's a quota or rate limit error, deactivate this key
      if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('429')) {
        currentKey.active = false;
        console.log(`Deactivated key ${keyIndex + 1} due to quota/rate limit`);
      }
      
      // Continue to next key
      continue;
    }
  }
  
  throw new Error("All API keys failed or exhausted for streaming");
}

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

      // Enhanced prompt engineering for better responses
      const enhancedPrompt = `You are an intelligent, helpful, and friendly AI assistant. You provide accurate, detailed, and well-structured responses. 

IMPORTANT INSTRUCTIONS:
- Always be helpful, accurate, and informative
- Provide comprehensive answers with examples when relevant
- Use clear, professional language while maintaining a friendly tone
- Structure your responses logically with proper formatting
- If you're unsure about something, say so rather than guessing
- Use markdown formatting for better readability when appropriate

User Query: ${prompt}

Please provide a helpful, accurate, and well-structured response.`;
      
      const result = await model.generateContent([{ text: enhancedPrompt }]);
      const ans = result.response.text();

      return ans; // return if success
    } catch (err) {
      console.error(`Api_Key failed:`, err.message);

      // Check if it's a quota or usage error
      if (
        err.message.includes('quota') ||
        err.message.includes('quota_exceeded') ||
        err.message.includes('RESOURCE_EXHAUSTED')
      ) {
        apiKeyObj.active = false; // deactivate key temporarily
      }
      else {
        throw err; // something else went wrong — throw it
      }
    }
  }

  throw new Error("All API keys failed or exhausted");
}

// gemini streaming request
router.post('/stream', async (req, res) => {
  try {
    console.log('=== STREAMING REQUEST START ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { chatId, prompt, parsedFileName } = req.body;

    if (!req.user) {
      console.log('No user found, returning 401');
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!chatId || !prompt) {
      console.log('Missing required fields:', { chatId: !!chatId, prompt: !!prompt });
      return res.status(400).json({ error: "chatId and prompt are required" });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection event
    res.write('data: {"type":"connected","message":"Stream started"}\n\n');

    // Start processing in parallel for better performance
    const [userMessage, userPref, user] = await Promise.all([
      Message.create({
        chat: chatId,
        sender: 'user',
        content: prompt,
      }),
      UserPreference.findOne({ user: req.user.userId }),
      User.findById(req.user.userId)
    ]);

    // Add message to chat's messages array (non-blocking)
    Chat.findByIdAndUpdate(chatId, {
      $push: { messages: userMessage._id }
    }).catch(err => console.error('Error updating chat messages:', err));

    // Build conversation context in parallel with file processing
    const [conversationContext, parseText, parsedFilePath] = await Promise.all([
      buildConversationContext(req.user.userId, chatId, prompt),
      parsedFileName ? (async () => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadDir, parsedFileName);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, 'utf-8');
        }
        return "";
      })() : Promise.resolve(""),
      Promise.resolve(parsedFileName ? path.join(process.cwd(), 'uploads', parsedFileName) : "")
    ]);

    // Check if file was found and readable
    if (parsedFileName && !parseText) {
      res.write('data: {"type":"error","message":"File not found or unreadable"}\n\n');
      res.end();
      return;
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

`;

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
  - If user is casual: *"hello bhai"* → reply casually: *"Arre hi Suraj bhai 👋😄 Kaise ho?"*  
  - If user is formal: *"Explain binary search."* → reply professionally, with structure.  
  - If user is emotional: respond empathetically and reassuringly.  
- Use emojis **sparingly** in casual/warm responses, but avoid them in serious or technical contexts.  

---

## 3. ANSWERING BEHAVIOR
- Always give **direct, accurate answers first**, then expand with details/examples if helpful.  
- Do **not** over-clarify unless essential. Example:  
  - ❌ "Since you didn't specify which president…"  
  - ✅ "If you meant the U.S. President, it's Joe Biden. If you were asking about another country, let me know 👍."  
- Keep responses **focused** — avoid filler sentences like "I understand you're asking about…"  
- If unsure, admit limitations and suggest next steps.  

---

## 4. PERSONALIZATION
- Reference user's **name or context** when available.  
- Adapt explanations to **user's knowledge level** (simple for beginners, detailed for advanced).  
- Make examples relatable and culturally sensitive.  

---

## 5. STYLE & FORMATTING
- Use **markdown**:  
  - Headings (##),  
  - Lists (- or 1.),  
  - Code blocks when explaining technical concepts.  
- Highlight important terms with **bold** or *italics*.  
- Provide **actionable insights or next steps** where relevant.  

---

## 6. EXAMPLES OF IDEAL RESPONSES
- User: *"hello bhai"*  
  Response: *"Arre hi Suraj bhai 👋😄 Kaise ho?"*  

- User: *"who is pm of india"*  
  Response: *"The current Prime Minister of India is **Narendra Modi**. He has been in office since May 26, 2014, representing the Bharatiya Janata Party (BJP)."*  

- User: *"what is president work and who is currently president"*  
  Response:  
  *"The role of a President varies by country, but generally they are responsible for leading the government, representing the nation abroad, and ensuring laws are upheld.  
  - In the **U.S.**, the President is head of state and commander-in-chief of the armed forces.  
  - In **India**, the President serves as the ceremonial head of state with constitutional powers.  

  Currently:  
  - U.S. President → **Joe Biden**  
  - Indian President → **Droupadi Murmu***  

---

## 7. IDENTITY
You are not just answering questions — you are a **guide, mentor, and companion**.  
Every response should feel **natural, human-like, and confidence-boosting**.  

`;

    // Use comprehensive conversation context from RAG
    const conversationMemory = conversationContext;

    let finalPrompt = `${systemInstructions}

${userInfo}

${conversationMemory}

CURRENT USER QUERY: ${prompt}

IMPORTANT: 
- Address the user by name: ${userName}
- ALWAYS check the context provided above for relevant past conversations
- If context shows previous discussions about the same topic, reference them explicitly
- Use phrases like "As we discussed before...", "Remember when you mentioned...", "Building on our previous conversation..."
- If the user asks about something mentioned in past chats, acknowledge it and provide continuity
- NEVER say you don't have access to past conversations if context is provided above
- Provide helpful, accurate, and well-structured responses that build upon previous interactions
- Maintain conversation continuity across sessions`;

    if (parseText) {
      finalPrompt += `\n text/file: ${parseText}`;
    }

    console.log('=== STREAMING DEBUG INFO ===');
    console.log('User ID:', req.user.userId);
    console.log('User Name:', userName);
    console.log('User Email:', userEmail);
    console.log('User Education:', userEducation);
    console.log('User Style:', userStyle);
    console.log('Conversation Context Length:', conversationContext.length);
    console.log('Final Prompt Length:', finalPrompt.length);
    console.log('=== END STREAMING DEBUG ===');

    // Send typing indicator
    res.write('data: {"type":"typing","message":"AI is thinking..."}\n\n');

    // Generate streaming response
    const streamingResponse = await generateStreamingResponse(finalPrompt);
    
    let fullResponse = '';
    
    for await (const chunk of streamingResponse) {
      if (chunk.text) {
        fullResponse += chunk.text;
        res.write(`data: {"type":"chunk","content":"${JSON.stringify(chunk.text).slice(1, -1)}"}\n\n`);
      }
    }

    // Send completion event
    res.write('data: {"type":"complete","message":"Response complete"}\n\n');

    // Clean up uploaded file
    if (parsedFilePath && fs.existsSync(parsedFilePath)) {
      fs.unlinkSync(parsedFilePath);
    }

    // Store both user message and AI response in long-term memory
    addToMemory(req.user.userId, chatId, prompt, 'user');
    addToMemory(req.user.userId, chatId, fullResponse, 'ai');

    const aiMessage = await Message.create({
      chat: chatId,
      sender: 'ai',
      content: fullResponse,
    });

    // Add AI message to chat's messages array
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: aiMessage._id }
    });

    // Store vectors in Pinecone for semantic search
    try {
      // Store user message vector
      await pineconeService.upsertMessage(
        req.user.userId, 
        chatId, 
        userMessage._id, 
        prompt, 
        'user',
        { chatTitle: await Chat.findById(chatId).select('title').then(c => c?.title) }
      );
      
      // Store AI response vector
      await pineconeService.upsertMessage(
        req.user.userId, 
        chatId, 
        aiMessage._id, 
        fullResponse, 
        'ai',
        { chatTitle: await Chat.findById(chatId).select('title').then(c => c?.title) }
      );
    } catch (pineconeError) {
      console.error('Failed to store vectors in Pinecone:', pineconeError);
      // Continue execution - Pinecone failure shouldn't break the chat
    }

    // Generate/update chat title more frequently for better UX
    try {
      const messageCount = await Message.countDocuments({ chat: chatId });
      if (messageCount === 2 || messageCount === 4 || messageCount === 8) { // Generate title at 2nd, 4th, and 8th message
        const chatMessages = await Message.find({ chat: chatId })
          .sort({ createdAt: 1 })
          .limit(Math.min(messageCount, 6)); // Use more messages for better title generation
        
        const newTitle = await generateChatTitle(chatMessages);
        
        // Update chat title
        await Chat.findByIdAndUpdate(chatId, { title: newTitle });
        console.log(`Updated chat title to: ${newTitle} (message count: ${messageCount})`);
      }
    } catch (error) {
      console.error('Error updating chat title:', error);
    }

    res.end();

  } catch (err) {
    console.error('=== STREAMING ERROR ===');
    console.error('Error details:', err);
    console.error('Error stack:', err.stack);
    console.error('=== END STREAMING ERROR ===');
    
    try {
      res.write(`data: {"type":"error","message":"${err.message}"}\n\n`);
      res.end();
    } catch (writeError) {
      console.error('Error writing error response:', writeError);
    }
  }
});

// gemini res request (non-streaming fallback)
router.post('/', async (req, res) => {
  try {
    const { chatId, prompt, parsedFileName } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
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
- Do **not** start every message with “Hello User!”.  
- Use a greeting only:  
  - ✅ At the **first interaction** (personalized if user details like name are known).  
  - ✅ At a **new context shift** (e.g., starting a fresh topic).  
  - ❌ Not on every reply in an ongoing chat.  
- Avoid repetitive apologies. Instead, adapt behavior silently.  

---

## 2. TONE ADAPTATION
- Mirror the **user’s tone and style**:  
  - If user is casual: *“hello bhai”* → reply casually: *“Arre hi Suraj bhai 👋😄 Kaise ho?”*  
  - If user is formal: *“Explain binary search.”* → reply professionally, with structure.  
  - If user is emotional: respond empathetically and reassuringly.  
- Use emojis **sparingly** in casual/warm responses, but avoid them in serious or technical contexts.  

---

## 3. ANSWERING BEHAVIOR
- Always give **direct, accurate answers first**, then expand with details/examples if helpful.  
- Do **not** over-clarify unless essential. Example:  
  - ❌ “Since you didn’t specify which president…”  
  - ✅ “If you meant the U.S. President, it’s Joe Biden. If you were asking about another country, let me know 👍.”  
- Keep responses **focused** — avoid filler sentences like “I understand you’re asking about…”  
- If unsure, admit limitations and suggest next steps.  

---

## 4. PERSONALIZATION
- Reference user’s **name or context** when available.  
- Adapt explanations to **user’s knowledge level** (simple for beginners, detailed for advanced).  
- Make examples relatable and culturally sensitive.  

---

## 5. STYLE & FORMATTING
- Use **markdown**:  
  - Headings (##),  
  - Lists (- or 1.),  
  - Code blocks when explaining technical concepts.  
- Highlight important terms with **bold** or *italics*.  
- Provide **actionable insights or next steps** where relevant.  

---

## 6. EXAMPLES OF IDEAL RESPONSES
- User: *“hello bhai”*  
  Response: *“Arre hi Suraj bhai 👋😄 Kaise ho?”*  

- User: *“who is pm of india”*  
  Response: *“The current Prime Minister of India is **Narendra Modi**. He has been in office since May 26, 2014, representing the Bharatiya Janata Party (BJP).”*  

- User: *“what is president work and who is currently president”*  
  Response:  
  *“The role of a President varies by country, but generally they are responsible for leading the government, representing the nation abroad, and ensuring laws are upheld.  
  - In the **U.S.**, the President is head of state and commander-in-chief of the armed forces.  
  - In **India**, the President serves as the ceremonial head of state with constitutional powers.  

  Currently:  
  - U.S. President → **Joe Biden**  
  - Indian President → **Droupadi Murmu***  

---

## 7. IDENTITY
You are not just answering questions — you are a **guide, mentor, and companion**.  
Every response should feel **natural, human-like, and confidence-boosting**.  

`;

    // Use comprehensive conversation context from RAG
    const conversationMemory = conversationContext;

    let finalPrompt = `${systemInstructions}

${userInfo}

${conversationMemory}

CURRENT USER QUERY: ${prompt}

IMPORTANT: 
- Address the user by name: ${userName}
- ALWAYS check the context provided above for relevant past conversations
- If context shows previous discussions about the same topic, reference them explicitly
- Use phrases like "As we discussed before...", "Remember when you mentioned...", "Building on our previous conversation..."
- If the user asks about something mentioned in past chats, acknowledge it and provide continuity
- NEVER say you don't have access to past conversations if context is provided above
- Provide helpful, accurate, and well-structured responses that build upon previous interactions
- Maintain conversation continuity across sessions`;

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

    // Store vectors in Pinecone for semantic search
    try {
      // Store user message vector
      await pineconeService.upsertMessage(
        req.user.userId, 
        chatId, 
        userMessage._id, 
        prompt, 
        'user',
        { chatTitle: await Chat.findById(chatId).select('title').then(c => c?.title) }
      );
      
      // Store AI response vector
      await pineconeService.upsertMessage(
        req.user.userId, 
        chatId, 
        aiMessage._id, 
        ans, 
        'ai',
        { chatTitle: await Chat.findById(chatId).select('title').then(c => c?.title) }
      );
    } catch (pineconeError) {
      console.error('Failed to store vectors in Pinecone:', pineconeError);
      // Continue execution - Pinecone failure shouldn't break the chat
    }

    // Generate/update chat title more frequently for better UX
    try {
      const messageCount = await Message.countDocuments({ chat: chatId });
      if (messageCount === 2 || messageCount === 4 || messageCount === 8) { // Generate title at 2nd, 4th, and 8th message
        const chatMessages = await Message.find({ chat: chatId })
          .sort({ createdAt: 1 })
          .limit(Math.min(messageCount, 6)); // Use more messages for better title generation
        
        const newTitle = await generateChatTitle(chatMessages);
        
        // Update chat title
        await Chat.findByIdAndUpdate(chatId, { title: newTitle });
        console.log(`Updated chat title to: ${newTitle} (message count: ${messageCount})`);
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

// Test Pinecone endpoint
router.get('/test-pinecone', async (req, res) => {
  try {
    const testResult = await pineconeService.searchSimilarMessages(
      req.user.id, 
      'test query', 
      3
    );
    res.json({ 
      status: 'Pinecone working', 
      results: testResult.length,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Pinecone error', 
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

export default router;