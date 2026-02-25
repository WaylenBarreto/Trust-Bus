import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ==========================================
// STANDARD USER AUTH (Public/Parents)
// ==========================================

// REGISTER (send OTP)
export const registerUser = (data) =>
  API.post("/auth/register", data);

// VERIFY EMAIL OTP
export const verifyEmailOTP = (data) =>
  API.post("/auth/verify-email", data);

// RESEND OTP (Works for both Users and Schools)
export const resendOTP = (data) =>
  API.post("/auth/resend-otp", data);

// LOGIN
export const loginUser = (data) =>
  API.post("/auth/login", data);

// ==========================================
// SCHOOL SPECIFIC AUTH (Institutional)
// ==========================================

// REGISTER SCHOOL (sends OTP to school gmail)
export const registerSchool = (data) => 
  API.post("/auth/school/register", data);

// VERIFY SCHOOL OTP
export const verifySchoolOTP = (data) => 
  API.post("/auth/school/verify", data);

// SCHOOL LOGIN
export const loginSchool = (data) => 
  API.post("/auth/school/login", data);

// ==========================================
// SAFETY & UTILITIES
// ==========================================

// SUBMIT SAFETY REPORT
export const submitSafetyReport = (data) =>
  API.post("/reports", data);

export const submitDriverRating = (data) =>
  API.post("/ratings", data);

// FORGOT/RESET PASSWORD (Using axios for consistency)
export const forgotPassword = (data) => 
  API.post("/auth/forgot-password", data);

export const resetPassword = (data) => 
  API.post("/auth/reset-password", data);

// ==========================================
// TRIPS (School driver portal)
// ==========================================

export const createTrip = (data) =>
  API.post("/trips", data);
