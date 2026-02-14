import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

const BusRating = ({ bus, onClose }) => {
  const [ticketNumber, setTicketNumber] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Safety guard
  if (!bus) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ticketNumber || rating === 0) return

    setIsSubmitted(true)

    // simulate API delay
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl rounded-2xl border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Rate Your Journey
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {bus.id} • {bus.route}
                </p>
              </div>

              <Button variant="ghost" size="icon" onClick={onClose}>
                ✕
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Ticket */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ticket Number
                    </label>
                    <Input
                      placeholder="e.g. TB123456"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      required
                    />
                  </div>

                  {/* Stars */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block text-center">
                      Rate Driver
                    </label>

                    <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="hover:scale-110 transition"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            className={`w-12 h-12 ${
                              star <= (hoveredRating || rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={!ticketNumber || rating===0}>
                    Submit Rating ⭐
                  </Button>

                  <Button variant="ghost" onClick={onClose} className="w-full">
                    Back
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="text-xl font-bold">Thank you!</h3>
                  <p className="text-gray-500">Rating submitted successfully</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BusRating
