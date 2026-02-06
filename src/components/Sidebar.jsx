import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const Sidebar = ({ activePage, setActivePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Bus Status', label: 'Bus Status', icon: '🚌' },
    { id: 'Routes', label: 'Routes', icon: '🗺️' },
  ]

  const handleLogout = () => {
    // Navigate to login page
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          inset-y-0 left-0
          w-64 bg-white shadow-lg
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
          z-40
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-center">
          <Logo className="w-40 h-12" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id)
                setIsMobileMenuOpen(false)
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${
                  activePage === item.id
                    ? 'bg-green-50 text-green-600 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg
              text-gray-700 hover:bg-red-50 hover:text-red-600
              transition-colors duration-200
            "
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar

