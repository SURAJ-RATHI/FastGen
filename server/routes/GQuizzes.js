import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import fs from 'fs'
import path from "path"
import { extractJSON } from "../utils/extractJSON.js"
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router()

// generate quizzes - require authentication
router.post('/', requireAuth, async (req, res) => {
  try {
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
    
    // Check if file exists and is readable
    if (!fs.existsSync(parsedFilePath)) {
      console.error('Parsed file not found:', parsedFilePath);
      console.error('Upload directory contents:', fs.readdirSync(uploadDir));
      return res.status(400).json({ error: "Parsed file not found. Please try uploading the file again." });
    }
    
    try {
      parseText = fs.readFileSync(parsedFilePath, 'utf-8');
      console.log('File content length:', parseText.length); // Debug log
      console.log('File path verified:', parsedFilePath);
    } catch (readErr) {
      console.error('Error reading parsed file:', readErr);
      return res.status(400).json({ error: "Failed to read parsed file. Please try uploading again." });
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
      try {
        fs.unlinkSync(parsedFilePath);
        console.log('Cleaned up parsed file:', parsedFilePath);
      } catch (cleanupErr) {
        console.error('Failed to cleanup parsed file:', cleanupErr);
      }
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
        model: 'gemini-1.5-flash',
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