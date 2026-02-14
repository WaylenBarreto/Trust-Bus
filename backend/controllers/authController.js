const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail")

// TEMP STORAGE FOR UNVERIFIED USERS
const tempUsers = {}

const registerUser = async (req, res) => {
  try {
    const { role, name, email, phone, childName, studentId, password } = req.body

    // PHONE VALIDATION
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit phone number"
      })
    }

    // STRONG PASSWORD VALIDATION
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number and special symbol"
      })
    }

    // Parent validation
    if (role === "parent" && (!childName || !studentId)) {
      return res.status(400).json({
        message: "Please enter child name and student ID"
      })
    }

    // Check existing user in DB
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        message: "Account already exists. Please login."
      })
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // STORE USER TEMPORARILY (NOT IN DB)
    tempUsers[email] = {
      role,
      name,
      email,
      phone,
      childName,
      studentId,
      password: await bcrypt.hash(password, 10),
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    }

    await sendEmail(email, "Verify your email", `Your TrustBus OTP is: ${otp}`)

    res.status(201).json({ message: "OTP sent to email" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    const tempUser = tempUsers[email]

    if (!tempUser)
      return res.status(400).json({ message: "No signup request found" })

    if (tempUser.otp !== otp || tempUser.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" })

    // SAVE USER AFTER VERIFICATION
    await User.create({
      role: tempUser.role,
      name: tempUser.name,
      email: tempUser.email,
      phone: tempUser.phone,
      childName: tempUser.childName,
      studentId: tempUser.studentId,
      password: tempUser.password,
      isEmailVerified: true,
    })

    delete tempUsers[email]

    res.json({ message: "Email verified & account created 🎉" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body
    const tempUser = tempUsers[email]

    if (!tempUser)
      return res.status(400).json({ message: "No signup request found" })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    tempUser.otp = otp
    tempUser.otpExpires = Date.now() + 10 * 60 * 1000

    await sendEmail(email, "Resend OTP", `Your new OTP: ${otp}`)
    res.json({ message: "OTP resent successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      token,
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        childName: user.childName,
        studentId: user.studentId,
      },
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerUser, verifyEmailOTP, resendEmailOTP, loginUser }
