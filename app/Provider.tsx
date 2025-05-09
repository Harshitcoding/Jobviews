'use client'
import { SessionProvider } from "next-auth/react"

const Provider = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
      <SessionProvider>
      {children}
      </SessionProvider>
    </div>
  )
}
export default Provider