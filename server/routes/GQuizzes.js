import express from "express"
import {GoogleGenerativeAI} from "@google/generative-ai"
import fs from 'fs'
import path from "path"
import { extractJSON } from "../utils/extractJSON.js"

const router = express.Router()
const rawKeys = process.env.GEMINI_KEYS.split(',').map(k => k.trim());
const apiKeys = rawKeys.map(key => ({ key, active: true }));

async function generateWithFallback(prompt) {
  for (const apiKeyObj of apiKeys) {
    if (!apiKeyObj.active) continue;

    try {
      const genAI = new GoogleGenerativeAI(apiKeyObj.key);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

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
      }

      else {
        throw err; // something else went wrong — throw it
      }
    }
  }

  throw new Error("All API keys failed or exhausted");
}



// generate quizzes 
router.post('/', async (req, res) => {
  try {
    const { parsedFileName, questionCount = 5 } = req.body;
    console.log('Received questionCount:', questionCount); // Debug log
    console.log('Received parsedFileName:', parsedFileName); // Debug log

    if (!parsedFileName) {
      return res.status(400).json({ error: "Missing parsedFileName parameter" });
    }

    let parseText = "";
    let parsedFilePath = "";
    
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    parsedFilePath = path.join(uploadDir, parsedFileName);
    if (fs.existsSync(parsedFilePath)) {
      parseText = fs.readFileSync(parsedFilePath, 'utf-8');
    } else {
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
    console.log('Final prompt:', finalPrompt);

    let ans = await generateWithFallback(finalPrompt);

    if (ans.startsWith("```")) {
      ans = ans.replace(/```json|```/g, '').trim();
    }

    console.log('Gemini answer:', ans);


    const extractedJSON = extractJSON(ans);

    if (parsedFilePath && fs.existsSync(parsedFilePath)) {
      fs.unlinkSync(parsedFilePath);
    }

    if (!extractedJSON) {
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
    console.error(err);
    res.status(500).json({ error: 'Failed to process Gemini request' });
  }
});
export default router;