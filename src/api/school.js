import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Fetch school details by schoolID (for parent dashboard)
export const getSchoolByID = (schoolID) =>
  API.get(`/school/${encodeURIComponent(schoolID)}`);
