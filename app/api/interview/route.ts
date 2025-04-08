// app/api/interview/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import prisma from '@/app/utils/prisma';
import { generateNextQuestion } from '@/app/utils/interviewUtils';

export async function POST(request: { json: () => Promise<any>; }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const requestData = await request.json().catch(() => ({}));
        
        // If interviewId is provided, this is an answer submission
        if (requestData.interviewId) {
            return handleAnswerSubmission(requestData, user.id);
        } 
        // Otherwise, this is a new interview creation
        else {
            return createNewInterview(user.id);
        }

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'API request failed',
                details: error
            },
            { status: 500 }
        );
    }
}

async function createNewInterview(userId: string) {
    // Create interview linked to user
    const interview = await prisma.interview.create({
        data: {
            userId: userId,
            messages: {
                create: {
                    type: 'question',
                    content: 'Tell me about your experience with software development.'
                }
            }
        },
        include: {
            messages: true
        }
    });

    // Return both interview ID and initial message
    return NextResponse.json({
        interviewId: interview.id,
        messages: interview.messages
    });
}

async function handleAnswerSubmission(data: { answer: any; interviewId: any; }, userId: string) {
    const { answer, interviewId } = data;
    
    if (!answer || !interviewId) {
        return NextResponse.json(
            { error: 'Answer and interviewId are required' },
            { status: 400 }
        );
    }

    // Verify the interview belongs to the user
    const interview = await prisma.interview.findUnique({
        where: { 
            id: interviewId,
            userId: userId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    if (!interview) {
        return NextResponse.json(
            { error: 'Interview not found' },
            { status: 404 }
        );
    }

    // Save the user's answer
    await prisma.message.create({
        data: {
            type: 'answer',
            content: answer,
            interviewId: interviewId
        }
    });

    // Generate next question based on conversation history
    const nextQuestion = await generateNextQuestion(interview.messages, answer);
    
    // Save the new question
    const newQuestionMessage = await prisma.message.create({
        data: {
            type: 'question',
            content: nextQuestion,
            interviewId: interviewId
        }
    });

    // Return the new question
    return NextResponse.json({
        messageId: newQuestionMessage.id,
        question: nextQuestion
    });
}