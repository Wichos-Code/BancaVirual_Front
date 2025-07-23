import { useState } from "react";
import { updateUser } from "../../services/api";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateExistingUser = async (dpi, userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateUser(dpi, userData);
      if (result.error) {
        const errorMessage = result.e?.response?.data?.message || result.e?.message || "Error desconocido al actualizar usuario.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        return { success: true, data: result.data };
      }
    } catch (err) {
      const errorMessage = err.message || "Error inesperado al actualizar usuario.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateExistingUser,
    loading,
    error,
  };
};