const express = require("express")
const router = express.Router()

const {
  registerUser,
  loginUser,
  verifyEmailOTP,
  resendEmailOTP,
  forgotPassword,
  resetPassword,
  // New School Controllers
  registerSchool,
  verifySchoolOTP,
  loginSchool,
} = require("../controllers/authController")

// --- STANDARD USER ROUTES ---
// Register user (sends OTP)
router.post("/register", registerUser)

// Verify email using OTP
router.post("/verify-email", verifyEmailOTP)

// Resend OTP
router.post("/resend-otp", resendEmailOTP)

// Login
router.post("/login", loginUser)

// --- SCHOOL SPECIFIC ROUTES ---
// Register school (sends OTP to school gmail)
router.post("/school/register", registerSchool)

// Verify school gmail using OTP
router.post("/school/verify", verifySchoolOTP)

// School Login
router.post("/school/login", loginSchool)

// ⭐ FORGOT PASSWORD ROUTES
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

module.exports = router