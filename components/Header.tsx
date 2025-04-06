'use client'
import { signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"

const Header = () => {
  const { data: session, status } = useSession()

  return (
    <div className="flex justify-around items-center py-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 ">
      <div className="text-4xl font-bold">
        JobViews
      </div>
      <div>
        {status === "loading" ? (
          <div className="animate-spin border-4 border-t-transparent border-blue-500 rounded-full w-6 h-6"></div>
        ) : session?.user ? (
          <img
            src={session.user.image || '/default-avatar.png'}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <Button onClick={() => signIn('google')}>Signin</Button>
        )}
      </div>
    </div>
  )
}

export default Header
