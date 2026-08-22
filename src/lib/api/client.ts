import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject user role header on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("proofdesk-role") || "REVIEWER";
    config.headers["x-user-role"] = role;
  }
  return config;
});

// Response error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const apiError = error.response.data;
      const err = Object.assign(new Error(apiError.error?.message || "An error occurred"), {
        code: apiError.error?.code,
        status: error.response?.status,
        details: apiError.error?.details,
      });
      throw err;
    }
    throw error;
  }
);
