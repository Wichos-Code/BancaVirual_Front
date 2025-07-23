// src/shared/hooks/useUpdateUser.jsx
import { useState } from "react";
import { updateUser } from "../../services/api"; // Asegúrate de que esta ruta sea correcta

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateExistingUser = async (dpi, userData) => {
    setLoading(true);
    setError(null); // Resetear cualquier error previo
    try {
      const result = await updateUser(dpi, userData); // Llama a la función de la API
      if (result.error) {
        // Acceder al mensaje de error del backend si existe, o un mensaje genérico
        const errorMessage = result.e?.response?.data?.message || result.e?.message || "Error desconocido al actualizar usuario.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        return { success: true, data: result.data };
      }
    } catch (err) {
      // Para errores inesperados que no son capturados por el `try/catch` de `apiClient`
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