<<<<<<< HEAD
import { motion } from 'framer-motion'

const AnimatedBuses = () => {
  const buses = [
    { delay: 0, speed: 8 },
    { delay: 2, speed: 10 },
    { delay: 4, speed: 7 },
    { delay: 1, speed: 9 },
  ]

  const BusIcon = ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="6" width="16" height="10" rx="2" fill="#22c55e" />
      <rect x="6" y="9" width="3" height="4" fill="#d1fae5" />
      <rect x="11" y="9" width="3" height="4" fill="#d1fae5" />
      <rect x="15" y="9" width="3" height="4" fill="#d1fae5" />
      <circle cx="8" cy="18" r="1.5" fill="#1e40af" />
      <circle cx="16" cy="18" r="1.5" fill="#1e40af" />
    </svg>
  )

  return (
    <div className="relative h-16 w-full overflow-hidden mb-4">
      {/* Road lines */}
      <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-200" />
      <motion.div
        className="absolute bottom-4 left-0 h-0.5 bg-white"
        style={{ width: '30%' }}
        animate={{
          x: ['-30%', '130%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Animated Buses */}
      {buses.map((bus, index) => (
        <motion.div
          key={index}
          className="absolute bottom-6"
          initial={{ x: '-10%' }}
          animate={{
            x: ['-10%', '110%'],
          }}
          transition={{
            duration: bus.speed,
            repeat: Infinity,
            delay: bus.delay,
            ease: "linear",
          }}
        >
          <BusIcon size={32} />
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedBuses

=======
import { motion } from 'framer-motion'

const AnimatedBuses = () => {
  const buses = [
    { delay: 0, speed: 8 },
    { delay: 2, speed: 10 },
    { delay: 4, speed: 7 },
    { delay: 1, speed: 9 },
  ]

  const BusIcon = ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="6" width="16" height="10" rx="2" fill="#22c55e" />
      <rect x="6" y="9" width="3" height="4" fill="#d1fae5" />
      <rect x="11" y="9" width="3" height="4" fill="#d1fae5" />
      <rect x="15" y="9" width="3" height="4" fill="#d1fae5" />
      <circle cx="8" cy="18" r="1.5" fill="#1e40af" />
      <circle cx="16" cy="18" r="1.5" fill="#1e40af" />
    </svg>
  )

  return (
    <div className="relative h-16 w-full overflow-hidden mb-4">
      {/* Road lines */}
      <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-200" />
      <motion.div
        className="absolute bottom-4 left-0 h-0.5 bg-white"
        style={{ width: '30%' }}
        animate={{
          x: ['-30%', '130%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Animated Buses */}
      {buses.map((bus, index) => (
        <motion.div
          key={index}
          className="absolute bottom-6"
          initial={{ x: '-10%' }}
          animate={{
            x: ['-10%', '110%'],
          }}
          transition={{
            duration: bus.speed,
            repeat: Infinity,
            delay: bus.delay,
            ease: "linear",
          }}
        >
          <BusIcon size={32} />
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedBuses

>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
