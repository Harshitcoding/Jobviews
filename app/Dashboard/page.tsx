"use client"

import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Calendar, Clock, MessageSquare } from "lucide-react"

type Interview = {
  id: string
  messages: {
    id: string
    type: "question" | "answer"
    content: string
    createdAt: string
  }[]
}

const Dashboard = () => {
  const { data: session } = useSession()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) throw new Error("Failed to fetch interviews")
        const data = await response.json()
        setInterviews(data.interviews)
      } catch (error) {
        console.error("Error fetching interviews:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchInterviews()
    }
  }, [session])

  // Get the date from the first message in each interview
  const getInterviewDate = (interview: Interview) => {
    if (interview.messages.length > 0) {
      return new Date(interview.messages[0].createdAt).toLocaleDateString()
    }
    return "Unknown date"
  }

  // Get the time from the first message in each interview
  const getInterviewTime = (interview: Interview) => {
    if (interview.messages.length > 0) {
      return new Date(interview.messages[0].createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return "Unknown time"
  }

  return (
    <div className="absolute w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
      <Sidebar />
      <div className="md:ml-64 h-full flex flex-col">
        <div className="p-8 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white mb-6">Your Interviews</h1>
        </div>

        <div className="flex-grow overflow-y-auto px-8 pb-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm border border-white/20 text-center">
              <h3 className="text-xl text-white font-semibold mb-4">No interviews yet</h3>
              <p className="text-white/80">Start your first interview to see it here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <Link href={`/Dashboard/${interview.id}`} key={interview.id}>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer h-full flex flex-col transform hover:scale-105 hover:shadow-xl">
                    {/* <h2 className="text-xl text-white font-semibold mb-2">Interview #{interview.id}</h2> */}
                    <div className="flex items-center text-white/70 mb-4">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>{interview.messages.length} messages</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between text-white/70">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{getInterviewDate(interview)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{getInterviewTime(interview)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
