import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI with the correct configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
    if (!process.env.GOOGLE_AI_API_KEY) {
        return NextResponse.json(
            { error: 'API key not configured' },
            { status: 500 }
        );
    }

    try {
        const { answer } = await request.json();

        if (!answer) {
            return NextResponse.json(
                { error: 'Answer is required' },
                { status: 400 }
            );
        }

        // Updated to use the correct model configuration
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-pro',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        const prompt = `
            You're a professional technical interviewer conducting a software developer interview.
            Based on this candidate's answer: "${answer}",
            provide a relevant follow-up question that:
            - Builds upon their previous response
            - Tests their technical knowledge deeper
            - Is specific and focused
            Return only the follow-up question without any additional text.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const nextQuestion = response.text();

        return NextResponse.json({ question: nextQuestion });

    } catch (error) {
        console.error('Interview API error:', error);
        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        );
    }
}