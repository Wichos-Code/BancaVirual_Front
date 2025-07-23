import { useState, useCallback } from "react";
import { register as registerRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  // useCallback es ideal aquí ya que la función no se recreará en cada render a menos que sus dependencias cambien
  const register = useCallback(async (formData) => {
    setIsLoading(true);
    let success = false;
    try {
      const response = await registerRequest(formData);

      if (response.error) {
        // Lógica de error robusta que ya tenías
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
  }, []); // El array de dependencias vacío significa que la función nunca cambiará

  return { register, isLoading };
};