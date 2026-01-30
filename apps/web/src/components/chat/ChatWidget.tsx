"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! 👋 Welcome to Invict Academy. How can I help you with studying in Italy today?',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const conversationId = useRef(`conv_${Date.now()}`)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    conversationId: conversationId.current,
                }),
            })

            const data = await response.json()

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message || 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble connecting. Please try again later or contact support.',
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const quickActions = [
        'Tell me about tuition costs',
        'How do I apply for a visa?',
        'What universities do you recommend?',
        'Help with scholarships',
    ]

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
                >
                    <MessageCircle className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-[#0B1020] border-white/10 shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Invict Assistant</h3>
                                <p className="text-xs text-white/80">Online • Typically replies instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#070A12]">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                                            : 'bg-white/5 text-gray-200 border border-white/10'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                                    <span className="text-sm text-gray-400">Typing...</span>
                                </div>
                            </div>
                        )}

                        {messages.length === 1 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 text-center">Quick actions:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setInput(action)
                                                setTimeout(() => handleSend(), 100)
                                            }}
                                            className="text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-gray-300 transition-colors"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-[#0B1020] border-t border-white/10">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                size="icon"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Powered by AI • For urgent matters, contact support
                        </p>
                    </div>
                </Card>
            )}
        </>
    )
}
