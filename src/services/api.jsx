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

export const addAccount = async (data) => {
  try {
    const formData = new FormData();
    formData.append("currency", data.currency);
    formData.append("type", data.type);

    return await apiClient.post("/account/createAccount", data);
  } catch (e) {
    return { error: true, e };
  }
}

export const getMyAccounts = async () => {
  try {
    return await apiClient.get("/account/getMyAccounts");
  } catch (e) {
    return { error: true, e };
  }
}

export const setTransaction = async (data) => {
  try {
    const formData = new FormData();
    formData.append("fromAccount", data.fromAccount);
    formData.append("toAccount", data.toAccount);
    formData.append("amount", data.amount);

    return await apiClient.post("/account/createTransaction", data);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
} 

export const setDeposit = async (data) => {
  try {
    const formData = new FormData();
    formData.append("account", data.fromAccount);
    formData.append("amount", data.amount);

    return await apiClient.post("/account/createDeposit", data);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
}

export const deleteAccount = async (id) => {
  try {
    return await apiClient.delete(`/account/deleteAccount/${id}`);
  } catch (e) {
    return { error: true, e };
  }
}

export const myHistorial = async (data) => {
  try {
    console.log(data);
    return await apiClient.post("/account/getDepositHistory", data);
  } catch (e) {
    return { error: true, e };
  }
}

export const getMyFavoriteAccounts = async () => {
  try {
    return await apiClient.get("/account/getFavorites");
  } catch (e) {
    return { error: true, e };
  }
}

export const setFavoriteAccount = async (data) => {
  try {

    return await apiClient.put("/account/addFavorite", data);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
}