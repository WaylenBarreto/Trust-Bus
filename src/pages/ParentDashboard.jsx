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


// Demo bus location
const busLocation = [15.2993, 74.1240] 

const ParentDashboard = () => {
  const [activePage, setActivePage] = useState('Home')

  const renderContent = () => {
    switch (activePage) {
      case 'Alerts':
        return (
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
        )

      case 'Live Track':
        return (
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
        )

      case 'Driver Performance':
        return (
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
        )

      case 'Safety Reports':
        return (
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
        )

      case 'Home':
      default:
        return (
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
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} userType="parent" />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />

          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard
