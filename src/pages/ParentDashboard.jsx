import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { submitSafetyReport } from '../api/auth'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const user = JSON.parse(localStorage.getItem("user"))

const childData = {
  name: user?.childName || "Child",
  school: "PCCE School",
  bus: "BUS101",
  status: "On Bus",
  pickupTime: "7:45 AM",
  dropTime: "3:30 PM",
}

const busLocation = [15.2993, 74.1240]

// animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const alertStyles = {
  success: 'bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200/90 hover:shadow-md hover:scale-[1.02]',
  warning: 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200/90 hover:shadow-md hover:scale-[1.02]',
  danger: 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200/90 hover:shadow-md hover:scale-[1.02]',
  info: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200/90 hover:shadow-md hover:scale-[1.02]',
}
const alertIconBg = {
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
  danger: 'bg-red-600',
  info: 'bg-blue-600',
}

const AlertCard = ({ type = 'info', icon, title }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className={`rounded-xl border-2 p-4 shadow-sm cursor-pointer transition-all duration-200 ${alertStyles[type] || alertStyles.info}`}
  >
    <div className="flex items-center gap-4">
      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-lg ${alertIconBg[type] || alertIconBg.info}`}>
        {icon}
      </span>
      <p className="font-semibold">{title}</p>
    </div>
  </motion.div>
)

const statStyles = {
  good: 'border-emerald-300 bg-gradient-to-br from-emerald-100 to-slate-50 text-emerald-900 hover:border-emerald-400 hover:shadow-lg hover:scale-[1.02]',
  caution: 'border-amber-300 bg-gradient-to-br from-amber-100 to-slate-50 text-amber-900 hover:border-amber-400 hover:shadow-lg hover:scale-[1.02]',
  neutral: 'border-blue-300 bg-gradient-to-br from-blue-100 to-slate-50 text-blue-900 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02]',
}

const StatCard = ({ label, value, variant = 'neutral' }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className={`rounded-xl border-2 shadow-sm p-5 cursor-pointer transition-all duration-200 ${statStyles[variant] || statStyles.neutral}`}
  >
    <p className="text-sm font-medium opacity-90">{label}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
)

const FEATURE_CONFIG = {
  hypermovement: {
    title: 'Hypermovement detection',
    description: 'Uses onboard camera and AI to detect excessive movement or restlessness in students. Alerts help ensure calmer, safer rides and can flag potential safety issues.',
    icon: '🔄',
  },
  emotion: {
    title: "Child's emotion",
    description: 'Real-time emotion analysis from the bus camera helps monitor wellbeing. We detect stress, discomfort, or distress so drivers and parents can be informed when needed.',
    icon: '😊',
  },
}

const ParentDashboard = () => {
  const [activePage, setActivePage] = useState('Home')
  const [reportForm, setReportForm] = useState({ type: '', description: '', location: '' })
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [featureOverlay, setFeatureOverlay] = useState(null) // 'hypermovement' | 'emotion' | null
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    if (!featureOverlay || !videoRef.current) return
    let stream = null
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        console.warn('Webcam access failed:', err)
      }
    }
    startWebcam()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (videoRef.current) videoRef.current.srcObject = null
    }
  }, [featureOverlay])

const handleReportSubmit = async (e) => {
  e.preventDefault()

  if (!reportForm.type || !reportForm.description.trim()) return

  try {
    await submitSafetyReport({
      username: user.name,
      email: user.email,
      issueType: reportForm.type,
      description: reportForm.description,
      location: reportForm.location,
    })

    setReportSubmitted(true)
    setReportForm({ type: '', description: '', location: '' })

  } catch (error) {
    alert("Failed to submit report")
    console.log(error)
  }
}


  const renderContent = () => {
    switch (activePage) {

      case 'Alerts':
        return (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <Card className="border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-default">
              <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <CardTitle className="text-slate-800">Parent Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                <AlertCard type="success" icon="✔" title="Child boarded bus at 7:50 AM" />
                <AlertCard type="warning" icon="⏰" title="Bus running late" />
                <AlertCard type="danger" icon="🚨" title="Harsh braking detected" />
                <AlertCard type="info" icon="📍" title="Bus reached school" />
              </CardContent>
            </Card>
          </motion.div>
        )

      case 'Live Track':
        return (
          <Card className="border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-default">
            <CardHeader className="bg-gradient-to-r from-emerald-100 to-slate-50 border-b border-emerald-200">
              <CardTitle className="text-emerald-900">Live Bus Location</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-b-lg overflow-hidden border border-t-0 border-slate-200">
                <MapContainer center={busLocation} zoom={13} style={{ height:"100%", width:"100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={busLocation}>
                    <Popup>School Bus 🚌</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        )

      case 'Driver Performance':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Driver Performance</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard label="Overspeeding" value="0 incidents" variant="good" />
              <StatCard label="Harsh Braking" value="2 incidents" variant="caution" />
              <StatCard label="Punctuality" value="95%" variant="good" />
            </div>
          </div>
        )

      case 'Safety Reports':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-default">
              <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <CardTitle className="text-slate-800">Report a Safety Issue</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Describe the issue and we’ll look into it promptly.</p>
              </CardHeader>
              <CardContent className="pt-5">
                {reportSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-emerald-100 border-2 border-emerald-300 p-4 text-emerald-900 font-medium space-y-3"
                  >
                    <p>✓ Your report has been submitted. We’ll get back to you soon.</p>
                    <Button type="button" variant="outline" onClick={() => setReportSubmitted(false)} className="border-emerald-400 text-emerald-800 hover:bg-emerald-200">
                      Report another issue
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue type *</label>
                      <select
                        value={reportForm.type}
                        onChange={(e) => setReportForm((f) => ({ ...f, type: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Speeding / Reckless driving">Speeding / Reckless driving</option>
                        <option value="Harsh braking">Harsh braking</option>
                        <option value="Route deviation">Route deviation</option>
                        <option value="Driver behavior">Driver behavior</option>
                        <option value="Vehicle condition">Vehicle condition</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
                      <textarea
                        value={reportForm.description}
                        onChange={(e) => setReportForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Describe what happened, when, and any relevant details..."
                        rows={4}
                        className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 resize-y"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Location (optional)</label>
                      <Input
                        value={reportForm.location}
                        onChange={(e) => setReportForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Near Main St & 5th Ave"
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                      Submit Report
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-emerald-600 border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-default">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-slate-50 border-b border-emerald-200">
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-sm">✓</span>
                  {childData.name} is Safe

                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-100/90 p-3 border border-emerald-200 transition-all duration-200 hover:bg-emerald-200/80 hover:shadow-md cursor-default">
                    <span className="text-emerald-700 font-semibold">Status</span>
                    <span className="font-bold text-emerald-800">{childData.status}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 border border-slate-200 transition-all duration-200 hover:bg-slate-200/80 hover:shadow-md cursor-default">
                    <span className="text-slate-600">Bus</span>
                    <span className="font-semibold text-slate-800">{childData.bus}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 border border-slate-200 transition-all duration-200 hover:bg-slate-200/80 hover:shadow-md cursor-default">
                    <span className="text-slate-600">Pickup</span>
                    <span className="font-semibold text-slate-800">{childData.pickupTime}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 border border-slate-200 transition-all duration-200 hover:bg-slate-200/80 hover:shadow-md cursor-default">
                    <span className="text-slate-600">Drop</span>
                    <span className="font-semibold text-slate-800">{childData.dropTime}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-3">
                  <button
  type="button"
  onClick={async () => {
    // open overlay
    setFeatureOverlay((v) => (v === 'hypermovement' ? null : 'hypermovement'))

    // call backend to start AI
    try {
      await fetch("http://localhost:5000/api/ai/start-hypermovement")
      console.log("HyperMovement AI started")
    } catch (err) {
      console.error("Failed to start HyperMovement AI", err)
    }
  }}
  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-medium hover:bg-amber-200 hover:shadow-md transition-all duration-200 cursor-pointer"
>
  <span>🔄</span> Hypermovement
</button>


                  <button
                    type="button"
                    onClick={() => setFeatureOverlay((v) => (v === 'emotion' ? null : 'emotion'))}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-100 border border-violet-300 text-violet-900 font-medium hover:bg-violet-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <span>😊</span> Child&apos;s emotion
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-300 cursor-default">
              <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <CardTitle className="text-slate-800">Live Bus Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] rounded-b-lg overflow-hidden border border-t-0 border-slate-200">
                  <MapContainer center={busLocation} zoom={13} style={{ height:"100%", width:"100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={busLocation}>
                      <Popup>School Bus 🚌</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} userType="parent" />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </main>
      </div>

      {featureOverlay && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setFeatureOverlay(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setFeatureOverlay(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 text-xl"
              aria-label="Close"
            >
              ✕
            </button>
            {(() => {
              const config = FEATURE_CONFIG[featureOverlay]
              if (!config) return null
              return (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 pr-10 mb-4 flex items-center gap-2">
                    <span>{config.icon}</span> {config.title}
                  </h3>
                  <div className="mb-4">
                    <div className="w-full h-[320px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{config.description}</p>
                </>
              )
            })()}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ParentDashboard