import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/exam-system/api",
  withCredentials: true // for session-based auth
});

export default api;
