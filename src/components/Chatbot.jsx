import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)

  const chatEndRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const sendMessage = async () => {
    if (!message.trim() || loading) return

    const userMessage = message
    setMessage("")
    setChat((prev) => [...prev, { sender: "You", text: userMessage }])
    setLoading(true)

    try {
      const res = await axios.post(
        "http://localhost:5000/api/dialogflow/chat",
        { message: userMessage }
      )

      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: res.data.reply || "No response from bot." },
      ])
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "Server not reachable 😢" },
      ])
    }

    setLoading(false)
  }

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-green-600 text-white text-2xl shadow-lg z-[9999]"
          >
            💬
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999]"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-3 flex justify-between items-center font-semibold">
              🚌 TrustBus Assistant
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Messages */}
            <div className="h-60 p-3 overflow-y-auto bg-gray-50 space-y-2">
              {chat.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Ask about buses, safety or timings 🙂
                </p>
              )}

              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm ${
                    msg.sender === "You" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-xl ${
                      msg.sender === "You"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}

              {loading && (
                <p className="text-xs text-gray-400">Bot typing...</p>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex border-t">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Type message..."
                className="flex-1 p-2 outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-4 font-semibold"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
