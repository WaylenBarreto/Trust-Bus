<<<<<<< HEAD
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { loginUser } from "../api/auth"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

const Login = () => {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 3D tilt: track mouse position
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const progressX = (e.clientX - centerX) / (rect.width / 2)
    const progressY = (e.clientY - centerY) / (rect.height / 2)
    x.set(progressX)
    y.set(progressY)
  }
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      return setError("Please fill all fields")
    }

    if (!isValidEmail(email)) {
      return setError("Enter a valid email address")
    }

    try {
      setLoading(true)

      const res = await loginUser({ email, password })
      const data = res.data

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      if (data.user.role === "parent") {
        navigate("/parent-dashboard")
      } else {
        navigate("/dashboard")
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950">
      {/* Animated 3D background shapes */}
      <motion.div
        animate={{
          rotateY: [0, 15, 0],
          rotateX: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"
        style={{ perspective: 1000 }}
      />
      <motion.div
        animate={{
          rotateY: [0, -20, 0],
          rotateX: [0, 15, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"
        style={{ perspective: 1000 }}
      />
      <motion.div
        animate={{
          rotateZ: [0, 360],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-500/5"
        style={{ perspective: 1000 }}
      />

      {/* Floating bus icon */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotateY: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-1/2 -translate-x-1/2 text-5xl opacity-20"
        style={{ perspective: 500 }}
      >
        🚌
      </motion.div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card
          className="relative overflow-hidden border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.5)",
          }}
        >
          {/* Gradient accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
            style={{ transform: "translateZ(20px)" }}
          />

          <CardHeader className="pb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle
                className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                style={{ transform: "translateZ(30px)" }}
              >
                TrustBus Login
              </CardTitle>
              <p className="text-center text-sm text-gray-500 mt-2">
                Sign in to track your journey
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center py-3 px-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ transform: "translateZ(20px)" }}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ transform: "translateZ(20px)" }}
              >
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ transform: "translateZ(30px)" }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-sm text-gray-600"
              >
                Don't have an account?{" "}
                <motion.span
                  onClick={() => navigate("/signup")}
                  className="text-emerald-600 font-semibold cursor-pointer"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign up
                </motion.span>
              </motion.p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
=======
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

  // ⭐ Email validator
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    // ⭐ VALIDATIONS
    if (!email || !password) {
      return setError("Please fill all fields")
    }

    if (!isValidEmail(email)) {
      return setError("Enter a valid email address")
    }

    try {
      setLoading(true)

      const res = await loginUser({ email, password })
      const data = res.data

      // SAVE TOKEN + USER
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect based on role
      if (data.user.role === "parent") {
        navigate("/parent-dashboard")
      } else {
        navigate("/dashboard")
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password")
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

            {/* ⭐ Error message */}
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
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
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
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
