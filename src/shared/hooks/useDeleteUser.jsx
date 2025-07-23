// src/shared/hooks/useDeleteUser.jsx
import { useState } from "react";
import { deleteUser as deleteUserApi } from "../../services/api"; // Renombrado para evitar conflicto si tuvieras otra función llamada 'deleteUser'

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (dpi) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUserApi(dpi); // Llama a la función deleteUser de tu API, pasándole el DPI
      if (response.error) {
        // Accede a 'message' si tu backend devuelve un objeto de error con esa propiedad
        const errorMessage =
          response.e?.response?.data?.message ||
          response.e?.message ||
          "Error desconocido al eliminar el usuario.";
        setError(errorMessage);
        return { success: false, e: response.e };
      } else {
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || // Accede a 'message' si viene en response.data
        err.message ||
        "Error inesperado al eliminar el usuario.";
      setError(errorMessage);
      return { success: false, e: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteUser,
    loading,
    error,
  };
};