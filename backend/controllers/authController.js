const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail")

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { role, name, email, phone, childName, password } = req.body

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be strong and at least 8 characters long",
      })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const user = await User.create({
      role,
      name,
      email,
      phone,
      childName: role === "parent" ? childName : "",
      password: hashedPassword,
      emailOTP: otp,
      emailOTPExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      isEmailVerified: false,
    })

    await sendEmail(
      email,
      "Verify your email",
      `Your verification OTP is: ${otp}\nThis OTP expires in 10 minutes.`
    )

    res.status(201).json({
      message: "User registered. OTP sent to email.",
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================= VERIFY OTP =================
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    if (
      user.emailOTP !== otp ||
      user.emailOTPExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.isEmailVerified = true
    user.emailOTP = undefined
    user.emailOTPExpires = undefined
    await user.save()

    res.json({ message: "Email verified successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================= RESEND OTP =================
const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.emailOTP = otp
    user.emailOTPExpires = Date.now() + 10 * 60 * 1000
    await user.save()

    await sendEmail(
      email,
      "Resend verification OTP",
      `Your new OTP is: ${otp}\nThis OTP expires in 10 minutes.`
    )

    res.json({ message: "OTP resent successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        role: user.role,
        childName: user.childName,
        phone: user.phone,
        email: user.email,
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  registerUser,
  verifyEmailOTP,
  resendEmailOTP,
  loginUser,
}
