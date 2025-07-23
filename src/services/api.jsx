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
    return await apiClient.post("/account/createTransaction", data);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
}

export const setDeposit = async (data) => {
  try {
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

export const getUsers = async () => {
  try {
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
    return await apiClient.delete(`/user/delete/${dpi}`);
  } catch (e) {
    console.log(e);
    return { error: true, e };
  }
};

export const createUser = async (data) => {
  try {
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
    const response = await apiClient.put(`/user/update/${dpi}`, data);
    console.log(`Respuesta de la API /user/update/${dpi}:`, response.data);
    return { success: true, data: response.data };
  } catch (e) {
    console.error("Error en updateUser API:", e.response?.data?.message || e.message);
    return { error: true, e };
  }
};

export const getMostActiveAccounts = async () => {
  try {
      const response = await apiClient.get("/account/admin/mostActiveAccounts");
      // Asume que el backend devuelve { success: true, accounts: [...] }
      return { success: true, data: response.data }; // Devuelve la data completa
  } catch (e) {
      console.error("Error fetching most active accounts:", e);
      return { error: true, e };
  }
};

export const getAllAccounts = async () => {
  try {
    const response = await apiClient.get("/account/getAllAccounts");
    // response.data = { success: true, accounts: [...] }
    return { success: true, data: response.data.accounts };
  } catch (e) {
    console.error("Error fetching all accounts:", e);
    return { error: true, e };
  }
};

export const getAccountDetailsForAdmin = async (accountId) => {
  try {
      const response = await apiClient.get(`/account/admin/accountDetails/${accountId}`);
      // Asume que el backend devuelve { success: true, accountDetails: {...} }
      return { success: true, data: response.data }; // Devuelve la data completa
  } catch (e) {
      console.error(`Error fetching account details for account ${accountId}:`, e);
      console.error(e)
      return { error: true, e };
  }
};

export const reverseDeposit = async (transactionId) => {
  try {
      const response = await apiClient.post("/account/admin/reverseDeposit", { transactionId });
      // Asume que el backend devuelve { success: true, message: "...", reversalDetails: {...}, updatedAccountBalance: ... }
      return { success: true, data: response.data }; // Devuelve la data completa
  } catch (e) {
      console.error(`Error reversing deposit transaction ${transactionId}:`, e);
      return { error: true, e };
  }
};