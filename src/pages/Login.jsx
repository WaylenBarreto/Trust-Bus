import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { forgotPassword, loginUser, resetPassword } from "../api/auth"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

const Login = () => {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  // ⭐ FORGOT PASSWORD STATES
const [showForgot,setShowForgot] = useState(false)
const [resetStep,setResetStep] = useState(1)
const [otp,setOtp] = useState("")
const [newPassword,setNewPassword] = useState("")


  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(useSpring(y), [-0.5,0.5],[8,-8])
  const rotateY = useTransform(useSpring(x), [-0.5,0.5],[-8,8])

  const handleMouseMove = (e)=>{
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width/2)/(rect.width/2))
    y.set((e.clientY - rect.top - rect.height/2)/(rect.height/2))
  }

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async e => {
    e.preventDefault()
    setError("")
    if(!email || !password) return setError("Fill all fields")
    if(!isValidEmail(email)) return setError("Invalid email")

    try {
      setLoading(true)
      const res = await loginUser({email,password})
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate(res.data.user.role==="parent"?"/parent-dashboard":"/dashboard")
    } catch(err){
      setError(err.response?.data?.message || "Login failed")
    } finally { setLoading(false) }
  }
////////////////////////////////////////////////////////
// FORGOT PASSWORD FUNCTIONS
////////////////////////////////////////////////////////

const handleSendOTP = async () => {
  try {
    setLoading(true)
    await forgotPassword({ email })
    setResetStep(2)
  } catch(err) {
    setError(err.response?.data?.message || "Failed to send OTP")
  } finally {
    setLoading(false)
  }
}

const handleResetPassword = async () => {
  try {
    setLoading(true)
    await resetPassword({ email, otp, newPassword })
    alert("Password changed successfully 🎉")
    setShowForgot(false)
    setResetStep(1)
    setOtp("")
    setNewPassword("")
  } catch(err) {
    setError(err.response?.data?.message || "Reset failed")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        style={{rotateX,rotateY,transformStyle:"preserve-3d"}}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-emerald-600">
              TrustBus Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="text-red-500 text-center">{error}</div>}

              <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

              <Button className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p
  onClick={()=>setShowForgot(true)}
  className="text-center text-sm text-emerald-600 cursor-pointer"
>
  Forgot password?
</p>


              <p className="text-center text-sm">
                Don't have an account?{" "}
                <span onClick={()=>navigate("/signup")} className="text-emerald-600 cursor-pointer">
                  Sign up
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
          {showForgot && (
        <ForgotPasswordModal
          step={resetStep}
          setStep={setResetStep}
          onClose={()=>setShowForgot(false)}
          email={email}
          setEmail={setEmail}
          otp={otp}
          setOtp={setOtp}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          handleSendOTP={handleSendOTP}
          handleResetPassword={handleResetPassword}
          loading={loading}
        />
      )}

    </div>
  )
}



export default Login
///////////////////////////////////////////////////////////////
// FORGOT PASSWORD MODAL
///////////////////////////////////////////////////////////////
const ForgotPasswordModal = ({
  step,
  onClose,
  email,
  setEmail,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  handleSendOTP,
  handleResetPassword,
  loading
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        
        <h2 className="text-xl font-bold mb-4 text-center text-emerald-600">
          Reset Password
        </h2>

        {step === 1 && (
          <>
            <Input
              placeholder="Enter your registered email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />

            <Button onClick={handleSendOTP} className="w-full mt-4" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={e=>setOtp(e.target.value)}
              className="mb-3"
            />

            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e=>setNewPassword(e.target.value)}
            />

            <Button onClick={handleResetPassword} className="w-full mt-4" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}

        <button onClick={onClose} className="mt-4 text-sm text-gray-500 w-full">
          Cancel
        </button>
      </div>
    </div>
  )
}
