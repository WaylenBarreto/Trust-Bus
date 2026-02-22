import axios from "axios"; // Ensure axios is installed
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

const SchoolSignup = () => {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolEmail: "",
    schoolID: "",
    driverName: "",
    driverNumber: "",
    busNumber: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "driverNumber") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "").slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(String(phone || "").replace(/\s/g, ""));
  const validatePassword = (pass) => ({
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    lower: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[@$!%*?&]/.test(pass),
  });
  const isStrongPassword = (pass) => Object.values(validatePassword(pass)).every(Boolean);

  const handleSchoolSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(formData.schoolEmail)) {
      setError("Enter a valid email address");
      return;
    }
    if (!isValidPhone(formData.driverNumber)) {
      setError("Driver number must be exactly 10 digits");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      setError("Password must be 8+ characters with uppercase, lowercase, number and special symbol (@$!%*?&)");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/school/register", formData);
      setShowOTP(true);
    } catch (err) {
      setError(err.response?.data?.message || "School registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/school/verify", {
        email: formData.schoolEmail,
        otp,
      });
      navigate("/login");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-emerald-600">
              {showOTP ? "Verify School" : "School Portal"}
            </CardTitle>
            {!showOTP && <p className="text-center text-gray-500 text-sm">Institutional Registration</p>}
          </CardHeader>

          <CardContent>
            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.form key="school-form" onSubmit={handleSchoolSignup} className="space-y-4">
                  <Input name="schoolName" placeholder="School Name" onChange={handleChange} required />
                  <Input name="schoolEmail" type="email" placeholder="School Gmail" onChange={handleChange} required />
                  <Input name="schoolID" placeholder="School ID (Unique)" onChange={handleChange} required />
                  
                  <Input name="driverName" placeholder="Driver Name" onChange={handleChange} required />
                  <Input name="driverNumber" placeholder="Driver Phone (10 digits)" onChange={handleChange} required maxLength={10} />
                  <Input name="busNumber" placeholder="Bus Number" onChange={handleChange} required />

                  <div>
                    <Input name="password" type="password" placeholder="Admin Password" onChange={handleChange} required />
                    <div className="grid grid-cols-2 gap-1 text-[10px] mt-2 p-2 bg-slate-50 rounded-lg">
                      <p className={validatePassword(formData.password).length ? "text-green-600" : "text-slate-400"}>● 8+ Characters</p>
                      <p className={validatePassword(formData.password).upper ? "text-green-600" : "text-slate-400"}>● Uppercase</p>
                      <p className={validatePassword(formData.password).lower ? "text-green-600" : "text-slate-400"}>● Lowercase</p>
                      <p className={validatePassword(formData.password).number ? "text-green-600" : "text-slate-400"}>● Number</p>
                      <p className={validatePassword(formData.password).special ? "text-green-600" : "text-slate-400"}>● Symbol (@$!%*?&)</p>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading} type="submit">
                    {loading ? "Requesting OTP..." : "Register School"}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-600">
                    Not a school? <span onClick={() => navigate("/signup")} className="text-emerald-600 cursor-pointer font-bold">Standard Signup</span>
                  </p>
                </motion.form>
              ) : (
                <motion.form key="otp-form" onSubmit={handleVerifyOTP} className="space-y-4">
                  <p className="text-center text-sm text-gray-600">Verification code sent to {formData.schoolEmail}</p>
                  <Input placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  <Button className="w-full bg-emerald-600" disabled={loading}>
                    {loading ? "Verifying..." : "Confirm & Activate"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SchoolSignup;