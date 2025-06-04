import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/virtualBank/v1",
  timeout: 5000,
  httpsAgent: false,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails && userDetails !== "undefined") {
      try {
        const token = JSON.parse(userDetails).token;
        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        localStorage.removeItem("user");
      }
    }
    
    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);

export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data);
  } catch (e) {
    return { error: true, e };
  }
};

export const verifyEmail = async (code) => {
  try {
    return await apiClient.get(`/auth/verify/${code}`);
  } catch (e) {
    return { error: true, e };
  }
};

export const login = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};