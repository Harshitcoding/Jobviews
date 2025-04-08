'use client';

import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Interview = {
  id: string;
  messages: {
    id: string;
    type: 'question' | 'answer';
    content: string;
    createdAt: string;
  }[];
};

const Dashboard = () => {
  const { data: session } = useSession();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Failed to fetch interviews');
        const data = await response.json();
        setInterviews(data.interviews);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchInterviews();
    }
  }, [session]);

  return (
    <div className="absolute w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
      <Sidebar />
      <div className="md:ml-64 h-full flex flex-col">
        <div className="p-8 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white mb-6">Interview History</h1>
        </div>
        
        <div className="flex-grow overflow-y-auto px-8 pb-8">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="grid gap-6">
              {interviews.map((interview) => (
                <div key={interview.id} className="bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20">
                  <h2 className="text-xl text-white font-semibold mb-4">
                    Interview #{interview.id}
                  </h2>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {interview.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.type === 'question'
                            ? 'bg-blue-900/50 text-white border border-blue-700/50'
                            : 'bg-green-900/50 text-white ml-8 border border-green-700/50'
                        }`}
                      >
                        <p className="font-medium mb-2">
                          {message.type === 'question' ? '🤖 AI Interviewer' : '👤 You'}:
                        </p>
                        <p>{message.content}</p>
                        <p className="text-sm text-gray-300 mt-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Dashboard