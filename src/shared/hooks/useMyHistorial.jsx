import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { myHistorial } from "../../services/api";

export const useMyHistorial = () => {
  const [transactions, setMyHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistorial = useCallback(async (accountNo) => {
    setIsLoading(true);
    try {
      const response = await myHistorial({accountNo});
      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return;
      }
      console.log(response);
      setMyHistorial(response.data.transactions);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { transactions, fetchHistorial, isLoading };
};