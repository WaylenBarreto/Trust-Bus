const express = require("express")
const router = express.Router()

const {
  registerUser,
  loginUser,
  verifyEmailOTP,
  resendEmailOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController")

// Register user (sends OTP)
router.post("/register", registerUser)

// Verify email using OTP
router.post("/verify-email", verifyEmailOTP)

// Resend OTP
router.post("/resend-otp", resendEmailOTP)

// Login
router.post("/login", loginUser)

// ⭐ FORGOT PASSWORD ROUTES
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

module.exports = router
