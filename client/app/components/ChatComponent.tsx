"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from "uuid"

export type Role = "user" | "ai" | "system"

export interface ChatMessage {
  id: string
  role: Role
  content: string
  timestamp: number
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [query, setQuery] = useState<string>("")

  const handleSendChatMessage = async () => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: query,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    const response = await fetch(`http://localhost:4000/query?message=${encodeURIComponent(query)}`)
    setQuery("")
    const data = await response.json()

    const aiMessage: ChatMessage = {
      id: uuidv4(),
      role: "ai",
      content: data.kwargs.content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, aiMessage])

  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-md max-w-xl text-white ${msg.role === "user"
                  ? "bg-blue-600"
                  : msg.role === "ai"
                    ? "bg-gray-700"
                    : "text-center text-sm text-white"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-300 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendChatMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Ask your file" className="flex-1" />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}

export default ChatComponent
