// app/utils/geminiUtils.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-pro'; // Use the appropriate Gemini model
const API_KEY = process.env.GEMINI_API_KEY || ''; // Make sure to add this to your .env file

if (!API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Context to guide the AI in generating appropriate interview questions
const SYSTEM_INSTRUCTION = `
You are an expert technical interviewer conducting a software engineering interview. 
Your task is to:
1. Ask relevant follow-up questions based on the candidate's previous answers
2. Dig deeper into technologies or experiences they mention
3. Assess their problem-solving abilities and technical knowledge
4. Keep questions professional and relevant to software development
5. Vary between questions about past experiences, technical knowledge, and problem-solving approaches
6. Don't repeat questions that have already been asked
7. Keep questions concise and clear

Respond with ONLY the next interview question. Do not include any explanations or additional text.
`;

type Message = {
  type: 'question' | 'answer';
  content: string;
};

/**
 * Generate the next interview question using Gemini API
 * 
 * @param messages - Array of previous messages in the conversation
 * @param latestAnswer - The candidate's latest answer
 * @returns The next interview question
 */
export async function generateNextQuestionWithAI(messages: Message[], latestAnswer: string): Promise<string> {
  try {
    // Create a conversation history to provide context to the AI
    const conversationHistory = messages.map(msg => 
      `${msg.type === 'question' ? 'Interviewer' : 'Candidate'}: ${msg.content}`
    ).join('\n\n');
    
    // Add the latest answer if it exists
    const fullContext = latestAnswer 
      ? `${conversationHistory}\n\nCandidate: ${latestAnswer}\n\nInterviewer:`
      : `${conversationHistory}\n\nInterviewer:`;
    
    // Generate content with Gemini
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION + '\n\n' + fullContext }] }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });
    
    // Extract and clean up the response
    const response = result.response;
    const generatedText = response.text().trim();
    
    // Fallback in case the API fails or returns an empty response
    if (!generatedText) {
      return "Could you tell me more about your approach to learning new technologies?";
    }
    
    return generatedText;
  } catch (error) {
    console.error('Error generating question with Gemini API:', error);
    return "What are your strongest technical skills, and how have you applied them in your projects?";
  }
}