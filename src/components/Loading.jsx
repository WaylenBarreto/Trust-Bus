import { motion } from "framer-motion"

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">

      {/* Animated background sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-center space-y-6">

        {/* Bus animation */}
        <div className="relative w-64 h-32 overflow-hidden">
          <div className="absolute bottom-0 w-full h-2 bg-gray-300 rounded-full" />
          <div className="absolute bottom-0 w-2/3 h-1 bg-white rounded-full" />

          <motion.div
            className="absolute bottom-2"
            initial={{ x: -120 }}
            animate={{ x: 260 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <svg width="80" height="60" viewBox="0 0 80 60">
              <rect x="10" y="15" width="60" height="35" rx="4" fill="#22c55e" />
              <rect x="15" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="28" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="41" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <rect x="54" y="20" width="10" height="10" rx="2" fill="#d1fae5" />
              <circle cx="20" cy="52" r="6" fill="#1e40af" />
              <circle cx="60" cy="52" r="6" fill="#1e40af" />
              <rect x="65" y="20" width="8" height="25" rx="2" fill="#16a34a" />
            </svg>
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            TrustBus
          </h2>

          <motion.p
            className="text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading your dashboard...
          </motion.p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ y:[0,-10,0], opacity:[0.5,1,0.5] }}
              transition={{ duration:0.8, repeat:Infinity, delay:i*0.2 }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Loading
