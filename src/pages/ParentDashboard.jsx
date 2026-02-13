import { useState } from 'react'
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion'
=======
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const user = JSON.parse(localStorage.getItem("user"))

const childData = {
  name: user?.childName || "Child",
  school: "PCCE School",
  bus: "BUS101",
  status: "On Bus",
  pickupTime: "7:45 AM",
  dropTime: "3:30 PM",
}

<<<<<<< HEAD
const busLocation = [15.2993, 74.1240]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
}

const AlertCard = ({ type, icon, title, time, details, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const styleMap = {
    success: 'bg-emerald-50/80 border-emerald-200/80 hover:bg-emerald-50 hover:border-emerald-300',
    warning: 'bg-amber-50/80 border-amber-200/80 hover:bg-amber-50 hover:border-amber-300',
    danger: 'bg-rose-50/80 border-rose-200/80 hover:bg-rose-50 hover:border-rose-300',
    info: 'bg-sky-50/80 border-sky-200/80 hover:bg-sky-50 hover:border-sky-300',
  }
  return (
    <motion.div
      layout
      variants={itemVariants}
      className={`rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ${styleMap[type] || styleMap.info}`}
      onClick={() => setExpanded(!expanded)}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{title}</p>
            {time && <p className="text-sm text-gray-600 mt-0.5">{time}</p>}
            {expanded && details && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-gray-600 mt-2"
              >
                {details}
              </motion.p>
            )}
          </div>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-gray-400 shrink-0"
        >
          ▼
        </motion.span>
      </div>
    </motion.div>
  )
}

const StatCard = ({ label, value, subtext, icon, color = 'emerald', onClick }) => {
  const colors = {
    emerald: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    amber: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    sky: 'from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
  }
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors[color]} p-5 text-white shadow-lg transition-shadow hover:shadow-xl ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-white/10" />
      <div className="relative">
        <span className="text-3xl">{icon}</span>
        <p className="text-sm font-medium opacity-90 mt-2">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
      </div>
    </motion.div>
  )
}

const ParentDashboard = () => {
  const [activePage, setActivePage] = useState('Home')
  const [mapKey, setMapKey] = useState(0)
=======

// Demo bus location
const busLocation = [15.2993, 74.1240] 

const ParentDashboard = () => {
  const [activePage, setActivePage] = useState('Home')
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758

  const renderContent = () => {
    switch (activePage) {
      case 'Alerts':
        return (
<<<<<<< HEAD
          <motion.div
            key="alerts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Parent Notifications
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Tap any alert for details • MPU6050 detects abnormal activity
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                  <AlertCard type="success" icon="✔" title="Child boarded bus" time="7:50 AM" details="Your child has safely boarded the school bus at the designated pickup point." defaultExpanded />
                  <AlertCard type="warning" icon="⏰" title="Bus running late" time="~5 min delay" details="Traffic congestion on Route 12. Estimated 5-minute delay. Driver is taking alternative route." />
                  <AlertCard type="danger" icon="🚨" title="Hyper-Movement: Harsh braking" time="8:12 AM" details="MPU6050 sensor detected sudden deceleration. Alert automatically sent. Driver has been notified." />
                  <AlertCard type="danger" icon="🚨" title="Unusual movement detected" time="8:15 AM" details="MPU6050 detected irregular motion pattern. Safety team has been notified." />
                  <AlertCard type="info" icon="📍" title="Bus reached school" time="8:45 AM" details="Bus has arrived safely at PCCE School. All students disembarked." />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
=======
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parent Notifications</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Automatic alerts when abnormal activity is detected (MPU6050)</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-green-100 rounded-lg border border-green-200">✔ Child boarded bus at 7:50 AM</div>
                <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">⏰ Bus running 5 minutes late</div>
                <div className="p-4 bg-red-100 rounded-lg border border-red-200">🚨 Hyper-Movement: Harsh braking detected at 8:12 AM — Alert sent</div>
                <div className="p-4 bg-red-100 rounded-lg border border-red-200">🚨 Unusual movement detected — MPU6050 alert at 8:15 AM</div>
                <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">📍 Bus reached school</div>
              </CardContent>
            </Card>
          </div>
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
        )

      case 'Live Track':
        return (
<<<<<<< HEAD
          <motion.div
            key="livetrack"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-sky-500/10 to-blue-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">GPS Tracking</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Real-time bus location</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMapKey(k => k + 1)}
                    className="px-4 py-2 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors shadow-md"
                  >
                    🔄 Refresh Location
                  </motion.button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 flex flex-wrap gap-4 bg-gray-50/50 border-b">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium">{childData.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">Bus: <strong>{childData.bus}</strong></div>
                </div>
                <motion.div
                  key={mapKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[500px] rounded-b-lg overflow-hidden"
                >
                  <MapContainer center={busLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={busLocation}>
                      <Popup>School Bus 🚌 • Live</Popup>
                    </Marker>
                  </MapContainer>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
=======
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GPS Tracking for Parents</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Track the school bus live</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm"><b>Child:</b> {childData.name}</p>
                  <p className="text-sm"><b>Bus:</b> {childData.bus}</p>
                </div>
                <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer center={busLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={busLocation}>
                      <Popup>School Bus 🚌 • Live Location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
        )

      case 'Driver Performance':
        return (
<<<<<<< HEAD
          <motion.div
            key="driver"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Driver Performance</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Overspeeding, harsh braking & punctuality</p>
              </CardHeader>
              <CardContent>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-4">
                  <StatCard label="Overspeeding" value="0" subtext="incidents this week" icon="🚦" color="emerald" />
                  <StatCard label="Harsh Braking" value="2" subtext="incidents this week" icon="🛑" color="amber" />
                  <StatCard label="Punctuality" value="95%" subtext="on-time rate" icon="⏱️" color="sky" />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-700">Punctuality trend (last 7 days)</p>
                  <div className="mt-3 flex items-end gap-2 h-16">
                    {[95, 92, 98, 94, 95, 97, 95].map((pct, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 200 }}
                        className="flex-1 min-w-0 rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Mon</span>
                    <span>Sun</span>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
=======
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance Monitoring</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Tracks overspeeding, harsh braking and punctuality</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Overspeeding</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">0 incidents</p>
                    <p className="text-xs text-gray-500 mt-1">This week</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">Harsh Braking</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">2 incidents</p>
                    <p className="text-xs text-gray-500 mt-1">This week</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Punctuality</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">95%</p>
                    <p className="text-xs text-gray-500 mt-1">On-time rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
        )

      case 'Safety Reports':
        return (
<<<<<<< HEAD
          <motion.div
            key="safety"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">AI Safety Reports</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Weekly/monthly insights</p>
              </CardHeader>
              <CardContent>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Driver Performance', score: '4.2/5', detail: '2 harsh braking events', icon: '⭐' },
                    { title: 'Student Safety', detail: 'Camera + AI analysis (future)', icon: '👁️' },
                    { title: 'Bus Health', detail: 'All systems OK • Maintenance Mar 15', icon: '🔧' },
                  ].map((r, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <p className="font-semibold text-gray-900 mt-2">{r.title}</p>
                      {r.score && <p className="text-emerald-600 font-bold mt-1">{r.score}</p>}
                      <p className="text-sm text-gray-600 mt-1">{r.detail}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
=======
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Safety Reports</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Weekly/monthly reports for school admins and parents</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">Driver Performance</p>
                    <p className="text-sm text-gray-600 mt-1">Overall score: 4.2/5 • 2 harsh braking events</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">Student Safety Monitoring</p>
                    <p className="text-sm text-gray-600 mt-1">Camera + AI: behavior & emotional analysis (future)</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">Bus Health</p>
                    <p className="text-sm text-gray-600 mt-1">All systems OK • Next maintenance: Mar 15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
        )

      case 'Home':
      default:
        return (
<<<<<<< HEAD
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Status Hero */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8 text-white shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm font-medium opacity-90">Hello, {user?.name || 'Parent'}</p>
                  <h1 className="text-2xl md:text-3xl font-bold mt-1">{childData.name} is safe</h1>
                  <div className="flex items-center gap-3 mt-4">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      {childData.status}
                    </motion.span>
                    <span className="text-sm opacity-90">Bus {childData.bus}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center"
                  >
                    <p className="text-3xl font-bold">10</p>
                    <p className="text-sm opacity-90">mins to home</p>
                  </motion.div>
                  <div className="w-px bg-white/30" />
                  <div className="text-center">
                    <p className="text-3xl font-bold">{childData.dropTime}</p>
                    <p className="text-sm opacity-90">ETA</p>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-6 h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-xs mt-2 opacity-80">Trip progress • ~75% complete</p>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="School" value={childData.school} icon="🏫" color="sky" />
              <StatCard label="Pickup" value={childData.pickupTime} icon="🕐" color="amber" />
              <StatCard label="Drop" value={childData.dropTime} icon="📍" color="emerald" />
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActivePage('Live Track')}
                className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <span className="text-3xl">🗺️</span>
                <p className="text-sm font-medium opacity-90 mt-2">Live Track</p>
                <p className="text-lg font-bold">View Map</p>
              </motion.div>
            </motion.div>

            {/* Recent Alerts */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Recent Alerts</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">MPU6050 hyper-movement detection</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePage('Alerts')}
                  className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  View all →
                </motion.button>
              </CardHeader>
              <CardContent>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
                  <AlertCard type="success" icon="✔" title="Child boarded bus at 7:50 AM" />
                  <AlertCard type="warning" icon="⏰" title="Bus running 5 minutes late" />
                  <AlertCard type="danger" icon="🚨" title="Harsh braking detected — Alert sent" />
                  <AlertCard type="info" icon="📍" title="Bus reached school" />
                </motion.div>
              </CardContent>
            </Card>

            {/* Map Preview */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card
                className="overflow-hidden border-0 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => setActivePage('Live Track')}
              >
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">Live Bus Location</CardTitle>
                    <span className="text-sm text-sky-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] relative group">
                    <MapContainer center={busLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
                      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={busLocation}>
                        <Popup>School Bus 🚌</Popup>
                      </Marker>
                    </MapContainer>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white rounded-full shadow-lg font-medium text-gray-700">
                        Click to expand map
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
=======
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Child Bus Status</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><b>Name:</b> {childData.name}</p>
                  <p><b>School:</b> {childData.school}</p>
                  <p><b>Bus Number:</b> {childData.bus}</p>
                  <p className="text-green-600 font-semibold">Status: {childData.status}</p>
                </div>
                <div className="space-y-2">
                  <p><b>Pickup Time:</b> {childData.pickupTime}</p>
                  <p><b>Drop Time:</b> {childData.dropTime}</p>
                  <p className="text-blue-600 font-semibold">Next Stop: Home in 10 mins</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts (Hyper-Movement Detection)</CardTitle>
                <p className="text-sm text-gray-500 mt-1">MPU6050 detects harsh braking, accidents → instant parent alert</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-green-100 rounded">✔ Child boarded bus at 7:50 AM</div>
                <div className="p-3 bg-yellow-100 rounded">⏰ Bus running 5 minutes late</div>
                <div className="p-3 bg-red-100 rounded">🚨 Harsh braking detected — Alert sent</div>
                <div className="p-3 bg-blue-100 rounded">📍 Bus reached school</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live School Bus Location (GPS)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer center={busLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={busLocation}>
                      <Popup>School Bus is here 🚌</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
        )
    }
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
=======
    <div className="min-h-screen bg-gray-50">
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
      <div className="flex h-screen overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} userType="parent" />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <main className="flex-1 overflow-y-auto p-6">
<<<<<<< HEAD
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
=======
            {renderContent()}
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
          </main>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard
