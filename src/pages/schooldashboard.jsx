import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const formatDuration = (ms) => {
  if (!ms || ms < 0) return "00:00:00"
  const totalSeconds = Math.floor(ms / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return `${hours}:${minutes}:${seconds}`
}

const SchoolDashboard = () => {
  const [activePage, setActivePage] = useState("Trip Control")
  const [tripStatus, setTripStatus] = useState("idle") // idle | running | ended
  const [tripStart, setTripStart] = useState(null)
  const [tripEnd, setTripEnd] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [tripHistory, setTripHistory] = useState([])

  // Safely read school/driver info from localStorage
  let storedUser = null
  try {
    storedUser = JSON.parse(localStorage.getItem("user"))
  } catch {
    storedUser = null
  }

  const driverInfo = useMemo(() => {
    return {
      schoolName: storedUser?.name || "School",
      schoolID: storedUser?.schoolID || "—",
      busNumber: storedUser?.bus || "—",
      driverName: storedUser?.driverName || "Assigned Driver",
      driverNumber: storedUser?.driverNumber || "—",
    }
  }, [storedUser])

  // Live timer while trip is running
  useEffect(() => {
    if (tripStatus !== "running" || !tripStart) return

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - tripStart)
    }, 1000)

    return () => clearInterval(interval)
  }, [tripStatus, tripStart])

  const handleStartTrip = () => {
    const now = Date.now()
    setTripStatus("running")
    setTripStart(now)
    setTripEnd(null)
    setElapsedMs(0)
  }

  const handleEndTrip = () => {
    if (tripStatus !== "running" || !tripStart) return
    const now = Date.now()
    const duration = now - tripStart

    setTripStatus("ended")
    setTripEnd(now)
    setElapsedMs(duration)

    setTripHistory((prev) => [
      {
        id: prev.length + 1,
        start: new Date(tripStart).toLocaleTimeString(),
        end: new Date(now).toLocaleTimeString(),
        durationMs: duration,
      },
      ...prev.slice(0, 9),
    ])
  }

  const currentDurationLabel =
    tripStatus === "idle" ? "—" : formatDuration(elapsedMs)

  const statusLabel =
    tripStatus === "running"
      ? "Trip in progress"
      : tripStatus === "ended"
      ? "Last trip finished"
      : "Awaiting next trip"

  const statusColor =
    tripStatus === "running"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : tripStatus === "ended"
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : "bg-slate-100 text-slate-700 border-slate-300"

  const renderContent = () => {
    if (activePage === "Trip Control") {
      return (
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-l-4 border-l-emerald-600 shadow-sm">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🚌</span>
                    <span>Driver Trip Console</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                    {statusLabel}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-500">
                    Driver
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {driverInfo.driverName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Phone: {driverInfo.driverNumber}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    School / ID
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {driverInfo.schoolName}
                  </p>
                  <p className="text-xs text-slate-500">
                    ID: {driverInfo.schoolID}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    Bus Assigned
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {driverInfo.busNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Trip Timer</span>
                  <span className="text-xs text-slate-500">
                    Click "Start trip" when bus leaves, "End trip" on arrival.
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                  <p className="text-sm text-slate-500">Current Duration</p>
                  <p className="text-4xl md:text-5xl font-mono font-bold text-emerald-600">
                    {currentDurationLabel}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Updates every second while trip is running.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 w-full md:w-60">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={tripStatus === "running"}
                    onClick={handleStartTrip}
                  >
                    {tripStatus === "running" ? "Trip in progress" : "Start trip"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-400 text-red-600 hover:bg-red-50"
                    disabled={tripStatus !== "running"}
                    onClick={handleEndTrip}
                  >
                    End trip
                  </Button>
                  {tripStatus === "ended" && (
                    <p className="text-xs text-slate-500 text-center">
                      Last trip completed in{" "}
                      <span className="font-semibold">
                        {formatDuration(elapsedMs)}
                      </span>
                      .
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {tripHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Trips (local session)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>End</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tripHistory.map((trip) => (
                          <TableRow key={trip.id}>
                            <TableCell>{trip.id}</TableCell>
                            <TableCell>{trip.start}</TableCell>
                            <TableCell>{trip.end}</TableCell>
                            <TableCell>
                              {formatDuration(trip.durationMs)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    // Simple placeholder for any future pages
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Additional school analytics and safety insights will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        userType="school"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default SchoolDashboard