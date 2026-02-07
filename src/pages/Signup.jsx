import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const Signup = () => {
  const navigate = useNavigate()

  const [role, setRole] = useState("public")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [childName, setChildName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await axios.post("http://localhost:5000/api/auth/register", {
        role,
        name,
        email,
        phone,
        childName,
        password
      })

      alert("Account created successfully 🎉")
      navigate("/login")

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-green-600">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">

            {/* ROLE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('public')}
                  className={`p-3 rounded-lg border ${role==='public' ? 'bg-green-50 border-green-500' : ''}`}
                >
                  🚌 Public
                </button>

                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`p-3 rounded-lg border ${role==='parent' ? 'bg-green-50 border-green-500' : ''}`}
                >
                  🎒 Parent
                </button>
              </div>
            </div>

            <Input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} required />

            {role === "parent" && (
              <Input
                placeholder="Child Name"
                value={childName}
                onChange={(e)=>setChildName(e.target.value)}
                required
              />
            )}

            <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />

            <Button className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={()=>navigate('/login')}
                className="text-green-600 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
