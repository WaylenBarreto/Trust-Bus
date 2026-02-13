<<<<<<< HEAD
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
=======
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
import { registerUser, resendOTP, verifyEmailOTP } from '../api/auth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const Signup = () => {
  const navigate = useNavigate()
<<<<<<< HEAD
  const cardRef = useRef(null)
=======
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758

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

<<<<<<< HEAD
  // 3D tilt
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

=======

  // ⭐ Email validator (added)
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // REGISTER
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

<<<<<<< HEAD
=======
    // ⭐ EMAIL VALIDATION ADDED
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
    if (!isValidEmail(email)) {
      return setError("Please enter a valid email address")
    }

    try {
      setLoading(true)

      await registerUser({
        role,
        name,
        email,
        phone,
        childName,
        studentId,
        password
      })

      setShowOTP(true)

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
=======
  // VERIFY OTP
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError("")
    try {
      setLoading(true)
      await verifyEmailOTP({ email, otp })
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email })
    } catch {
      setError("Failed to resend OTP")
    }
  }

<<<<<<< HEAD
  const formFields = [
    { delay: 0.2, child: (
      <div key="role" className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Register as</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'public', label: 'Public', icon: '🚌' },
            { id: 'parent', label: 'Parent', icon: '🎒' },
          ].map((r) => (
            <motion.button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                role === r.id
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md'
                  : 'border-gray-200 hover:border-emerald-300 text-gray-600'
              }`}
            >
              <span className="text-xl">{r.icon}</span>
              <span className="font-medium">{r.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    )},
    { delay: 0.25, child: <Input key="name" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="h-12 rounded-xl border-2" /> },
    { delay: 0.3, child: <Input key="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 rounded-xl border-2" /> },
    { delay: 0.35, child: <Input key="phone" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required className="h-12 rounded-xl border-2" /> },
  ]

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950">
      {/* Animated 3D background */}
      <motion.div
        animate={{ rotateY: [0, 15, 0], rotateX: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-teal-500/10 blur-3xl"
        style={{ perspective: 1000 }}
      />
      <motion.div
        animate={{ rotateY: [0, -20, 0], rotateX: [0, 15, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-[15%] w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"
        style={{ perspective: 1000 }}
      />
      <motion.div
        animate={{ rotateZ: [0, 360], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-teal-500/5"
        style={{ perspective: 1000 }}
      />

      <motion.div
        animate={{ y: [0, -12, 0], rotateY: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-12 text-4xl opacity-20"
        style={{ perspective: 500 }}
      >
        🎒
      </motion.div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card
          className="relative overflow-hidden border-0 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl"
          style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.5)" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
            style={{ transform: "translateZ(20px)" }}
          />

          <CardHeader className="pb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle
                className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                style={{ transform: "translateZ(30px)" }}
              >
                {showOTP ? "Verify Email" : "Create Account"}
              </CardTitle>
              <p className="text-center text-sm text-gray-500 mt-2">
                {showOTP ? "Enter the code we sent to your email" : "Join TrustBus for safe school travel"}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-3 px-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm mb-4"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.form
                  key="signup"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {formFields.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: f.delay }}
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {f.child}
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {role === "parent" && (
                      <motion.div
                        key="parent-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <Input placeholder="Child Name" value={childName} onChange={(e) => setChildName(e.target.value)} required className="h-12 rounded-xl border-2" />
                        <Input placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="h-12 rounded-xl border-2" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl border-2"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Uppercase, lowercase, number & special character
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Account"}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-sm text-gray-600"
                  >
                    Already have an account?{" "}
                    <motion.span
                      onClick={() => navigate('/login')}
                      className="text-emerald-600 font-semibold cursor-pointer"
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login
                    </motion.span>
                  </motion.p>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  onSubmit={handleVerifyOTP}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      required
                      className="h-12 rounded-xl border-2 text-center text-lg tracking-widest"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Verify Email"}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    onClick={handleResendOTP}
                    className="text-center text-sm text-emerald-600 font-medium cursor-pointer"
                  >
                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      Resend OTP
                    </motion.span>
                  </motion.p>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
=======
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-green-600">
            {showOTP ? "Verify Email" : "Create Account"}
          </CardTitle>
        </CardHeader>

        <CardContent>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          {!showOTP ? (
            <form onSubmit={handleSignup} className="space-y-4">

              <div className="space-y-2">
                <label className="text-sm font-medium">Register as</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={()=>setRole('public')}
                    className={`p-3 rounded-lg border ${role==='public' ? 'bg-green-50 border-green-500' : ''}`}>
                    🚌 Public
                  </button>

                  <button type="button" onClick={()=>setRole('parent')}
                    className={`p-3 rounded-lg border ${role==='parent' ? 'bg-green-50 border-green-500' : ''}`}>
                    🎒 Parent
                  </button>
                </div>
              </div>

              <Input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
              <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <Input placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} required />

              {role === "parent" && (
                <>
                  <Input placeholder="Child Name" value={childName} onChange={(e)=>setChildName(e.target.value)} required />
                  <Input placeholder="Student ID" value={studentId} onChange={(e)=>setStudentId(e.target.value)} required />
                </>
              )}

              <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />

              <p className="text-xs text-gray-500 text-center">
                Password must contain uppercase, lowercase, number & special character
              </p>

              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <span onClick={()=>navigate('/login')} className="text-green-600 cursor-pointer hover:underline">
                  Login
                </span>
              </p>

            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <Input placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} required />
              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <p onClick={handleResendOTP} className="text-center text-sm text-green-600 cursor-pointer">
                Resend OTP
              </p>
            </form>
          )}
        </CardContent>
      </Card>
>>>>>>> 4f3f6ea6c533369cc724f792361e360e86825758
    </div>
  )
}

export default Signup
