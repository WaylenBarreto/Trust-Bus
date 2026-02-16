import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { forgotPassword, resetPassword } from "../api/auth"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1=email , 2=otp+new pass
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
  setError("")
  setMessage("")

  try {
    setLoading(true)
    const res = await resetPassword({ email, otp, newPassword })

    if (res.message === "Password reset successful 🎉") {
      setMessage(res.message)

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } else {
      setError(res.message)
    }

  } catch (err) {
    setError("Server error")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-emerald-600">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-600 text-center">{message}</p>}

          {/* STEP 1 — EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="w-full" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* STEP 2 — OTP + NEW PASSWORD */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <p
            onClick={() => navigate("/")}
            className="text-center mt-4 text-sm text-emerald-600 cursor-pointer"
          >
            Back to Login
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword