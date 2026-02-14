import { AnimatePresence, motion } from "framer-motion"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser, resendOTP, verifyEmailOTP } from "../api/auth"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

const Signup = () => {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [role, setRole] = useState("public")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [childName, setChildName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (!isValidEmail(email)) return setError("Enter valid email")

    try {
      setLoading(true)
      await registerUser({ role, name, email, phone, childName, studentId, password })
      setShowOTP(true)
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await verifyEmailOTP({ email, otp })
      navigate("/login")
    } catch (err) {
      setError("OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try { await resendOTP({ email }) } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
      <motion.div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-emerald-600">
              {showOTP ? "Verify Email" : "Create Account"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.form key="signup" onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={()=>setRole('public')}
                      className={`p-3 rounded-lg border ${role==='public'?'bg-emerald-50 border-emerald-500':''}`}>
                      🚌 Public
                    </button>
                    <button type="button" onClick={()=>setRole('parent')}
                      className={`p-3 rounded-lg border ${role==='parent'?'bg-emerald-50 border-emerald-500':''}`}>
                      🎒 Parent
                    </button>
                  </div>

                  <Input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
                  <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                  <Input placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} required />

                  {role === "parent" && (
                    <>
                      <Input placeholder="Child Name" value={childName} onChange={e=>setChildName(e.target.value)} required />
                      <Input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} required />
                    </>
                  )}

                  <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />

                  <Button className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm">
                    Already have account?{" "}
                    <span onClick={()=>navigate("/login")} className="text-emerald-600 cursor-pointer">Login</span>
                  </p>
                </motion.form>
              ) : (
                <motion.form key="otp" onSubmit={handleVerifyOTP} className="space-y-4">
                  <Input placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} required />
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>
                  <p onClick={handleResendOTP} className="text-center text-emerald-600 cursor-pointer">
                    Resend OTP
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Signup
