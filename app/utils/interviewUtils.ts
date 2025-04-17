// app/utils/interviewUtils.ts
import { generateNextQuestionWithAI } from './geminiUtils';

type Message = {
  type: 'question' | 'answer';
  content: string;
};

/**
 * Generate the next interview question based on conversation history using AI
 * 
 * @param {Array} messages - Array of previous messages
 * @param {String} latestAnswer - The user's latest answer
 * @returns {Promise<String>} - The next question to ask
 */
export async function generateNextQuestion(messages: any[], latestAnswer: string): Promise<string> {
  // Convert database messages to the format expected by the AI generator
  const formattedMessages = messages.map(msg => ({
    type: msg.type as 'question' | 'answer',
    content: msg.content
  }));
  
  // Use AI to generate the next contextually relevant question
  return generateNextQuestionWithAI(formattedMessages, latestAnswer);
}

/**
 * Extract keywords from an answer to inform follow-up questions
 * This is kept for compatibility but is no longer used as the main driver
 * for question generation since we're using the AI.
 * 
 * @param {String} answer - The user's answer text
 * @returns {Array} - Array of keywords
 */
export function extractKeywords(answer: string): string[] {
  const text = answer.toLowerCase();
  
  const keywords = [
    "javascript", "react", "angular", "vue", "node", "express", 
    "python", "java", "c#", "go", "ruby", "php",
    "frontend", "backend", "fullstack", "database", "sql", "nosql",
    "testing", "devops", "agile", "scrum", "aws", "azure", "cloud",
    "architecture", "design", "mobile", "web", "api"
  ];
  
  return keywords.filter(keyword => text.includes(keyword));
}