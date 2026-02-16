import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// REGISTER (send OTP)
export const registerUser = (data) =>
  API.post("/auth/register", data);

// VERIFY EMAIL OTP
export const verifyEmailOTP = (data) =>
  API.post("/auth/verify-email", data);

// RESEND OTP
export const resendOTP = (data) =>
  API.post("/auth/resend-otp", data);

// LOGIN
export const loginUser = (data) =>
  API.post("/auth/login", data);

// SUBMIT SAFETY REPORT
export const submitSafetyReport = (data) =>
  API.post("/reports", data);

export const submitDriverRating = (data) =>
  API.post("/ratings", data);
export const forgotPassword = async (data) => {
  const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),   // ⭐ FIXED
  })
  return res.json()
}



export const resetPassword = async (data) => {
  const res = await fetch("http://localhost:5000/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),   // ⭐ FIXED
  })
  return res.json()
}

