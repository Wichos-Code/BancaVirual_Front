import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { setTransaction } from "../../services/api";

export const useAddTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const response = await setTransaction(data);
      if (response.error) {
        console.error("Error al enviar la transacción", response.e);
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return { error: true, message: msg };
      }
      toast.success(response.data.msg || "Transacción enviada con exito");
      return { data: response.data };
    } catch (err) {
      toast.error(err.message);
      return { error: true, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addTransaction, isLoading };
};