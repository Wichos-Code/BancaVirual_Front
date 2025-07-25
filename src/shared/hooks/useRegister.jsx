import { useState, useCallback } from "react";
import { register as registerRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(async (formData) => {
    setIsLoading(true);
    let success = false;
    try {
      const response = await registerRequest(formData);

      if (response.error) {
        const errorData = response.e?.response?.data;
        const mainError = errorData?.errors?.[0]?.msg || errorData?.error || errorData?.message || "Error al registrar la cuenta";
        toast.error(mainError);
      } else {
        toast.success(response.data?.message || "¡Registrado correctamente!");
        success = true;
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      toast.error("Ocurrió un error inesperado durante el registro.");
    } finally {
      setIsLoading(false);
    }
    return { success };
  }, []);

  return { register, isLoading };
};