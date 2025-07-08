import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import DeleteMyAccount from "../../components/accounts/DeleteMyAccount";

export const useDeleteMyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fecthDeleteMyAccount = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await DeleteMyAccount(id);
      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return { error: true, message: msg };
      }
      toast.success(response.data.msg || "Habitación eliminada");
      return { data: response.data };
    } catch (err) {
      toast.error(err.message);
      return { error: true, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fecthDeleteMyAccount, isLoading };
};