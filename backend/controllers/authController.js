const User = require("../models/User");
const School = require("../models/School");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// TEMP STORAGE FOR OTPs
const forgotPasswordOTPs = {};
const tempUsers = {};
const tempSchools = {}; 

// --- UTILITY: STRONG PASSWORD VALIDATION ---
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
};

// ==========================================
// STANDARD USER CONTROLLERS
// ==========================================

const registerUser = async (req, res) => {
  try {
    // UPDATED: Destructure schoolID from req.body
    const { role, name, email, phone, childName, studentId, schoolID, password } = req.body;

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters and include uppercase, lowercase, number and special symbol" });
    }

    // UPDATED: Validation logic for parents to include schoolID
    if (role === "parent") {
      if (!childName || !studentId || !schoolID) {
        return res.status(400).json({ 
          message: "Parents must provide Child Name, Student ID, and School ID" 
        });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Account already exists. Please login." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // UPDATED: Save schoolID into tempUsers
    tempUsers[email] = {
      role, 
      name, 
      email, 
      phone, 
      childName, 
      studentId, 
      schoolID, // New field
      password: await bcrypt.hash(password, 10),
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    };

    await sendEmail(email, "Verify your email", `Your TrustBus OTP is: ${otp}`);
    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const tempUser = tempUsers[email];

    if (!tempUser) return res.status(400).json({ message: "No signup request found" });
    if (tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // UPDATED: User creation now includes the spread tempUser (containing schoolID)
    await User.create({
      ...tempUser,
      isEmailVerified: true,
    });

    delete tempUsers[email];
    res.json({ message: "Email verified & account created 🎉" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const tempRecord = tempUsers[email] || tempSchools[email];

    if (!tempRecord) return res.status(400).json({ message: "No signup request found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempRecord.otp = otp;
    tempRecord.otpExpires = Date.now() + 10 * 60 * 1000;

    await sendEmail(email, "Resend OTP", `Your new TrustBus OTP is: ${otp}`);
    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Include full user info for dashboard (schoolID, childName for parents)
    res.json({
      token,
      user: { 
        name: user.name, 
        role: user.role, 
        email: user.email,
        childName: user.childName || "",
        schoolID: user.schoolID || ""
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// SCHOOL SPECIFIC CONTROLLERS
// ==========================================

const registerSchool = async (req, res) => {
  try {
    const { schoolName, schoolEmail, schoolID, driverName, driverNumber, busNumber, password } = req.body;

    if (!schoolEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (!driverNumber || !/^[0-9]{10}$/.test(String(driverNumber).replace(/\s/g, ""))) {
      return res.status(400).json({ message: "Driver phone number must be exactly 10 digits" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters and include uppercase, lowercase, number and special symbol" });
    }

    const schoolExists = await School.findOne({ schoolEmail });
    if (schoolExists) return res.status(400).json({ message: "This school is already registered." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    tempSchools[schoolEmail] = {
      schoolName, schoolEmail, schoolID, driverName, driverNumber, busNumber,
      password: await bcrypt.hash(password, 10),
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    };

    await sendEmail(schoolEmail, "School Verification", `Your School Registration OTP is: ${otp}`);
    res.status(201).json({ message: "Verification OTP sent to school Gmail" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifySchoolOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const temp = tempSchools[email];

    if (!temp) return res.status(400).json({ message: "No registration found" });
    if (temp.otp !== otp || temp.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await School.create({
      schoolName: temp.schoolName,
      schoolEmail: temp.schoolEmail,
      schoolID: temp.schoolID,
      driverName: temp.driverName,
      driverNumber: temp.driverNumber,
      busNumber: temp.busNumber,
      password: temp.password,
      isVerified: true
    });

    delete tempSchools[email];
    res.json({ message: "School verified successfully! 🏫" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginSchool = async (req, res) => {
  try {
    const { email, password } = req.body;
    const school = await School.findOne({ schoolEmail: email });

    if (!school) return res.status(400).json({ message: "School account not found" });

    const match = await bcrypt.compare(password, school.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: school._id, role: 'school' }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      school: { name: school.schoolName, bus: school.busNumber, role: 'school', schoolID: school.schoolID }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// PASSWORD RECOVERY
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).trim()) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    const user = await User.findOne({ email: email.trim() });
    const school = await School.findOne({ schoolEmail: email.trim() });

    if (!user && !school) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    forgotPasswordOTPs[email.trim()] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      type: user ? "user" : "school",
    };

    await sendEmail(email.trim(), "Reset Password", `Your TrustBus reset code is: ${otp}`);
    res.json({ message: "Reset OTP sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const emailTrim = email ? String(email).trim() : "";

    if (!emailTrim) {
      return res.status(400).json({ message: "Email is required" });
    }

    const record = forgotPasswordOTPs[emailTrim];

    if (!record || record.otp !== otp || record.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "New password is too weak." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (record.type === "school") {
      await School.findOneAndUpdate({ schoolEmail: emailTrim }, { password: hashedPassword });
    } else {
      await User.findOneAndUpdate({ email: emailTrim }, { password: hashedPassword });
    }

    delete forgotPasswordOTPs[emailTrim];
    res.json({ message: "Password reset successful 🎉" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyEmailOTP,
  resendEmailOTP,
  loginUser,
  registerSchool,
  verifySchoolOTP,
  loginSchool,
  forgotPassword,
  resetPassword,
};