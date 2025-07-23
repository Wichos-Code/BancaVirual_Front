import { useState } from "react";
import { login as loginRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (identifier, password) => {
    setIsLoading(true);
    let success = false;
    try {
      const payload = /^\d+$/.test(identifier)
        ? { dpi: identifier, password }
        : { username: identifier, password };
      
      const response = await loginRequest(payload);

      if (response.error) {
        const errBody = response.e?.response?.data || "Error al iniciar sesión";
        toast.error(typeof errBody === "string" ? errBody : errBody.error || errBody.message);
      } else {
        const { userDetails } = response.data;
        localStorage.setItem("user", JSON.stringify(userDetails));
        success = true;
      }
    } catch (err) {
      console.error("Login falló inesperadamente:", err);
      const errBody = err.response?.data || "Error inesperado";
      toast.error(typeof errBody === 'string' ? errBody : JSON.stringify(errBody));
    } finally {
      setIsLoading(false);
    }
    return { success };
  };

  return { login, isLoading };
};