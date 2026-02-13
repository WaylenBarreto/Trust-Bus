<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Loading from './components/Loading'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ParentDashboard from './pages/ParentDashboard'
import Signup from './pages/Signup'

// 🔒 Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  if (!token) return <Navigate to="/login" />

  // Role protection
  if (role && user?.role !== role) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <Loading />

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public User Dashboard */}
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

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
=======
import { useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Loading from './components/Loading'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ParentDashboard from './pages/ParentDashboard'
import Signup from './pages/Signup'

// 🔒 Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  if (!token) return <Navigate to="/login" />

  // Role protection
  if (role && user?.role !== role) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <Loading />

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public User Dashboard */}
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

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
