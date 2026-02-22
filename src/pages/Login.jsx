import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
// Added loginSchool to your imports
import { forgotPassword, loginSchool, loginUser, resetPassword } from "../api/auth"
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
  
  const [showForgot, setShowForgot] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(useSpring(y), [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(useSpring(x), [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2))
    y.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // UPDATED LOGIN LOGIC
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    if (!email || !password) return setError("Fill all fields")
    if (!isValidEmail(email)) return setError("Invalid email")

    try {
      setLoading(true)
      
      // 1. Attempt Standard User Login
      try {
        const res = await loginUser({ email, password })
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.user))
        
        // Redirect based on role
        if (res.data.user.role === "parent") {
          navigate("/parent-dashboard")
        } else {
          navigate("/dashboard")
        }
      } catch (userErr) {
        // 2. If standard login fails, try School Login
        try {
          const schoolRes = await loginSchool({ email, password })
          localStorage.setItem("token", schoolRes.data.token)
          // Store school data with a 'school' role for ProtectedRoute
          localStorage.setItem("user", JSON.stringify({ ...schoolRes.data.school, role: 'school' }))
          navigate("/school-dashboard")
        } catch (schoolErr) {
          // If both fail, then show the error
          setError("Invalid email or password")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async () => {
    setError("")
    if (!email || !email.trim()) {
      setError("Please enter your email")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email")
      return
    }
    try {
      setLoading(true)
      await forgotPassword({ email: email.trim() })
      setResetStep(2)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setError("")
    if (!email || !email.trim()) {
      setError("Email is required")
      return
    }
    try {
      setLoading(true)
      await resetPassword({ email: email.trim(), otp, newPassword })
      setError("")
      setShowForgot(false)
      setResetStep(1)
      setOtp("")
      setNewPassword("")
      alert("Password changed successfully 🎉")
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForgot = () => {
    setError("")
    setShowForgot(true)
  }

  const handleCloseForgot = () => {
    setError("")
    setShowForgot(false)
    setResetStep(1)
    setOtp("")
    setNewPassword("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-emerald-600 font-bold">
              TrustBus Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="text-red-500 text-center bg-red-50 p-2 rounded-lg">{error}</div>}

              <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" />

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 rounded-xl text-lg" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="flex flex-col gap-3 pt-2">
                <p onClick={handleOpenForgot} className="text-center text-sm text-emerald-600 cursor-pointer hover:underline">
                  Forgot password?
                </p>

                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <span onClick={() => navigate("/signup")} className="text-emerald-600 font-bold cursor-pointer hover:underline">
                    Sign up
                  </span>
                </p>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest font-medium">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <p className="text-center text-sm">
                  Registering a school?{" "}
                  <span onClick={() => navigate("/school-signup")} className="text-emerald-600 font-bold cursor-pointer hover:underline">
                    School Portal
                  </span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {showForgot && (
        <ForgotPasswordModal
          step={resetStep}
          setStep={setResetStep}
          onClose={handleCloseForgot}
          email={email}
          setEmail={setEmail}
          otp={otp}
          setOtp={setOtp}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          handleSendOTP={handleSendOTP}
          handleResetPassword={handleResetPassword}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}

// Forgot Password Modal - works for both users and schools
const ForgotPasswordModal = ({
  step,
  setStep,
  onClose,
  email,
  setEmail,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  handleSendOTP,
  handleResetPassword,
  loading,
  error,
}) => {
  const validatePassword = (pass) => ({
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    lower: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[@$!%*?&]/.test(pass),
  })
  const checks = validatePassword(newPassword)
  const isPasswordValid = Object.values(checks).every(Boolean)

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-emerald-600 text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-slate-600 text-center mb-4">
          Works for both parents and school accounts
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendOTP()
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 rounded-xl"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleResetPassword()
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Enter OTP from email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="rounded-xl"
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl"
            />
            <div className="grid grid-cols-2 gap-1 text-[10px] p-2 bg-slate-50 rounded-lg">
              <p className={checks.length ? "text-green-600" : "text-slate-400"}>● 8+ chars</p>
              <p className={checks.upper ? "text-green-600" : "text-slate-400"}>● Uppercase</p>
              <p className={checks.lower ? "text-green-600" : "text-slate-400"}>● Lowercase</p>
              <p className={checks.number ? "text-green-600" : "text-slate-400"}>● Number</p>
              <p className={checks.special ? "text-green-600" : "text-slate-400"}>● Symbol</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 rounded-xl"
              disabled={loading || !isPasswordValid}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <p
          onClick={onClose}
          className="text-center mt-4 text-sm text-emerald-600 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  )
}

export default Login