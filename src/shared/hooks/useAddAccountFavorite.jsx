import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { setFavoriteAccount } from "../../services/api";

export const useAddAccountFavorite = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addFavoriteAccount = useCallback(async (data) => {

    console.log("Adding favorite account:", data);
    setIsLoading(true);
    try {
      const response = await setFavoriteAccount(data);
      if (response.error) {
        console.error("Error al hacer favorito", response.e);
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return { error: true, message: msg };
      }
      toast.success(response.data.msg || "Cuenta favorita agregada con éxito");
      return { data: response.data };
    } catch (err) {
      toast.error(err.message);
      return { error: true, message: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addFavoriteAccount, isLoading };
};