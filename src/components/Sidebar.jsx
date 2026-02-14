import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./Logo"

const Sidebar = ({ activePage, setActivePage, userType = "public" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const publicMenuItems = [
    { id: "Home", label: "Home", icon: "🏠" },
    { id: "Bus Status", label: "Bus Status", icon: "🚌" },
    { id: "Routes", label: "Routes", icon: "🗺️" },
    { id: "Notifications", label: "Notifications", icon: "🔔" },
  ]

  const parentMenuItems = [
    { id: "Home", label: "Home", icon: "🏠" },
    { id: "Alerts", label: "Alerts", icon: "🚨" },
    { id: "Live Track", label: "Live Track", icon: "📍" },
    { id: "Driver Performance", label: "Driver Performance", icon: "📊" },
    { id: "Safety Reports", label: "Safety Reports", icon: "📋" },
  ]

  const menuItems = userType === "parent" ? parentMenuItems : publicMenuItems

  const handleLogout = () => navigate("/login")

  const handleNavClick = (page) => {
    setActivePage(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transform
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        transition-transform duration-300 z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b flex justify-center">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  activePage === item.id
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
