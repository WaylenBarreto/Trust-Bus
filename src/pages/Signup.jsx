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
  const [schoolID, setSchoolID] = useState("") // ⭐ NEW STATE FOR LINKING
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (pass) => ({
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    lower: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[@$!%*?&]/.test(pass),
  })
  const isStrongPassword = (pass) => Object.values(validatePassword(pass)).every(Boolean)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (!isValidEmail(email)) return setError("Enter valid email")
    if (!isStrongPassword(password)) return setError("Password must be 8+ characters with uppercase, lowercase, number and special symbol (@$!%*?&)")

    try {
      setLoading(true)
      // ⭐ UPDATED: Passing schoolID to the registration API
      await registerUser({ role, name, email, phone, childName, studentId, schoolID, password })
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Card className="shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-emerald-600 font-bold">
              {showOTP ? "Verify Email" : "Create Account"}
            </CardTitle>
            {!showOTP && <p className="text-center text-gray-500 text-sm">Join the TRUST-BUS network</p>}
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center mb-3 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.form 
                  key="signup" 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSignup} 
                  className="space-y-4"
                >
                  {/* Role Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={()=>setRole('public')}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${role==='public'?'bg-emerald-50 border-emerald-500 text-emerald-700':'border-gray-100 text-gray-500'}`}>
                      <span className="text-xl">🚌</span>
                      <span className="font-semibold text-xs uppercase tracking-wider">Public</span>
                    </button>
                    <button type="button" onClick={()=>setRole('parent')}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${role==='parent'?'bg-emerald-50 border-emerald-500 text-emerald-700':'border-gray-100 text-gray-500'}`}>
                      <span className="text-xl">🎒</span>
                      <span className="font-semibold text-xs uppercase tracking-wider">Parent</span>
                    </button>
                  </div>

                  {/* Standard Inputs */}
                  <Input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required className="rounded-xl" />
                  <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="rounded-xl" />
                  <Input placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} required className="rounded-xl" />

                  {/* Parent Specific Fields */}
                  {role === "parent" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 overflow-hidden">
                      {/* ⭐ NEW INPUT: SCHOOL ID */}
                      <Input 
                        placeholder="School ID (Obtain from school)" 
                        value={schoolID} 
                        onChange={e=>setSchoolID(e.target.value)} 
                        required 
                        className="rounded-xl border-emerald-200 focus:border-emerald-500" 
                      />
                      <Input placeholder="Child Name" value={childName} onChange={e=>setChildName(e.target.value)} required className="rounded-xl" />
                      <Input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} required className="rounded-xl" />
                    </motion.div>
                  )}

                  <div>
                    <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="rounded-xl" />
                    <div className="grid grid-cols-2 gap-1 text-[10px] mt-2 p-2 bg-slate-50 rounded-lg">
                      <p className={validatePassword(password).length ? "text-green-600" : "text-slate-400"}>● 8+ Characters</p>
                      <p className={validatePassword(password).upper ? "text-green-600" : "text-slate-400"}>● Uppercase</p>
                      <p className={validatePassword(password).lower ? "text-green-600" : "text-slate-400"}>● Lowercase</p>
                      <p className={validatePassword(password).number ? "text-green-600" : "text-slate-400"}>● Number</p>
                      <p className={validatePassword(password).special ? "text-green-600" : "text-slate-400"}>● Symbol (@$!%*?&)</p>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 rounded-xl text-lg shadow-lg shadow-emerald-900/20" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>

                  {/* Redirection Links */}
                  <div className="space-y-3 pt-2">
                    <p className="text-center text-sm text-gray-600">
                      Already have account?{" "}
                      <span onClick={()=>navigate("/login")} className="text-emerald-600 font-bold cursor-pointer hover:underline">Login</span>
                    </p>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <p className="text-center text-sm">
                      Registering for an institution?{" "}
                      <span onClick={()=>navigate("/school-signup")} className="text-emerald-600 font-bold cursor-pointer hover:underline">
                        School Portal
                      </span>
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="otp" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  onSubmit={handleVerifyOTP} 
                  className="space-y-4"
                >
                  <div className="text-center space-y-2">
                    <p className="text-gray-600">Verification code sent to</p>
                    <p className="font-bold text-emerald-700">{email}</p>
                  </div>
                  <Input placeholder="Enter 6-Digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} required className="text-center text-lg tracking-[0.4em] py-4 rounded-xl font-mono" maxLength={6} />
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 rounded-xl" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>
                  <p onClick={handleResendOTP} className="text-center text-emerald-600 font-semibold cursor-pointer hover:text-emerald-500">
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