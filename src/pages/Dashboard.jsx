import axios from 'axios'
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import bus204Img from '../assets/bus204.jpg'
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
  { id:"BUS204", route:"Margao → PCCE", name:"Margao Line", status:"Delayed", eta:"15 min", location:[15.2993,73.9570], crowdLevel:"Low", feeStudentHalf: 30, image:bus204Img },
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

// Derive crowd level based on passenger count
const getCrowdLevelFromPassengers = (count) => {
  if (typeof count !== 'number') return null
  if (count < 15) return "Low"
  if (count < 23) return "Medium"
  return "High"
}

const notificationStyles = {
  info: 'bg-blue-100 border-blue-200',
  success: 'bg-green-100 border-green-200',
  warning: 'bg-yellow-100 border-yellow-200',
  danger: 'bg-red-100 border-red-200',
}

// Haversine distance between two lat/lng pairs in kilometers
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371 // km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
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
  const [liveBusMap, setLiveBusMap] = useState({})
  const [bus330Path, setBus330Path] = useState([])
  const [notifications, setNotifications] = useState([])
  const [toastNotifications, setToastNotifications] = useState([])
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const [criticalAlert, setCriticalAlert] = useState(null)
  const prevBus330Ref = useRef(null)

  const mapCenter = [15.2993, 74.1240]
  const userLocationVerna = [15.358, 73.892] // User location: Verna (inland, South Goa)

  // Fetch live bus data (location + passenger count) on mount and then every 5 seconds
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

          const live330 = map['BUS330']
          if (
            live330 &&
            live330.location &&
            typeof live330.location.lat === 'number' &&
            typeof live330.location.lng === 'number'
          ) {
            const nextPoint = [live330.location.lat, live330.location.lng]
            setBus330Path((prev) => {
              const last = prev[prev.length - 1]
              if (last && last[0] === nextPoint[0] && last[1] === nextPoint[1]) {
                return prev
              }
              return [...prev, nextPoint]
            })
          }
        }
      } catch (err) {
        console.warn('Failed to load live bus data', err)
      }
    }

    fetchLiveBuses()
    const intervalId = setInterval(fetchLiveBuses, 5000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const getBusLocation = (bus) => {
    const live = liveBusMap[bus.id]
    if (live && live.location && typeof live.location.lat === 'number' && typeof live.location.lng === 'number') {
      return [live.location.lat, live.location.lng]
    }
    return bus.location
  }

  // Build an enhanced list of buses where BUS330 gets live values from backend
  const buses = useMemo(() => {
    const live330 = liveBusMap['BUS330']

    return dummyBuses.map((bus) => {
      if (bus.id !== 'BUS330' || !live330) return bus

      const hasLocation =
        live330.location &&
        typeof live330.location.lat === 'number' &&
        typeof live330.location.lng === 'number'

      const speed = typeof live330.speedKmph === 'number' ? live330.speedKmph : 0
      let etaLabel = bus.eta
      let status = bus.status

      if (hasLocation && speed > 0) {
        const distanceKm = haversineKm(
          live330.location.lat,
          live330.location.lng,
          userLocationVerna[0],
          userLocationVerna[1]
        )
        const etaMinutes = (distanceKm / speed) * 60
        if (Number.isFinite(etaMinutes) && etaMinutes > 0) {
          const rounded = Math.max(1, Math.round(etaMinutes))
          etaLabel = `${rounded} min`

          if (rounded <= 3) status = "Arriving Soon"
          else if (rounded <= 10) status = "On Time"
          else status = "Delayed"
        }
      }

      const passengerCount =
        typeof live330.passengerCount === 'number' ? live330.passengerCount : null
      const dynamicCrowdLevel =
        passengerCount !== null
          ? getCrowdLevelFromPassengers(passengerCount)
          : bus.crowdLevel

      const harshCount = typeof live330.harshbraking === 'number' ? live330.harshbraking : 0
      const rashCount = typeof live330.rashdriving === 'number' ? live330.rashdriving : 0

      return {
        ...bus,
        location: hasLocation
          ? [live330.location.lat, live330.location.lng]
          : bus.location,
        eta: etaLabel,
        status,
        passengerCount,
        crowdLevel: dynamicCrowdLevel,
        harshbraking: harshCount,
        rashdriving: rashCount,
        rashDrivingFlag: !!live330.rashDriving,
        harshDrivingFlag: !!(live330.harshDriving || live330.hardBrake),
      }
    })
  }, [liveBusMap, userLocationVerna])

  // Generate live notifications when BUS330 changes (crowd, status, ETA, harsh braking)
  useEffect(() => {
    const bus330 = buses.find((b) => b.id === 'BUS330')
    if (!bus330) return

    const prev = prevBus330Ref.current
    prevBus330Ref.current = bus330

    if (!prev) return

    const updates = []

    // Crowd / passenger change
    if (bus330.crowdLevel !== prev.crowdLevel && bus330.crowdLevel && prev.crowdLevel) {
      const direction =
        (bus330.passengerCount ?? 0) > (prev.passengerCount ?? 0) ? 'increased' : 'dropped'
      updates.push({
        id: `crowd-${Date.now()}`,
        type: bus330.crowdLevel === 'High' ? 'danger' : bus330.crowdLevel === 'Medium' ? 'warning' : 'info',
        text: `BUS330 crowd level ${direction} from ${prev.crowdLevel} to ${bus330.crowdLevel}${bus330.passengerCount != null ? ` (${bus330.passengerCount} passengers)` : ''}.`,
        time: new Date().toLocaleTimeString(),
      })
    }

    // Status change (On Time / Arriving Soon / Delayed)
    if (bus330.status !== prev.status) {
      const type =
        bus330.status === 'Delayed'
          ? 'warning'
          : bus330.status === 'Arriving Soon'
          ? 'success'
          : 'info'
      updates.push({
        id: `status-${Date.now()}`,
        type,
        text: `BUS330 status updated to "${bus330.status}" (ETA ${bus330.eta}).`,
        time: new Date().toLocaleTimeString(),
      })
    }

    // ETA change
    if (bus330.eta !== prev.eta) {
      updates.push({
        id: `eta-${Date.now()}`,
        type: 'info',
        text: `BUS330 ETA adjusted from ${prev.eta} to ${bus330.eta} based on live GPS.`,
        time: new Date().toLocaleTimeString(),
      })
    }

    // Harsh braking / rash driving incidents based on database counts
    const prevHarshTotal = (prev.harshbraking ?? 0) + (prev.rashdriving ?? 0)
    const currentHarshTotal = (bus330.harshbraking ?? 0) + (bus330.rashdriving ?? 0)
    if (currentHarshTotal > prevHarshTotal) {
      const newIncidents = currentHarshTotal - prevHarshTotal
      const message = `New driving incident${
        newIncidents > 1 ? 's' : ''
      } detected on BUS330: harsh braking / rash driving (${currentHarshTotal} total).`

      updates.push({
        id: `harsh-${Date.now()}`,
        type: 'danger',
        text: message,
        time: new Date().toLocaleTimeString(),
      })

      setCriticalAlert({
        title: 'Driving Behaviour Alert',
        message,
      })
    }

    // Immediate rash driving alert based on live flag (boolean)
    const prevRashFlag = !!prev.rashDrivingFlag
    const currentRashFlag = !!bus330.rashDrivingFlag
    if (currentRashFlag && !prevRashFlag) {
      const message = 'Rash driving detected on BUS330. Please review driver behaviour.'
      updates.push({
        id: `rash-${Date.now()}`,
        type: 'danger',
        text: message,
        time: new Date().toLocaleTimeString(),
      })

      setCriticalAlert({
        title: 'Rash Driving Alert',
        message,
      })
    }

    if (updates.length) {
      setNotifications((current) => [...updates, ...current].slice(0, 20))
      setHasUnreadNotifications(true)

      // Push toast notifications (auto-dismiss after 5s)
      updates.forEach((u) => {
        const toastId = `${u.id}-toast`
        const toast = { ...u, id: toastId }
        setToastNotifications((cur) => [...cur, toast])
        setTimeout(() => {
          setToastNotifications((cur) => cur.filter((t) => t.id !== toastId))
        }, 5000)
      })
    }
  }, [buses])

  // Clear red dot when user opens Notifications tab
  useEffect(() => {
    if (activePage === 'Notifications') {
      setHasUnreadNotifications(false)
    }
  }, [activePage])

  const renderContent = () => {
    switch (activePage) {

      case 'Bus Status':
        return (
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader><CardTitle>Bus Status</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                {buses.map((bus, i) => {
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
                  {bus330Path.length > 1 && (
                    <Polyline
                      positions={bus330Path}
                      pathOptions={{ color: 'blue', weight: 4 }}
                    />
                  )}
                  {buses.map(bus=>(
                    <Marker key={bus.id} position={getBusLocation(bus)}>
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
                {notifications.length === 0 ? (
                  <>
                    <div className="p-4 bg-green-100 rounded-lg border border-green-200">✔ BUS101 – On time, arriving in 5 min</div>
                    <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">⏰ BUS204 – Delayed by ~15 min on Margao → PCCE</div>
                    <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">📍 Route update: Verna → PCCE service running as scheduled</div>
                    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">ℹ No disruptions on Vasco → Panjim corridor</div>
                  </>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-lg border flex items-center justify-between ${notificationStyles[n.type] || notificationStyles.info}`}
                    >
                      <span>{n.text}</span>
                      <span className="ml-4 text-xs text-gray-500 whitespace-nowrap">{n.time}</span>
                    </div>
                  ))
                )}
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
                    {bus330Path.length > 1 && (
                      <Polyline
                        positions={bus330Path}
                        pathOptions={{ color: 'blue', weight: 4 }}
                      />
                    )}
                    {buses.map((bus) => (
                      <Marker key={bus.id} position={getBusLocation(bus)}>
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
                      <TableHead>Passengers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Fee (Student half) ₹</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buses.map((bus) => {
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
                            {bus.passengerCount != null ? bus.passengerCount : '—'}
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
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          menuBadges={{ Notifications: hasUnreadNotifications }}
        />
        <div className="flex-1 flex flex-col">
          <TopBar/>
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      </div>

      {/* Top-right live toasts for BUS330 */}
      {toastNotifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
          {toastNotifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`rounded-xl border px-4 py-3 shadow-lg flex items-start gap-3 bg-white/95 ${notificationStyles[n.type] || ''}`}
            >
              <span className="mt-0.5 text-lg">
                {n.type === 'danger' ? '🚨' : n.type === 'warning' ? '⚠️' : '🔔'}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{n.text}</p>
                <p className="text-[11px] text-slate-500 mt-1">{n.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Center screen popup for harsh braking / rash driving */}
      {criticalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4">
            <h2 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
              <span>🚨</span>
              {criticalAlert.title}
            </h2>
            <p className="text-sm text-gray-700 mb-4">{criticalAlert.message}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCriticalAlert(null)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

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