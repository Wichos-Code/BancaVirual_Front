// src/shared/hooks/useVerifyEmail.js
import { useState, useCallback } from "react";
import { verifyEmail as apiVerifyEmail } from "../../services/api";

export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(async (code) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiVerifyEmail(code);
      if (response.error) {
        setError(response.e);
        return false;
      }
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { verify, isLoading, error };
};
