import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/exam-system/api",
  withCredentials: true,
});

// GLOBAL RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // window.location.href = "/login"; // flickering cause
    }
    return Promise.reject(error);
  }
);

export default api;
