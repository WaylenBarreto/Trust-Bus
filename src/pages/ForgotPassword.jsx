import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { forgotPassword, resetPassword } from "../api/auth"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1) 
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // --- PASSWORD VALIDATION LOGIC ---
  const validatePassword = (pass) => {
    return {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[@$!%*?&]/.test(pass),
    }
  }

  const checks = validatePassword(newPassword)
  const isPasswordValid = Object.values(checks).every(Boolean)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    try {
      setLoading(true)
      const res = await forgotPassword(email)
      if (res.message === "Password reset OTP sent to email") {
        setMessage(res.message)
        setStep(2)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    // Frontend Guard
    if (!isPasswordValid) {
      setError("Password does not meet requirements")
      return
    }

    setError("")
    setMessage("")

    try {
      setLoading(true)
      const res = await resetPassword({ email, otp, newPassword })
      if (res.message === "Password reset successful 🎉") {
        setMessage(res.message)
        setTimeout(() => navigate("/login"), 2000)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-emerald-600 font-bold">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center mb-2">{message}</p>}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                placeholder="Enter your email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                
                {/* Visual Validation Helper */}
                <div className="grid grid-cols-2 gap-1 text-[10px] mt-2 p-2 bg-slate-50 rounded-lg">
                  <p className={checks.length ? "text-green-600" : "text-slate-400"}>● 8+ Characters</p>
                  <p className={checks.upper ? "text-green-600" : "text-slate-400"}>● Uppercase Letter</p>
                  <p className={checks.lower ? "text-green-600" : "text-slate-400"}>● Lowercase Letter</p>
                  <p className={checks.number ? "text-green-600" : "text-slate-400"}>● Number</p>
                  <p className={checks.special ? "text-green-600" : "text-slate-400"}>● Special Symbol</p>
                </div>
              </div>

              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700" 
                disabled={loading || !isPasswordValid}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <p
            onClick={() => navigate("/login")}
            className="text-center mt-6 text-sm text-emerald-600 cursor-pointer font-medium hover:underline"
          >
            Back to Login
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword