// ✅ Uses Gemini 1.5 (Google Generative AI) for text generation
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTextFromPrompt = async (prompt) => {
  // 👇 Update model name to Gemini 1.5 Pro
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Generate content using Gemini
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
