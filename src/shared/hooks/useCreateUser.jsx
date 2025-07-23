import { useState } from "react";
import { createUser } from "../../services/api";

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUser(userData);
      if (result.error) {
        const errorMessage = result.e?.response?.data?.message || result.e?.message || "Error desconocido al crear usuario.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        return { success: true, data: result.data };
      }
    } catch (err) {
      const errorMessage = err.message || "Error inesperado al crear usuario.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewUser,
    loading,
    error,
  };
};