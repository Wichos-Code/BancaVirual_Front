import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getMyFavoriteAccounts } from "../../services/api";

export const useMyFavoriteAccounts = () => {
  const [favorites, setMyFavorite] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyFavoriteAccounts();

      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.msg || err.message;
        toast.error(msg);
        return;
      }
      setMyFavorite(response.data.favorites);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { favorites, fetchFavorites, isLoading };
};