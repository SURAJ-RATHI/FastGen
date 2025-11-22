import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import fs from 'fs'
import path from "path"
import { extractJSON } from "../utils/extractJSON.js"
import { requireAuth } from '../middleware/authMiddleware.js';
import { checkUsageLimit, incrementUsage } from '../middleware/usageMiddleware.js';

const router = express.Router()

// Handle preflight requests for GQuizzes
router.options('/', (req, res) => {
  // Use the request origin if it's in the allowed list, otherwise use the main app origin
  const allowedOrigin = req.headers.origin || 'https://fastgen-ai.vercel.app';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// generate quizzes - require authentication
router.post('/', requireAuth, checkUsageLimit('contentGenerations'), async (req, res) => {
  try {
    // Log CORS and request details
    console.log('=== GQuizzes Route Hit ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request origin:', req.headers.origin);
    console.log('User authenticated:', !!req.user);
    console.log('User ID:', req.user?.userId);
    
    const { parsedFileName, questionCount = 5 } = req.body;
    console.log('Received questionCount:', questionCount); // Debug log
    console.log('Received parsedFileName:', parsedFileName); // Debug log
    console.log('User ID:', req.user.userId); // Debug log

    if (!parsedFileName) {
      return res.status(400).json({ error: "Missing parsedFileName parameter" });
    }

    let parseText = "";
    let parsedFilePath = "";
    
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    parsedFilePath = path.join(uploadDir, parsedFileName);
    if (fs.existsSync(parsedFilePath)) {
      parseText = fs.readFileSync(parsedFilePath, 'utf-8');
      console.log('File content length:', parseText.length); // Debug log
    } else {
      console.error('File not found:', parsedFilePath); // Debug log
      return res.status(400).json({ error: "File not found or unreadable" });
    }

    let finalPrompt = `Prompt: "Read the text below and generate EXACTLY ${questionCount} multiple-choice questions. Do NOT generate more or fewer than ${questionCount} questions.

Output only valid JSON like this:
[
  {
    \"question\": \"What is the powerhouse of the cell?\",
    \"options\": [\"Ribosome\", \"Nucleus\", \"Mitochondria\", \"Golgi apparatus\"],
    \"answer\": \"Mitochondria\"
  },
  ...
]

IMPORTANT: You must generate exactly ${questionCount} questions, no more, no less.

Text:${parseText}
`;

    console.log('Sending prompt to AI with questionCount:', questionCount);
    console.log('Final prompt length:', finalPrompt.length);

    let ans = await generateWithFallback(finalPrompt);

    if (ans.startsWith("```")) {
      ans = ans.replace(/```json|```/g, '').trim();
    }

    console.log('Gemini answer length:', ans.length);
    console.log('Gemini answer preview:', ans.substring(0, 200) + '...');

    const extractedJSON = extractJSON(ans);

    if (parsedFilePath && fs.existsSync(parsedFilePath)) {
      fs.unlinkSync(parsedFilePath);
    }

    if (!extractedJSON) {
      console.error('Failed to extract JSON from response:', ans);
      return res.status(500).json({ error: 'Could not extract JSON from Gemini response.' });
    }

    // Count actual questions returned
    try {
      const questions = JSON.parse(extractedJSON);
      console.log('Actual questions returned:', questions.length);
      console.log('Expected questions:', questionCount);
      if (questions.length !== questionCount) {
        console.log('⚠️ WARNING: AI returned', questions.length, 'questions instead of', questionCount);
      }
    } catch (parseErr) {
      console.log('Could not parse response to count questions:', parseErr.message);
    }

    // Usage already incremented in middleware (pre-increment)
    // No need to increment again

    res.json({ answer: extractedJSON });

  } catch (err) {
    console.error('GQuizzes error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to process Gemini request: ' + err.message });
  }
});

async function generateWithFallback(prompt) {
  const rawKeys = process.env.GEMINI_KEYS?.split(',').map(k => k.trim()) || [];
  const apiKeys = rawKeys.map(key => ({ key, active: true }));

  if (apiKeys.length === 0) {
    throw new Error('No Gemini API keys configured');
  }

  for (const apiKeyObj of apiKeys) {
    if (!apiKeyObj.active) continue;

    try {
      const genAI = new GoogleGenerativeAI(apiKeyObj.key);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      const result = await model.generateContent([{ text: prompt }]);
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
        console.log(`API key deactivated due to quota issues: ${apiKeyObj.key.substring(0, 10)}...`);
      } else {
        console.error(`API key error (non-quota):`, err.message);
        throw err; // something else went wrong — throw it
      }
    }
  }

  throw new Error("All API keys failed or exhausted");
}

export default router;