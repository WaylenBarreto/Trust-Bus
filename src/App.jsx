import { useEffect, useState } from "react"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Loading from "./components/Loading"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import ParentDashboard from "./pages/ParentDashboard"
import SchoolSignup from "./pages/SchoolSignup"; // Import the new School Signup page
import Signup from "./pages/Signup"
// import SchoolDashboard from "./pages/SchoolDashboard" // Uncomment once you create this file

// 🔒 Protected Route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token")
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user"))
  } catch {}

  if (!token) return <Navigate to="/login" replace />

  // Role protection
  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <Loading />

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/school-signup" element={<SchoolSignup />} /> {/* New School Registration Route */}

        {/* Public Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="public">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Parent Dashboard */}
        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute role="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* School Dashboard (The Safety Module) */}
        <Route
          path="/school-dashboard"
          element={
            <ProtectedRoute role="school">
              {/* Replace with your SchoolDashboard component once created */}
              <div className="p-10 text-center">
                <h1 className="text-2xl font-bold">School Admin Dashboard</h1>
                <p>Safety monitoring and bus tracking will appear here.</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App