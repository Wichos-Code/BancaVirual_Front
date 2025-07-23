// src/services/api.jsx

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
    // Estas líneas de FormData no son necesarias si tu backend espera JSON directamente
    // const formData = new FormData();
    // formData.append("currency", data.currency);
    // formData.append("type", data.type);

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
    // Estas líneas de FormData no son necesarias si tu backend espera JSON directamente
    // const formData = new FormData();
    // formData.append("fromAccount", data.fromAccount);
    // formData.append("toAccount", data.toAccount);
    // formData.append("amount", data.amount);

    return await apiClient.post("/account/createTransaction", data);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
}

export const setDeposit = async (data) => {
  try {
    // Estas líneas de FormData no son necesarias si tu backend espera JSON directamente
    // const formData = new FormData();
    // formData.append("account", data.fromAccount);
    // formData.append("amount", data.amount);

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

// FUNCIONES PARA LA GESTIÓN DE USUARIOS (EXISTENTES Y LAS NUEVAS)

export const getUsers = async () => {
  try {
    // Tu backend devuelve /user/users
    const response = await apiClient.get("/user/users");
    console.log("Respuesta de la API /user/users:", response.data);
    return response;
  } catch (e) {
    console.error("Error en getUsers API:", e);
    return { error: true, e };
  }
};

export const deleteUser = async (dpi) => {
  try {
    // Tu backend devuelve /user/delete/:dpi
    return await apiClient.delete(`/user/delete/${dpi}`);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
};

// ¡NUEVAS FUNCIONES AGREGADAS!
export const createUser = async (data) => {
  try {
    // La ruta en tu backend es /user/createUser
    const response = await apiClient.post("/user/createUser", data);
    console.log("Respuesta de la API /user/createUser:", response.data);
    return { success: true, data: response.data };
  } catch (e) {
    console.error("Error en createUser API:", e.response?.data?.message || e.message);
    return { error: true, e };
  }
};

export const updateUser = async (dpi, data) => {
  try {
    // La ruta en tu backend es /user/update/:dpi
    const response = await apiClient.put(`/user/update/${dpi}`, data);
    console.log(`Respuesta de la API /user/update/${dpi}:`, response.data);
    return { success: true, data: response.data };
  } catch (e) {
    console.error("Error en updateUser API:", e.response?.data?.message || e.message);
    return { error: true, e };
  }
};

// --- NUEVAS FUNCIONES PARA ADMINISTRADORES (CUMPLIDAS ANTERIORMENTE) ---

export const getMostActiveAccounts = async () => {
  try {
    return await apiClient.get("/account/admin/mostActiveAccounts");
  } catch (e) {
    console.error("Error fetching most active accounts:", e);
    return { error: true, e };
  }
};

export const getAccountDetailsForAdmin = async (accountId) => {
  try {
    return await apiClient.get(`/account/admin/accountDetails/${accountId}`);
  } catch (e) {
    console.error(`Error fetching account details for account ${accountId}:`, e);
    return { error: true, e };
  }
};

export const reverseDeposit = async (transactionId) => {
  try {
    return await apiClient.post("/account/admin/reverseDeposit", { transactionId });
  } catch (e) {
    console.error(`Error reversing deposit transaction ${transactionId}:`, e);
    return { error: true, e };
  }
};