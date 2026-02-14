import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/auth"
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
    </div>
  )
}

export default Login
