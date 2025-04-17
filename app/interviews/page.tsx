'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

type Message = {
  id: string;
  type: 'question' | 'answer';
  content: string;
};

function Page() {
    const { data: session, status } = useSession();
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [interviewId, setInterviewId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleRecording = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.');
            return;
        }

        if (!recognitionRef.current) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setAnswer(transcript);
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                alert('Speech recognition error occurred: ' + event.error);
            };

            recognitionRef.current = recognition;
        }

        if (!isRecording) {
            recognitionRef.current.start();
            setIsRecording(true);
        } else {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const startInterview = async () => {
        if (status !== "authenticated" || !session?.user) return;

        try {
            setIsLoading(true);
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create interview');
            }
            
            const data = await response.json();
            setInterviewId(data.interviewId);

            if (data.messages && data.messages.length > 0) {
                setMessages([{
                    id: data.messages[0].id,
                    type: 'question',
                    content: data.messages[0].content
                }]);
            } else {
                setMessages([{
                    id: Date.now().toString(),
                    type: 'question',
                    content: 'Tell me about your experience with software development.'
                }]);
            }
            setInterviewStarted(true);
        } catch (error) {
            console.error('Interview creation error:', error);
            setError(error instanceof Error ? error.message : 'Failed to start interview');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || !interviewId) return;
        await submitAnswer(answer);
    };

    const submitAnswer = async (answerText: string) => {
        setIsLoading(true);
        setError(null);

        const userAnswer = {
            id: Date.now().toString(),
            type: 'answer' as const,
            content: answerText
        };

        setMessages(prev => [...prev, userAnswer]);

        try {
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    answer: answerText,
                    interviewId 
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            const data = await response.json();

            if (!data.question || !data.messageId) {
                throw new Error('Invalid response from server');
            }

            const newQuestion = {
                id: data.messageId,
                type: 'question' as const,
                content: data.question
            };

            setMessages(prev => [...prev, newQuestion]);
            setAnswer('');
            
        } catch (error) {
            console.error('Error submitting answer:', error);
            setError(error instanceof Error ? error.message : 'Failed to get next question');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
                <p className="text-white text-xl">Please sign in to use the interview simulator.</p>
            </div>
        );
    }

    return (
        <div className='absolute w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col'>
            <div className="max-w-3xl w-full mx-auto p-6 flex flex-col h-full">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Technical Interview Simulator</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {!interviewStarted ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">Ready for your technical interview?</h2>
                            <p className="text-gray-200 mb-6">Practice your interview skills with our AI interviewer. Click below to start a new interview session.</p>
                        </div>
                        <button
                            onClick={startInterview}
                            disabled={isLoading}
                            className="bg-blue-500 cursor-pointer text-white px-6 py-3 rounded-md text-lg hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Starting...' : 'Start New Interview'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={toggleRecording}
                                className={`px-4 py-2 rounded-md text-white ${isRecording ? 'bg-red-500' : 'bg-blue-500'} hover:opacity-90`}
                            >
                                {isRecording ? 'Stop Recording' : 'Speak Answer'}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg mb-4 p-4">
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div 
                                        key={`${message.id}-${index}`}
                                        className={`p-3 rounded-lg ${
                                            message.type === 'question' 
                                                ? 'bg-blue-100 mr-12' 
                                                : 'bg-green-100 ml-12'
                                        }`}
                                    >
                                        <p className="font-semibold mb-1">
                                            {message.type === 'question' ? 'Interviewer' : 'You'}:
                                        </p>
                                        <p>{message.content}</p>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="bg-gray-200 p-3 rounded-lg mr-12">
                                        <p className="font-semibold mb-1">Interviewer:</p>
                                        <p>Thinking of next question...</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="flex-1 p-3 border rounded-md min-h-[80px] bg-white text-gray-900"
                                placeholder="Speak or type your answer..."
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !answer.trim()}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Sending...' : 'Submit'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Page;
