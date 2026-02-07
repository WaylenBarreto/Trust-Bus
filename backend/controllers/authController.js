const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { role, name, email, phone, childName, password } = req.body

    // 1️⃣ check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // 2️⃣ hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 3️⃣ create user (SAVE ALL NEW FIELDS)
    const user = await User.create({
      role,          // public / parent
      name,
      email,
      phone,
      childName: role === "parent" ? childName : "", // only parents have child
      password: hashedPassword,
    })

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    })
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

    // create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 🔥 SEND USER DATA TO FRONTEND (VERY IMPORTANT)
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
  loginUser,
}
