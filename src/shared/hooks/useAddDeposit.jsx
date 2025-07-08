import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { setDeposit } from "../../services/api";

export const useAddDeposit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addDeposit = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const response = await setDeposit(data);
      if (response.error) {
        console.error("Error al enviar el deposito", response.e);
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return { error: true, message: msg };
      }
      toast.success(response.data.msg || "Deposito enviado con exito");
      return { data: response.data };
    } catch (err) {
      toast.error(err.message);
      return { error: true, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addDeposit, isLoading };
};