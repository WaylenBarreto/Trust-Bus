<<<<<<< HEAD
import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-100/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Animated Bus */}
        <div className="relative w-64 h-32 overflow-hidden">
          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 rounded-full" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" style={{ width: '60%' }} />
          
          {/* Moving Bus */}
          <motion.div
            className="absolute bottom-2"
            initial={{ x: -100 }}
            animate={{ x: 'calc(100vw + 100px)' }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              width="80"
              height="60"
              viewBox="0 0 80 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bus Body */}
              <rect x="10" y="15" width="60" height="35" rx="4" fill="#22c55e" />
              {/* Bus Windows */}
              <rect x="15" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="28" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="41" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="54" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              {/* Bus Wheels */}
              <circle cx="20" cy="52" r="6" fill="#1e40af" />
              <circle cx="20" cy="52" r="4" fill="#3b82f6" />
              <circle cx="60" cy="52" r="6" fill="#1e40af" />
              <circle cx="60" cy="52" r="4" fill="#3b82f6" />
              {/* Bus Door */}
              <rect x="65" y="20" width="8" height="25" rx="2" fill="#16a34a" />
              <line x1="69" y1="20" x2="69" y2="45" stroke="#d1fae5" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-2">Trust Bus</h2>
          <motion.p
            className="text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading

=======
import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-100/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Animated Bus */}
        <div className="relative w-64 h-32 overflow-hidden">
          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 rounded-full" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" style={{ width: '60%' }} />
          
          {/* Moving Bus */}
          <motion.div
            className="absolute bottom-2"
            initial={{ x: -100 }}
            animate={{ x: 'calc(100vw + 100px)' }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              width="80"
              height="60"
              viewBox="0 0 80 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bus Body */}
              <rect x="10" y="15" width="60" height="35" rx="4" fill="#22c55e" />
              {/* Bus Windows */}
              <rect x="15" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="28" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="41" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="54" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              {/* Bus Wheels */}
              <circle cx="20" cy="52" r="6" fill="#1e40af" />
              <circle cx="20" cy="52" r="4" fill="#3b82f6" />
              <circle cx="60" cy="52" r="6" fill="#1e40af" />
              <circle cx="60" cy="52" r="4" fill="#3b82f6" />
              {/* Bus Door */}
              <rect x="65" y="20" width="8" height="25" rx="2" fill="#16a34a" />
              <line x1="69" y1="20" x2="69" y2="45" stroke="#d1fae5" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-2">Trust Bus</h2>
          <motion.p
            className="text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading

>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
