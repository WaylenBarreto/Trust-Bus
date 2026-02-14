import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import BusInspection from '../components/BusInspection'
import BusRating from '../components/BusRating'
import Chatbot from "../components/Chatbot"
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Red marker for user location (Verna)
const redMarkerIcon = L.divIcon({
  html: '<div style="background-color:#dc2626; width:26px; height:26px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>',
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
})

const dummyBuses = [
  { id:"BUS101", route:"Vasco → PCCE → Panjim", name:"Vasco Express", status:"On Time", eta:"5 min", location:[15.3893,73.8149], crowdLevel:"High", feeStudentHalf: 25, image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=220&fit=crop" },
  { id:"BUS204", route:"Margao → PCCE", name:"Margao Line", status:"Delayed", eta:"15 min", location:[15.2993,73.9570], crowdLevel:"Low", feeStudentHalf: 30, image:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=220&fit=crop" },
  { id:"BUS330", route:"Verna → PCCE", name:"Verna Shuttle", status:"Arriving Soon", eta:"2 min", location:[15.3500,73.9000], crowdLevel:"Medium", feeStudentHalf: 20, image:"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=220&fit=crop" }
]

const getStatusStyle = (status) => {
  switch (status) {
    case "On Time":   return { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-700", badge: "bg-amber-500" }
    case "Arriving Soon": return { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-700", badge: "bg-emerald-500" }
    case "Delayed":   return { bg: "bg-red-100", border: "border-red-400", text: "text-red-700", badge: "bg-red-500" }
    default:          return { bg: "bg-gray-100", border: "border-gray-400", text: "text-gray-700", badge: "bg-gray-500" }
  }
}

const getCrowdStyle = (level) => {
  switch (level) {
    case "High":   return "bg-red-100 text-red-700"
    case "Low":    return "bg-emerald-100 text-emerald-700"
    case "Medium": return "bg-amber-100 text-amber-700"
    default:       return "bg-gray-100 text-gray-700"
  }
}

/** Small green bus icon: green body, white windows, blue wheels (facing right) */
const BusIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="2" y="6" width="44" height="14" rx="2" fill="#16a34a" />
    <rect x="6" y="9" width="6" height="5" rx="0.5" fill="white" />
    <rect x="14" y="9" width="6" height="5" rx="0.5" fill="white" />
    <rect x="22" y="9" width="6" height="5" rx="0.5" fill="white" />
    <rect x="30" y="9" width="6" height="5" rx="0.5" fill="white" />
    <circle cx="14" cy="22" r="3" fill="#2563eb" />
    <circle cx="34" cy="22" r="3" fill="#2563eb" />
  </svg>
)

const Dashboard = () => {
  const [activePage, setActivePage] = useState('Home')
  const [selectedBus, setSelectedBus] = useState(null)
  const [showRating, setShowRating] = useState(false)

  const mapCenter = [15.2993, 74.1240]
  const userLocationVerna = [15.358, 73.892] // User location: Verna (inland, South Goa)

  const renderContent = () => {
    switch (activePage) {

      case 'Bus Status':
        return (
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader><CardTitle>Bus Status</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                {dummyBuses.map((bus, i) => {
                  const style = getStatusStyle(bus.status)
                  return (
                    <motion.div
                      key={bus.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.99 }}
                      className={`rounded-xl overflow-hidden border-2 ${style.border} bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                      onClick={() => setSelectedBus(bus)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedBus(bus)}
                    >
                      <div className="relative aspect-video bg-gray-200 overflow-hidden">
                        <img src={bus.image} alt={bus.id} className="w-full h-full object-cover" />
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-white text-xs font-bold shadow ${style.badge}`}>
                          {bus.id}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Route</p>
                        <p className="font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                          <span className="text-lg">🗺️</span>
                          {bus.route}
                        </p>
                        <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${style.bg}`}>
                          <span className={`font-semibold ${style.text}`}>{bus.status}</span>
                          <span className={`font-bold ${style.text}`}>{bus.eta}</span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 text-center">Tap to view details</p>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )

      case 'Routes':
        return (
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader><CardTitle>Live Bus Routes</CardTitle></CardHeader>
              <CardContent className="h-[600px]">
                <MapContainer center={mapCenter} zoom={11} style={{height:"100%"}}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  {dummyBuses.map(bus=>(
                    <Marker key={bus.id} position={bus.location}>
                      <Popup>{bus.id}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>
          </div>
        )

      case 'Notifications':
        return (
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader><CardTitle>Alerts & Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-green-100 rounded-lg border border-green-200">✔ BUS101 – On time, arriving in 5 min</div>
                <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">⏰ BUS204 – Delayed by ~15 min on Margao → PCCE</div>
                <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">📍 Route update: Verna → PCCE service running as scheduled</div>
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">ℹ No disruptions on Vasco → Panjim corridor</div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Live Bus Tracking (GPS) - same layout as reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Live Bus Tracking (GPS)</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Real-time bus locations on map</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Two small green buses moving left to right, full cycle every 20 seconds */}
                <div className="relative h-14 overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    initial={{ x: '-100px' }}
                    animate={{ x: 'calc(100% + 100px)' }}
                    transition={{ duration: 20, repeat: Infinity, repeatDelay: 0 }}
                  >
                    <BusIcon className="w-14 h-7 text-green-600" />
                  </motion.div>
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    initial={{ x: '-100px' }}
                    animate={{ x: 'calc(100% + 100px)' }}
                    transition={{ duration: 20, repeat: Infinity, repeatDelay: 0, delay: 10 }}
                  >
                    <BusIcon className="w-14 h-7 text-green-600" />
                  </motion.div>
                </div>
                <div className="h-[350px] rounded-lg overflow-hidden border border-gray-200">
                  <MapContainer center={mapCenter} zoom={11} style={{ height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={userLocationVerna} icon={redMarkerIcon}>
                      <Popup><strong>Verna</strong><br />Your location</Popup>
                    </Marker>
                    {dummyBuses.map((bus) => (
                      <Marker key={bus.id} position={bus.location}>
                        <Popup><strong>{bus.id}</strong><br />{bus.route}<br />ETA: {bus.eta}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bus Status table with coloured ETA, Status, Crowd */}
            <Card>
              <CardHeader>
                <CardTitle>Bus Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bus ID</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>ETA (AI)</TableHead>
                      <TableHead>Crowd</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Fee (Student half) ₹</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyBuses.map((bus) => {
                      const style = getStatusStyle(bus.status)
                      return (
                        <TableRow
                          key={bus.id}
                          className="cursor-pointer hover:bg-green-50/50"
                          onClick={() => setSelectedBus(bus)}
                        >
                          <TableCell className="font-mono font-semibold">{bus.id}</TableCell>
                          <TableCell>{bus.route}</TableCell>
                          <TableCell>{bus.name}</TableCell>
                          <TableCell>
                            <span className={`font-semibold ${style.text}`}>{bus.eta}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getCrowdStyle(bus.crowdLevel)}`}>
                              {bus.crowdLevel}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${style.text}`}>{bus.status}</span>
                          </TableCell>
                          <TableCell className="text-right font-medium">₹{bus.feeStudentHalf}</TableCell>
                        </TableRow>
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
      <div className="flex h-screen">
        <Sidebar activePage={activePage} setActivePage={setActivePage}/>
        <div className="flex-1 flex flex-col">
          <TopBar/>
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      </div>

      {selectedBus && !showRating && (
        <BusInspection bus={selectedBus} onClose={()=>setSelectedBus(null)} onShowRating={()=>setShowRating(true)} />
      )}
      {selectedBus && showRating && (
        <BusRating bus={selectedBus} onClose={()=>setShowRating(false)} />
      )}

      <Chatbot/>
    </div>
  )
}

export default Dashboard
