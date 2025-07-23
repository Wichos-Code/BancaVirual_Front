// src/shared/hooks/useCreateUser.jsx
import { useState } from "react";
import { createUser } from "../../services/api"; // Asegúrate de que esta ruta sea correcta

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewUser = async (userData) => {
    setLoading(true);
    setError(null); // Resetear cualquier error previo
    try {
      const result = await createUser(userData); // Llama a la función de la API
      if (result.error) {
        // Acceder al mensaje de error del backend si existe, o un mensaje genérico
        const errorMessage = result.e?.response?.data?.message || result.e?.message || "Error desconocido al crear usuario.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        return { success: true, data: result.data };
      }
    } catch (err) {
      // Para errores inesperados que no son capturados por el `try/catch` de `apiClient`
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