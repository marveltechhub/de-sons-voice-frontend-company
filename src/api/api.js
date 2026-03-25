import axios from "axios";

const API = axios.create({
  baseURL: "https://de-sons-voice-backend-2.onrender.com/api",
  withCredentials: true, // 🔥 REQUIRED for JWT cookies
});

export default API;


