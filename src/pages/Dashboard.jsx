<<<<<<< HEAD
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import AnimatedBuses from '../components/AnimatedBuses'
import BusInspection from '../components/BusInspection'
import BusRating from '../components/BusRating'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import Chatbot from "../components/Chatbot";


// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Dummy bus data with locations and photos (IR sensor crowd: Low/Medium/High)
const dummyBuses = [
  { 
    id: "BUS101", 
    route: "Vasco → PCCE → Panjim", 
    status: "On Time", 
    eta: "5 min",
    location: [15.3893, 73.8149], // Vasco area
    photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop",
    capacity: 50,
    occupied: 42, // 84% - Full
    crowdLevel: "High" // IR sensor: Low / Medium / High
  },
  { 
    id: "BUS204", 
    route: "Margao → PCCE", 
    status: "Delayed", 
    eta: "15 min",
    location: [15.2993, 73.9570], // Margao area
    photo: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?w=200&h=200&fit=crop",
    capacity: 50,
    occupied: 15, // 30% - Empty
    crowdLevel: "Low"
  },
  { 
    id: "BUS330", 
    route: "Verna → PCCE", 
    status: "Arriving Soon", 
    eta: "2 min",
    location: [15.3500, 73.9000], // Verna area
    photo: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=200&h=200&fit=crop",
    capacity: 50,
    occupied: 28, // 56% - Moderate
    crowdLevel: "Medium"
  }
]

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "On Time":
      return "text-green-600 font-semibold"
    case "Delayed":
      return "text-red-600 font-semibold"
    case "Arriving Soon":
      return "text-yellow-600 font-semibold"
    default:
      return "text-gray-600"
  }
}

const Dashboard = () => {
  const [activePage, setActivePage] = useState('Home')
  const [selectedBus, setSelectedBus] = useState(null)
  const [showRating, setShowRating] = useState(false)

  // Default map center (Goa, India coordinates)
  const mapCenter = [15.2993, 74.1240]

  const handleBusSelect = (bus) => {
    setSelectedBus(bus)
    setShowRating(false) // Show inspection first
  }

  const handleCloseInspection = () => {
    setSelectedBus(null)
    setShowRating(false)
  }

  const handleShowRating = () => {
    setShowRating(true)
  }

  const handleCloseRating = () => {
    setShowRating(false)
  }

  // Render content based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'Bus Status':
        return (
          <div className="max-w-7xl mx-auto">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Bus Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dummyBuses.map((bus, index) => (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1 
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                      onClick={() => handleBusSelect(bus)}
                    >
                      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            {/* Bus Photo */}
                            <div className="relative">
                              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center relative">
                                <img
                                  src={bus.photo}
                                  alt={bus.id}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Hide image on error - gradient background will show
                                    e.target.style.display = 'none'
                                  }}
                                />
                                {/* Fallback bus icon - shows if image fails or as background */}
                                <svg
                                  className="w-12 h-12 text-white absolute inset-0 m-auto"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  style={{ opacity: 0.3 }}
                                >
                                  <rect x="4" y="6" width="16" height="10" rx="2" />
                                  <rect x="6" y="9" width="3" height="4" fill="currentColor" />
                                  <rect x="11" y="9" width="3" height="4" fill="currentColor" />
                                  <rect x="15" y="9" width="3" height="4" fill="currentColor" />
                                  <circle cx="8" cy="18" r="1.5" fill="currentColor" />
                                  <circle cx="16" cy="18" r="1.5" fill="currentColor" />
                                </svg>
                              </div>
                              {/* Status Badge */}
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                bus.status === "On Time" ? "bg-green-500" :
                                bus.status === "Delayed" ? "bg-red-500" :
                                "bg-yellow-500"
                              }`} />
                            </div>
                            
                            {/* Bus Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-800 truncate">
                                {bus.id}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 truncate">
                                {bus.route}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  bus.status === "On Time" ? "bg-green-100 text-green-700" :
                                  bus.status === "Delayed" ? "bg-red-100 text-red-700" :
                                  "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {bus.status}
                                </span>
                                <span className={`text-lg font-bold ${
                                  bus.status === "On Time" ? "text-green-600" :
                                  bus.status === "Delayed" ? "text-red-600" :
                                  "text-yellow-600"
                                }`}>
                                  {bus.eta}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Crowd:</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  bus.crowdLevel === "Low" ? "bg-green-100 text-green-700" :
                                  bus.crowdLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {bus.crowdLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'Routes':
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Bus Routes & Live Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatedBuses />
                <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200 relative" style={{ zIndex: selectedBus ? 1 : 'auto' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: '100%', width: '100%', zIndex: selectedBus ? 1 : 'auto' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Bus Markers */}
                    {dummyBuses.map((bus) => {
                      // Create custom bus icon
                      const busIcon = L.divIcon({
                        className: 'custom-bus-marker',
                        html: `
                          <div style="
                            background: ${bus.status === "On Time" ? "#10b981" : bus.status === "Delayed" ? "#ef4444" : "#eab308"};
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: white;
                            font-size: 12px;
                          ">
                            ${bus.id.replace('BUS', '')}
                          </div>
                        `,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                      })
                      
                      return (
                        <Marker key={bus.id} position={bus.location} icon={busIcon}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-sm mb-1">{bus.id}</h3>
                              <p className="text-xs text-gray-600 mb-1">{bus.route}</p>
                              <p className="text-xs">
                                <span className="font-semibold">Status:</span> {bus.status}
                              </p>
                              <p className="text-xs">
                                <span className="font-semibold">ETA (AI):</span> {bus.eta}
                              </p>
                              <p className="text-xs">
                                <span className="font-semibold">Crowd:</span> {bus.crowdLevel}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    })}
                  </MapContainer>
                </div>
                
                {/* Bus List Below Map */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dummyBuses.map((bus) => (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors cursor-pointer"
                      onClick={() => handleBusSelect(bus)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{bus.id}</p>
                          <p className="text-xs text-gray-500 mt-1">{bus.route}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-semibold ${
                            bus.status === "On Time" ? "text-green-600" :
                            bus.status === "Delayed" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {bus.status}
                          </p>
                          <p className={`text-sm font-bold mt-1 ${
                            bus.status === "On Time" ? "text-green-600" :
                            bus.status === "Delayed" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>{bus.eta}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block ${
                            bus.crowdLevel === "Low" ? "bg-green-100 text-green-700" :
                            bus.crowdLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>{bus.crowdLevel}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'Notifications':
        return (
          <div className="max-w-7xl mx-auto">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Smart Notifications
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Get alerts when the bus is near or a less crowded option is available
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">🚌</span>
                      <div>
                        <p className="font-semibold text-green-800">Bus Approaching</p>
                        <p className="text-sm text-green-700 mt-1">BUS330 is 2 min away from your stop • Vasco → PCCE</p>
                        <p className="text-xs text-gray-500 mt-2">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">💡</span>
                      <div>
                        <p className="font-semibold text-blue-800">Less Crowded Option</p>
                        <p className="text-sm text-blue-700 mt-1">BUS204 has Low crowd level • Arriving in 15 min</p>
                        <p className="text-xs text-gray-500 mt-2">5 min ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">⏰</span>
                      <div>
                        <p className="font-semibold text-gray-800">Schedule Update</p>
                        <p className="text-sm text-gray-600 mt-1">BUS101 running 5 min late due to traffic</p>
                        <p className="text-xs text-gray-500 mt-2">12 min ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'Home':
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Map Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Live Bus Tracking (GPS)
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Real-time bus locations on map</p>
              </CardHeader>
              <CardContent>
                <AnimatedBuses />
                <div className="h-[350px] w-full rounded-lg overflow-hidden border border-gray-200 relative" style={{ zIndex: selectedBus ? 1 : 'auto' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: '100%', width: '100%', zIndex: selectedBus ? 1 : 'auto' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        Trust Bus Location
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bus Table Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Bus Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Bus ID</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead className="text-center">ETA (AI)</TableHead>
                      <TableHead className="text-center">Crowd</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyBuses.map((bus, index) => {
                      const MotionTableRow = motion(TableRow)
                      return (
                        <MotionTableRow
                          key={bus.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1 
                          }}
                          className="cursor-pointer hover:bg-green-50 transition-colors"
                          onClick={() => handleBusSelect(bus)}
                        >
                          <TableCell className="font-medium">{bus.id}</TableCell>
                          <TableCell>{bus.route}</TableCell>
                          <TableCell className={`text-center font-medium ${
                            bus.status === "On Time" ? "text-green-600" :
                            bus.status === "Delayed" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {bus.eta}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              bus.crowdLevel === "Low" ? "bg-green-100 text-green-700" :
                              bus.crowdLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {bus.crowdLevel}
                            </span>
                          </TableCell>
                          <TableCell className={`text-right ${getStatusColor(bus.status)}`}>
                            {bus.status}
                          </TableCell>
                        </MotionTableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Bus Inspection Modal - shown first as key feature */}
      {selectedBus && !showRating && (
        <BusInspection 
          bus={selectedBus} 
          onClose={handleCloseInspection}
          onShowRating={handleShowRating}
        />
      )}

      {/* Bus Rating Modal - accessible from inspection */}
      {selectedBus && showRating && (
        <BusRating 
          bus={selectedBus} 
          onClose={handleCloseRating}
        />
      )}
      {/* ✅ CHATBOT GOES HERE */}
      <Chatbot />
    </div>
  )
}

export default Dashboard

=======
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import AnimatedBuses from '../components/AnimatedBuses'
import BusInspection from '../components/BusInspection'
import BusRating from '../components/BusRating'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Dummy bus data with locations and photos (IR sensor crowd: Low/Medium/High)
const dummyBuses = [
  { 
    id: "BUS101", 
    route: "Vasco → PCCE → Panjim", 
    status: "On Time", 
    eta: "5 min",
    location: [15.3893, 73.8149], // Vasco area
    photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop",
    capacity: 50,
    occupied: 42, // 84% - Full
    crowdLevel: "High" // IR sensor: Low / Medium / High
  },
  { 
    id: "BUS204", 
    route: "Margao → PCCE", 
    status: "Delayed", 
    eta: "15 min",
    location: [15.2993, 73.9570], // Margao area
    photo: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?w=200&h=200&fit=crop",
    capacity: 50,
    occupied: 15, // 30% - Empty
    crowdLevel: "Low"
  },
  { 
    id: "BUS330", 
    route: "Verna → PCCE", 
    status: "Arriving Soon", 
    eta: "2 min",
    location: [15.3500, 73.9000], // Verna area
    photo: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=200&h=200&fit=crop",
    capacity: 50,
    occupied: 28, // 56% - Moderate
    crowdLevel: "Medium"
  }
]

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "On Time":
      return "text-green-600 font-semibold"
    case "Delayed":
      return "text-red-600 font-semibold"
    case "Arriving Soon":
      return "text-yellow-600 font-semibold"
    default:
      return "text-gray-600"
  }
}

const Dashboard = () => {
  const [activePage, setActivePage] = useState('Home')
  const [selectedBus, setSelectedBus] = useState(null)
  const [showRating, setShowRating] = useState(false)

  // Default map center (Goa, India coordinates)
  const mapCenter = [15.2993, 74.1240]

  const handleBusSelect = (bus) => {
    setSelectedBus(bus)
    setShowRating(false) // Show inspection first
  }

  const handleCloseInspection = () => {
    setSelectedBus(null)
    setShowRating(false)
  }

  const handleShowRating = () => {
    setShowRating(true)
  }

  const handleCloseRating = () => {
    setShowRating(false)
  }

  // Render content based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'Bus Status':
        return (
          <div className="max-w-7xl mx-auto">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Bus Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dummyBuses.map((bus, index) => (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1 
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                      onClick={() => handleBusSelect(bus)}
                    >
                      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            {/* Bus Photo */}
                            <div className="relative">
                              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center relative">
                                <img
                                  src={bus.photo}
                                  alt={bus.id}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Hide image on error - gradient background will show
                                    e.target.style.display = 'none'
                                  }}
                                />
                                {/* Fallback bus icon - shows if image fails or as background */}
                                <svg
                                  className="w-12 h-12 text-white absolute inset-0 m-auto"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  style={{ opacity: 0.3 }}
                                >
                                  <rect x="4" y="6" width="16" height="10" rx="2" />
                                  <rect x="6" y="9" width="3" height="4" fill="currentColor" />
                                  <rect x="11" y="9" width="3" height="4" fill="currentColor" />
                                  <rect x="15" y="9" width="3" height="4" fill="currentColor" />
                                  <circle cx="8" cy="18" r="1.5" fill="currentColor" />
                                  <circle cx="16" cy="18" r="1.5" fill="currentColor" />
                                </svg>
                              </div>
                              {/* Status Badge */}
                              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                bus.status === "On Time" ? "bg-green-500" :
                                bus.status === "Delayed" ? "bg-red-500" :
                                "bg-yellow-500"
                              }`} />
                            </div>
                            
                            {/* Bus Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-800 truncate">
                                {bus.id}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 truncate">
                                {bus.route}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  bus.status === "On Time" ? "bg-green-100 text-green-700" :
                                  bus.status === "Delayed" ? "bg-red-100 text-red-700" :
                                  "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {bus.status}
                                </span>
                                <span className={`text-lg font-bold ${
                                  bus.status === "On Time" ? "text-green-600" :
                                  bus.status === "Delayed" ? "text-red-600" :
                                  "text-yellow-600"
                                }`}>
                                  {bus.eta}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Crowd:</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  bus.crowdLevel === "Low" ? "bg-green-100 text-green-700" :
                                  bus.crowdLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {bus.crowdLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'Routes':
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Bus Routes & Live Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatedBuses />
                <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200 relative" style={{ zIndex: selectedBus ? 1 : 'auto' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: '100%', width: '100%', zIndex: selectedBus ? 1 : 'auto' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Bus Markers */}
                    {dummyBuses.map((bus) => {
                      // Create custom bus icon
                      const busIcon = L.divIcon({
                        className: 'custom-bus-marker',
                        html: `
                          <div style="
                            background: ${bus.status === "On Time" ? "#10b981" : bus.status === "Delayed" ? "#ef4444" : "#eab308"};
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: white;
                            font-size: 12px;
                          ">
                            ${bus.id.replace('BUS', '')}
                          </div>
                        `,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                      })
                      
                      return (
                        <Marker key={bus.id} position={bus.location} icon={busIcon}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-sm mb-1">{bus.id}</h3>
                              <p className="text-xs text-gray-600 mb-1">{bus.route}</p>
                              <p className="text-xs">
                                <span className="font-semibold">Status:</span> {bus.status}
                              </p>
                              <p className="text-xs">
                                <span className="font-semibold">ETA (AI):</span> {bus.eta}
                              </p>
                              <p className="text-xs">
                                <span className="font-semibold">Crowd:</span> {bus.crowdLevel}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    })}
                  </MapContainer>
                </div>
                
                {/* Bus List Below Map */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dummyBuses.map((bus) => (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 transition-colors cursor-pointer"
                      onClick={() => handleBusSelect(bus)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{bus.id}</p>
                          <p className="text-xs text-gray-500 mt-1">{bus.route}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-semibold ${
                            bus.status === "On Time" ? "text-green-600" :
                            bus.status === "Delayed" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {bus.status}
                          </p>
                          <p className={`text-sm font-bold mt-1 ${
                            bus.status === "On Time" ? "text-green-600" :
                            bus.status === "Delayed" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>{bus.eta}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block ${
                            bus.crowdLevel === "Low" ? "bg-green-100 text-green-700" :
                            bus.crowdLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>{bus.crowdLevel}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'Notifications':
        return (
          <div className="max-w-7xl mx-auto">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Smart Notifications
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Get alerts when the bus is near or a less crowded option is available
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">🚌</span>
                      <div>
                        <p className="font-semibold text-green-800">Bus Approaching</p>
                        <p className="text-sm text-green-700 mt-1">BUS330 is 2 min away from your stop • Vasco → PCCE</p>
                        <p className="text-xs text-gray-500 mt-2">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">💡</span>
                      <div>
                        <p className="font-semibold text-blue-800">Less Crowded Option</p>
                        <p className="text-sm text-blue-700 mt-1">BUS204 has Low crowd level • Arriving in 15 min</p>
                        <p className="text-xs text-gray-500 mt-2">5 min ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">⏰</span>
                      <div>
                        <p className="font-semibold text-gray-800">Schedule Update</p>
                        <p className="text-sm text-gray-600 mt-1">BUS101 running 5 min late due to traffic</p>
                        <p className="text-xs text-gray-500 mt-2">12 min ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'Home':
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Map Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Live Bus Tracking (GPS)
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">Real-time bus locations on map</p>
              </CardHeader>
              <CardContent>
                <AnimatedBuses />
                <div className="h-[350px] w-full rounded-lg overflow-hidden border border-gray-200 relative" style={{ zIndex: selectedBus ? 1 : 'auto' }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: '100%', width: '100%', zIndex: selectedBus ? 1 : 'auto' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapCenter}>
                      <Popup>
                        Trust Bus Location
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bus Table Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Bus Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Bus ID</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead className="text-center">ETA (AI)</TableHead>
                      <TableHead className="text-center">Crowd</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyBuses.map((bus, index) => {
                      const MotionTableRow = motion(TableRow)
                      return (
                        <MotionTableRow
                          key={bus.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1 
                          }}
                          className="cursor-pointer hover:bg-green-50 transition-colors"
                          onClick={() => handleBusSelect(bus)}
                        >
                          <TableCell className="font-medium">{bus.id}</TableCell>
                          <TableCell>{bus.route}</TableCell>
                          <TableCell className={`text-center font-medium ${
                            bus.status === "On Time" ? "text-green-600" :
                            bus.status === "Delayed" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {bus.eta}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              bus.crowdLevel === "Low" ? "bg-green-100 text-green-700" :
                              bus.crowdLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {bus.crowdLevel}
                            </span>
                          </TableCell>
                          <TableCell className={`text-right ${getStatusColor(bus.status)}`}>
                            {bus.status}
                          </TableCell>
                        </MotionTableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Bus Inspection Modal - shown first as key feature */}
      {selectedBus && !showRating && (
        <BusInspection 
          bus={selectedBus} 
          onClose={handleCloseInspection}
          onShowRating={handleShowRating}
        />
      )}

      {/* Bus Rating Modal - accessible from inspection */}
      {selectedBus && showRating && (
        <BusRating 
          bus={selectedBus} 
          onClose={handleCloseRating}
        />
      )}
    </div>
  )
}

export default Dashboard

>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
