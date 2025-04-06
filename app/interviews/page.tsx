'use client';

import { useState } from 'react';

type Message = {
  id: string;
  type: 'question' | 'answer';
  content: string;
};

 function Page() {
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Initialize with the first interview question
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'question',
            content: 'Tell me about your experience with software development.'
        }
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim()) return;
        
        setIsLoading(true);
        setError(null);

        // Add user's answer to the conversation
        const userAnswer = {
            id: Date.now().toString(),
            type: 'answer' as const,
            content: answer
        };
        
        setMessages(prev => [...prev, userAnswer]);
        
        try {
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Add interviewer's next question to the conversation
            const newQuestion = {
                id: (Date.now() + 1).toString(),
                type: 'question' as const,
                content: data.question
            };
            
            setMessages(prev => [...prev, newQuestion]);
            setAnswer('');
            
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'Failed to get next question');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='absolute w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col'>
            <div className="max-w-3xl w-full mx-auto p-6 flex flex-col h-full">
                <h1 className="text-3xl font-bold mb-6 text-white">Technical Interview Simulator</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg mb-4 p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div 
                                key={message.id}
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
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="flex-1 p-3 border rounded-md min-h-[80px] text-white"
                        placeholder="Type your answer here..."
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !answer.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 h-fit self-end"
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Page