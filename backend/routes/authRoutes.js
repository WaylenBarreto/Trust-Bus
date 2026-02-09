const express = require("express")
const router = express.Router()

const {
  registerUser,
  loginUser,
  verifyEmailOTP,
  resendEmailOTP,
} = require("../controllers/authController")

// Register user (sends OTP)
router.post("/register", registerUser)

// Verify email using OTP
router.post("/verify-email", verifyEmailOTP)

// Resend OTP
router.post("/resend-otp", resendEmailOTP)

// Login (only after email verification)
router.post("/login", loginUser)

module.exports = router
