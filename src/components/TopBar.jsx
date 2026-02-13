<<<<<<< HEAD
import { useNavigate } from 'react-router-dom'

const TopBar = () => {
  const navigate = useNavigate()

  // ⭐ GET USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user"))
  const userName = user?.name || "User"

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium hidden sm:block">
              {userName}
            </span>
          </div>

          <button onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-red-600">
            Logout
          </button>

        </div>
      </div>
    </header>
  )
}

export default TopBar
=======
import { useNavigate } from 'react-router-dom'

const TopBar = () => {
  const navigate = useNavigate()

  // ⭐ GET USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user"))
  const userName = user?.name || "User"

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium hidden sm:block">
              {userName}
            </span>
          </div>

          <button onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-red-600">
            Logout
          </button>

        </div>
      </div>
    </header>
  )
}

export default TopBar
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
