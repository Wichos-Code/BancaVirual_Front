import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { addAccount } from "../../services/api";

export const useCreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerAccount = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const response = await addAccount(data);
      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return { error: true, message: msg };
      }
      toast.success(response.data.msg || "Cuenta agregada con exito");
      return { data: response.data };
    } catch (err) {
      toast.error(err.message);
      return { error: true, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { registerAccount, isLoading };
};