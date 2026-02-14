import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
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
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80',
  warning: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/80',
  danger: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100/80',
  info: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100/80',
}
const alertIconBg = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
}

const AlertCard = ({ type = 'info', icon, title }) => (
  <motion.div
    variants={itemVariants}
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
  good: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-800',
  caution: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white text-amber-800',
  neutral: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white text-blue-800',
}

const StatCard = ({ label, value, variant = 'neutral' }) => (
  <motion.div
    variants={itemVariants}
    className={`rounded-xl border-2 shadow-sm p-5 transition-shadow hover:shadow-md ${statStyles[variant] || statStyles.neutral}`}
  >
    <p className="text-sm font-medium opacity-90">{label}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
)

const ParentDashboard = () => {
  const [activePage, setActivePage] = useState('Home')

  const renderContent = () => {
    switch (activePage) {

      case 'Alerts':
        return (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
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
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
              <CardTitle className="text-emerald-900">Live Bus Location</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-b-lg overflow-hidden border border-t-0 border-gray-200">
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

      default:
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-emerald-500 border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm">✓</span>
                  {childData.name} is Safe
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-50/80 p-3 border border-emerald-100">
                    <span className="text-emerald-600 font-semibold">Status</span>
                    <span className="font-bold text-emerald-700">{childData.status}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-600">Bus</span>
                    <span className="font-semibold text-slate-800">{childData.bus}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-600">Pickup</span>
                    <span className="font-semibold text-slate-800">{childData.pickupTime}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-slate-600">Drop</span>
                    <span className="font-semibold text-slate-800">{childData.dropTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                <CardTitle className="text-slate-800">Live Bus Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] rounded-b-lg overflow-hidden border border-t-0 border-gray-200">
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
    <div className="flex h-screen bg-gray-50/80">
      <Sidebar activePage={activePage} setActivePage={setActivePage} userType="parent" />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ParentDashboard