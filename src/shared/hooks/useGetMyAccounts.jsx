import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getMyAccounts } from "../../services/api";


export const useGetMyAccounts = () => {
  const [accounts, setMyAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyAccounts();
      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return;
      }

      setMyAccounts(response.data.accounts);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { accounts, fetchAccounts, isLoading };
};