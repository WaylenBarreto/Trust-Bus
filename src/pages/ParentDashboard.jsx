import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { submitSafetyReport } from '../api/auth'
import { getSchoolByID } from '../api/school'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Chatbot from "../components/ui/Chatbotp"

import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const user = JSON.parse(localStorage.getItem("user"))

// Fallback bus location (used until live data is available)
const defaultBusLocation = [15.2993, 74.1240]
const CHILD_BUS_ID = 'BUS330'

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
  const [schoolData, setSchoolData] = useState({ schoolID: user?.schoolID || '', schoolName: '', busNumber: '' })
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [liveBusMap, setLiveBusMap] = useState({})
  const [rashDrivingActive, setRashDrivingActive] = useState(false)

  // Fetch school details from backend using schoolID from signup
  useEffect(() => {
    const fetchSchool = async () => {
      const sid = user?.schoolID
      if (!sid) return
      try {
        const res = await getSchoolByID(sid)
        const { schoolID, schoolName, busNumber } = res.data
        setSchoolData({ schoolID, schoolName, busNumber })
      } catch (err) {
        console.warn('Could not fetch school:', err?.response?.data?.message || err.message)
      }
    }
    fetchSchool()
  }, [])

  // Fetch live bus data (location) on mount and then every 5 seconds
  useEffect(() => {
    let isMounted = true

    const fetchLiveBuses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bus')
        const map = {}
        res.data.forEach((bus) => {
          if (bus.busId) {
            map[bus.busId] = bus
          }
        })
        if (isMounted) {
          setLiveBusMap(map)

          const childBus = map[CHILD_BUS_ID]
          const isRash =
            !!(childBus && (childBus.rashDriving === true || childBus.harshDriving === true))
          setRashDrivingActive(isRash)
        }
      } catch (err) {
        console.warn('Failed to load live bus data for parent dashboard', err)
      }
    }

    fetchLiveBuses()
    const intervalId = setInterval(fetchLiveBuses, 2000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const getChildBusLocation = () => {
    const live = liveBusMap[CHILD_BUS_ID]

    if (live && live.location && typeof live.location.lat === 'number' && typeof live.location.lng === 'number') {
      return [live.location.lat, live.location.lng]
    }

    return defaultBusLocation
  }

  const childData = {
    name: user?.childName || "Child",
    school: schoolData.schoolName || "—",
    schoolID: schoolData.schoolID || user?.schoolID || "—",
    bus: CHILD_BUS_ID,
    status: "On Bus",
    pickupTime: "7:45 AM",
    dropTime: "3:30 PM",
  }

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
                <MapContainer center={getChildBusLocation()} zoom={13} style={{ height:"100%", width:"100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={getChildBusLocation()}>
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
                    <span className="text-slate-600">School ID</span>
                    <span className="font-semibold text-slate-800">{childData.schoolID}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 border border-slate-200 transition-all duration-200 hover:bg-slate-200/80 hover:shadow-md cursor-default">
                    <span className="text-slate-600">School Name</span>
                    <span className="font-semibold text-slate-800">{childData.school}</span>
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
  onClick={async () => {
    // open overlay
    setFeatureOverlay((v) => (v === 'emotion' ? null : 'emotion'))

    // ⭐ START EMOTION AI (THIS WAS MISSING)
    try {
      await fetch("http://localhost:5000/api/ai/start-emotion")
      console.log("Emotion AI started")
    } catch (err) {
      console.error("Failed to start Emotion AI", err)
    }
  }}
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
                  <MapContainer center={getChildBusLocation()} zoom={13} style={{ height:"100%", width:"100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={getChildBusLocation()}>
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

      {/* Live harsh driving alert popup on Alerts page */}
      {activePage === 'Alerts' && rashDrivingActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          <div className="rounded-xl border-2 border-red-300 bg-red-50 shadow-lg p-4 flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white text-lg">
              🚨
            </div>
            <div>
              <p className="font-semibold text-red-800">Harsh driving detected</p>
              <p className="text-sm text-red-700 mt-1">
                BUS330 is currently flagged for rash / harsh driving. We are monitoring this trip closely.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {featureOverlay && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={async () => {
  setFeatureOverlay(null)

  // ⭐ STOP PYTHON CAMERA WHEN POPUP CLOSES
  try {
    await fetch("http://localhost:5000/api/ai/stop-ai")
  } catch (err) {
    console.log("Failed to stop AI")
  }
}}

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
  onClick={async () => {
    setFeatureOverlay(null)

    // ⭐ STOP PYTHON WHEN X BUTTON CLICKED
    try {
      await fetch("http://localhost:5000/api/ai/stop-ai")
      console.log("AI stopped")
    } catch (err) {
      console.log("Failed to stop AI")
    }
  }}
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
                    <div className="w-full h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-black">

  {/* Hypermovement Stream */}
  {featureOverlay === "hypermovement" && (
    <img
      src="http://localhost:8000/video"
      alt="Hypermovement AI"
      className="w-full h-full object-contain"
      onError={(e) => {
        e.target.onerror = null;
        setTimeout(() => {
          e.target.src = "http://localhost:8000/video?retry=" + new Date().getTime();
        }, 2000);
      }}
    />
  )}

  {/* Emotion Stream */}
  {featureOverlay === "emotion" && (
    <img
      src="http://localhost:8001/video"
      alt="Emotion AI"
      className="w-full h-full object-contain"
      onError={(e) => {
        e.target.onerror = null;
        setTimeout(() => {
          e.target.src = "http://localhost:8001/video?retry=" + new Date().getTime();
        }, 2000);
      }}
    />
  )}

</div>

                  </div>
                  <p className="text-sm text-slate-600">{config.description}</p>
                </>
              )
            })()}
          </motion.div>
        </div>
      )}
      <Chatbot/>
    </div>
  )
}

export default ParentDashboard