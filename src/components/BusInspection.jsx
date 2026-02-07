import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'

const BusInspection = ({ bus, onClose, onShowRating }) => {
  const [isBlurEnabled, setIsBlurEnabled] = useState(true)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Calculate capacity status (IR sensor: Low/Medium/High crowd level)
  const getCapacityStatus = () => {
    const capacity = bus.capacity || 50
    const occupied = bus.occupied || 0
    const percentage = (occupied / capacity) * 100
    const crowdLevel = percentage >= 80 ? "High" : percentage >= 50 ? "Medium" : "Low"

    if (percentage >= 80) {
      return { status: "Full", crowdLevel, color: "red", bgColor: "bg-red-100", textColor: "text-red-700" }
    } else if (percentage >= 50) {
      return { status: "Moderate", crowdLevel, color: "yellow", bgColor: "bg-yellow-100", textColor: "text-yellow-700" }
    } else if (percentage >= 20) {
      return { status: "Available", crowdLevel, color: "green", bgColor: "bg-green-100", textColor: "text-green-700" }
    } else {
      return { status: "Empty", crowdLevel, color: "gray", bgColor: "bg-gray-100", textColor: "text-gray-700" }
    }
  }

  const capacityInfo = getCapacityStatus()
  const capacity = bus.capacity || 50
  const occupied = bus.occupied || 0
  const available = capacity - occupied
  const percentage = (occupied / capacity) * 100

  // Simulated face detection boxes (in a real app, this would come from AI)
  const faceBoxes = [
    { x: 120, y: 80, width: 80, height: 100 },
    { x: 250, y: 100, width: 70, height: 90 },
    { x: 400, y: 90, width: 75, height: 95 },
    { x: 550, y: 110, width: 65, height: 85 },
  ]

  // Start camera feed
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
        // Start drawing face boxes and blur
        drawFaces()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      // Fallback: use a placeholder image
      setIsCameraActive(false)
    }
  }

  // Stop camera feed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  // Draw face detection boxes and apply blur
  const drawFaces = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const draw = () => {
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(draw)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      if (isBlurEnabled) {
        // Apply blur to detected face regions
        faceBoxes.forEach(face => {
          const imageData = ctx.getImageData(face.x, face.y, face.width, face.height)
          const blurredData = applyBlur(imageData, 15) // Blur radius
          ctx.putImageData(blurredData, face.x, face.y)
        })
      } else {
        // Draw face detection boxes when blur is disabled
        faceBoxes.forEach(face => {
          ctx.strokeStyle = '#00ff00'
          ctx.lineWidth = 2
          ctx.strokeRect(face.x, face.y, face.width, face.height)
          ctx.fillStyle = 'rgba(0, 255, 0, 0.1)'
          ctx.fillRect(face.x, face.y, face.width, face.height)
        })
      }

      requestAnimationFrame(draw)
    }

    draw()
  }

  // Simple box blur algorithm
  const applyBlur = (imageData, radius) => {
    const data = new Uint8ClampedArray(imageData.data)
    const width = imageData.width
    const height = imageData.height
    const result = new Uint8ClampedArray(data)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0, count = 0

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const px = x + dx
            const py = y + dy

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const idx = (py * width + px) * 4
              r += data[idx]
              g += data[idx + 1]
              b += data[idx + 2]
              a += data[idx + 3]
              count++
            }
          }
        }

        const idx = (y * width + x) * 4
        result[idx] = r / count
        result[idx + 1] = g / count
        result[idx + 2] = b / count
        result[idx + 3] = a / count
      }
    }

    return new ImageData(result, width, height)
  }

  // Update canvas when blur toggle changes
  useEffect(() => {
    if (isCameraActive) {
      drawFaces()
    }
  }, [isBlurEnabled, isCameraActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
        onClick={onClose}
        style={{ zIndex: 9999 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          <Card className="shadow-2xl flex flex-col max-h-[90vh]">
            <CardHeader className="flex flex-row items-center justify-between border-b flex-shrink-0">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Bus Inspection: {bus.id}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {bus.route} • ETA: {bus.eta} • Status: {bus.status}
                </p>
                {/* Capacity Info */}
                <div className="mt-3 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Capacity: {occupied}/{capacity} seats
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${capacityInfo.bgColor} ${capacityInfo.textColor}`}>
                    {capacityInfo.status}
                  </span>
                  <span className="text-xs text-gray-500">Crowd: {capacityInfo.crowdLevel}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 ml-4"
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
            <CardContent className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {/* Camera Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={isCameraActive ? stopCamera : startCamera}
                      variant={isCameraActive ? "destructive" : "default"}
                    >
                      {isCameraActive ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Start Camera
                        </>
                      )}
                    </Button>
                    {isCameraActive && (
                      <Button
                        onClick={() => setIsBlurEnabled(!isBlurEnabled)}
                        variant={isBlurEnabled ? "default" : "outline"}
                        className="flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        <span>{isBlurEnabled ? 'Faces Blurred' : 'Show Faces'}</span>
                      </Button>
                    )}
                  </div>
                  {isCameraActive && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>AI Detection Active</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera View */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300">
                  {!isCameraActive ? (
                    <div className="aspect-video flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 opacity-50"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg">Click "Start Camera" to begin inspection</p>
                        <p className="text-sm mt-2">AI will automatically detect and blur faces for privacy</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ display: isBlurEnabled ? 'none' : 'block' }}
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ display: 'block' }}
                      />
                      {!isBlurEnabled && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {faceBoxes.length} Faces Detected
                        </div>
                      )}
                      {isBlurEnabled && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Privacy Mode: Faces Blurred
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Capacity Details Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Bus Capacity Details</h4>
                  <div className="space-y-3">
                    {/* Capacity Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Occupancy</span>
                        <span className="text-sm font-semibold text-gray-800">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentage >= 80 ? 'bg-red-500' :
                            percentage >= 50 ? 'bg-yellow-500' :
                            percentage >= 20 ? 'bg-green-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Capacity Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{occupied}</p>
                        <p className="text-xs text-gray-500">Occupied</p>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <p className="text-2xl font-bold text-green-600">{available}</p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{capacity}</p>
                        <p className="text-xs text-gray-500">Total Seats</p>
                      </div>
                    </div>

                    {/* Capacity Range Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Capacity Status:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                          Empty: 0-19%
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                          Available: 20-49%
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                          Moderate: 50-79%
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                          Full: 80-100%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-green-600 mt-0.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">AI Face Blurring Feature</p>
                      <p>
                        This feature uses AI to automatically detect and blur faces in the bus camera feed to protect passenger privacy. 
                        You can toggle between blurred and unblurred views for inspection purposes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Rate Your Driver
                      </h3>
                      <p className="text-sm text-gray-500">
                        Help us improve by rating your journey experience
                      </p>
                    </div>

                    {!isRatingSubmitted ? (
                      <div className="space-y-4">
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
                                  className={`w-10 h-10 transition-colors duration-200 ${
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

                        {/* Submit Button */}
                        <Button
                          onClick={() => {
                            if (ticketNumber && rating > 0) {
                              setIsRatingSubmitted(true)
                              setTimeout(() => {
                                setIsRatingSubmitted(false)
                                setTicketNumber('')
                                setRating(0)
                              }, 3000)
                            }
                          }}
                          className="w-full"
                          size="lg"
                          disabled={!ticketNumber || rating === 0}
                        >
                          Submit Rating
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
                        >
                          <svg
                            className="w-10 h-10 text-green-600"
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
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          Thank You!
                        </h4>
                        <p className="text-sm text-gray-600">
                          Your rating has been submitted successfully.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BusInspection

