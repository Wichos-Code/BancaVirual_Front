import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { deleteAccount as deleteAccountApi } from "../../services/api";

export const useDeleteMyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fecthDeleteMyAccount = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteAccountApi(id); 

      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Error al eliminar la cuenta";
        toast.error(msg);
        return { success: false, message: msg };
      }

      toast.success(response.data.message || response.data.msg || "Cuenta eliminada exitosamente");
      return { success: true, data: response.data };
    } catch (err) {
      toast.error(err.message || "Ocurrió un error inesperado al eliminar la cuenta.");
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fecthDeleteMyAccount, isLoading };
};