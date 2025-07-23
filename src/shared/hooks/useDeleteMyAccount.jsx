// src/shared/hooks/useDeleteMyAccount.jsx
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { deleteAccount as deleteAccountApi } from "../../services/api"; // <-- Importa la función 'deleteAccount' del api.jsx y renómbrala para evitar conflictos

export const useDeleteMyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fecthDeleteMyAccount = useCallback(async (id) => {
    setIsLoading(true);
    try {
      // Llama a la función de la API importada, no al componente
      const response = await deleteAccountApi(id); 

      if (response.error) {
        const err = response.e;
        // Usa `message` si existe en el error del backend, o `msg` como fallback
        const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Error al eliminar la cuenta";
        toast.error(msg);
        return { success: false, message: msg }; // Retorna success: false para indicar el fallo
      }
      
      // Ajusta el mensaje de éxito para que sea relevante para cuentas
      toast.success(response.data.message || response.data.msg || "Cuenta eliminada exitosamente");
      return { success: true, data: response.data }; // Retorna success: true si todo fue bien
    } catch (err) {
      toast.error(err.message || "Ocurrió un error inesperado al eliminar la cuenta.");
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fecthDeleteMyAccount, isLoading };
};