<<<<<<< HEAD
import { motion } from "framer-motion"

const BusInspection = ({ bus, onClose, onShowRating }) => {
  if (!bus) return null

  return (
    // ⭐ Overlay now scrollable
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      
      {/* ⭐ Modal now scrollable */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          AI Bus Safety Inspection
        </h2>

        {/* ================= AI CAMERA ================= */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            AI Safety Camera (Live Face Blur)
          </h3>

          <img
            src="http://localhost:5001/ai-camera"
            alt="AI Camera"
            className="w-full rounded-xl border"
          />

          <p className="text-xs text-gray-500 mt-2 text-center">
            YOLO AI actively blurring faces for privacy 🔒
          </p>
        </div>

        {/* ================= BUS INFO ================= */}
        <div className="space-y-2 mb-6">
          <p><b>Bus ID:</b> {bus.id}</p>
          <p><b>Route:</b> {bus.route}</p>
          <p><b>Status:</b> {bus.status}</p>
          <p><b>ETA:</b> {bus.eta}</p>
          <p><b>Crowd Level:</b> {bus.crowdLevel}</p>
        </div>

        {/* ================= AI RESULT ================= */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <p className="text-green-700 font-semibold">
            ✔ AI Inspection Complete
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Faces blurred successfully. Bus ready for rating.
          </p>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={onShowRating}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Proceed to Rating ⭐
          </button>
        </div>

      </motion.div>
    </div>
  )
}

export default BusInspection
=======
import { motion } from "framer-motion"

const BusInspection = ({ bus, onClose, onShowRating }) => {
  if (!bus) return null

  return (
    // ⭐ Overlay now scrollable
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      
      {/* ⭐ Modal now scrollable */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          AI Bus Safety Inspection
        </h2>

        {/* ================= AI CAMERA ================= */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            AI Safety Camera (Live Face Blur)
          </h3>

          <img
            src="http://localhost:5001/ai-camera"
            alt="AI Camera"
            className="w-full rounded-xl border"
          />

          <p className="text-xs text-gray-500 mt-2 text-center">
            YOLO AI actively blurring faces for privacy 🔒
          </p>
        </div>

        {/* ================= BUS INFO ================= */}
        <div className="space-y-2 mb-6">
          <p><b>Bus ID:</b> {bus.id}</p>
          <p><b>Route:</b> {bus.route}</p>
          <p><b>Status:</b> {bus.status}</p>
          <p><b>ETA:</b> {bus.eta}</p>
          <p><b>Crowd Level:</b> {bus.crowdLevel}</p>
        </div>

        {/* ================= AI RESULT ================= */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <p className="text-green-700 font-semibold">
            ✔ AI Inspection Complete
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Faces blurred successfully. Bus ready for rating.
          </p>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={onShowRating}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Proceed to Rating ⭐
          </button>
        </div>

      </motion.div>
    </div>
  )
}

export default BusInspection
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
