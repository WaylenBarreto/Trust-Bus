import { useNavigate } from "react-router-dom"

const TopBar = () => {
  const navigate = useNavigate()

  // Safe localStorage parsing (prevents crash)
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user"))
  } catch {}

  const userName = user?.name || "User"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm text-gray-500">Welcome back</p>
              <p className="font-semibold text-gray-800">{userName}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  )
}

export default TopBar
