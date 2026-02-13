<<<<<<< HEAD
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'

const BusRating = ({ bus, onClose }) => {
  const [ticketNumber, setTicketNumber] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ticketNumber && rating > 0) {
      // Simulate rating submission
      setIsSubmitted(true)
      setTimeout(() => {
        onClose() // This will return to inspection view
      }, 2000)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
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
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ticket Number Input */}
                  <div className="space-y-2">
                    <label htmlFor="ticket" className="text-sm font-medium text-gray-700">
                      Enter Your Ticket Number
                    </label>
                    <Input
                      id="ticket"
                      type="text"
                      placeholder="e.g., TB123456"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500 hover:border-green-300"
                    />
                    <p className="text-xs text-gray-500">
                      Found on your ticket or booking confirmation
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block">
                      Rate Your Driver
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform duration-200 hover:scale-110 active:scale-95"
                        >
                          <svg
                            className={`w-12 h-12 transition-colors duration-200 ${
                              star <= (hoveredRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm font-medium text-gray-600"
                      >
                        {rating === 5 && "Excellent! ⭐⭐⭐⭐⭐"}
                        {rating === 4 && "Great! ⭐⭐⭐⭐"}
                        {rating === 3 && "Good! ⭐⭐⭐"}
                        {rating === 2 && "Fair ⭐⭐"}
                        {rating === 1 && "Poor ⭐"}
                      </motion.p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!ticketNumber || rating === 0}
                    >
                      Submit Rating
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="w-full"
                    >
                      Back to Inspection
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-12 h-12 text-green-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600">
                    Your rating has been submitted successfully.
                  </p>
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

=======
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'

const BusRating = ({ bus, onClose }) => {
  const [ticketNumber, setTicketNumber] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ticketNumber && rating > 0) {
      // Simulate rating submission
      setIsSubmitted(true)
      setTimeout(() => {
        onClose() // This will return to inspection view
      }, 2000)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
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
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ticket Number Input */}
                  <div className="space-y-2">
                    <label htmlFor="ticket" className="text-sm font-medium text-gray-700">
                      Enter Your Ticket Number
                    </label>
                    <Input
                      id="ticket"
                      type="text"
                      placeholder="e.g., TB123456"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 focus:border-green-500 hover:border-green-300"
                    />
                    <p className="text-xs text-gray-500">
                      Found on your ticket or booking confirmation
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block">
                      Rate Your Driver
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform duration-200 hover:scale-110 active:scale-95"
                        >
                          <svg
                            className={`w-12 h-12 transition-colors duration-200 ${
                              star <= (hoveredRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm font-medium text-gray-600"
                      >
                        {rating === 5 && "Excellent! ⭐⭐⭐⭐⭐"}
                        {rating === 4 && "Great! ⭐⭐⭐⭐"}
                        {rating === 3 && "Good! ⭐⭐⭐"}
                        {rating === 2 && "Fair ⭐⭐"}
                        {rating === 1 && "Poor ⭐"}
                      </motion.p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!ticketNumber || rating === 0}
                    >
                      Submit Rating
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="w-full"
                    >
                      Back to Inspection
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-12 h-12 text-green-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600">
                    Your rating has been submitted successfully.
                  </p>
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

>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
