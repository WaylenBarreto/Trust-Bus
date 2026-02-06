import { useNavigate } from 'react-router-dom'

const TopBar = () => {
  const userName = 'John Doe' // This would typically come from auth context/state
  const navigate = useNavigate()

  const handleLogout = () => {
    // Navigate to login page
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium hidden sm:block">
              {userName}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              flex items-center space-x-2
              px-4 py-2
              text-gray-700 hover:text-red-600
              rounded-lg hover:bg-red-50
              transition-colors duration-200
              font-medium
            "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar

