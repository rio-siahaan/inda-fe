"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const ConversationContext = createContext<{
  conversationId: string | null
}>({ conversationId: null })

export const useConversation = () => useContext(ConversationContext)

export const ConversationProvider = ({
  initialId,
  children,
}: {
  initialId: string | null
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const match = pathname.match(/\/inda\/([^/]+)/)
  const [conversationId, setConversationId] = useState<string | null>(initialId)

  useEffect(() => {
    if (match) {
      setConversationId(match[1])
    } else {
      setConversationId(null)
    }
  }, [pathname])

  return (
    <ConversationContext.Provider value={{ conversationId }}>
      {children}
    </ConversationContext.Provider>
  )
}
