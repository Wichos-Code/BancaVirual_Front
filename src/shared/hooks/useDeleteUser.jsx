import { useState } from "react";
import { deleteUser as deleteUserApi } from "../../services/api";
export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (dpi) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUserApi(dpi);
      if (response.error) {
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
        err.response?.data?.message ||
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