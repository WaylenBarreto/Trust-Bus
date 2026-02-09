import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/auth"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await loginUser({ email, password })
      const data = res.data

      // SAVE TOKEN + USER
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      alert("Login successful 🎉")

      // Redirect based on role
      if (data.user.role === "parent") {
        navigate("/parent-dashboard")
      } else {
        navigate("/dashboard")
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-green-600">
            TrustBus Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={()=>navigate("/signup")}
                className="text-green-600 font-semibold cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
