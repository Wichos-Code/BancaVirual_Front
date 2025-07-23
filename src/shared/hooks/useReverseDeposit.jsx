// src/hooks/useReverseDeposit.js
import { useState, useCallback } from 'react';
import { reverseDeposit } from '../../services/api'; // Asegúrate de que la ruta sea correcta

export const useReverseDeposit = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [reversalResult, setReversalResult] = useState(null);

    const triggerReverseDeposit = useCallback(async (transactionId) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);
        setReversalResult(null);

        try {
            const response = await reverseDeposit(transactionId);
            if (response.error) {
                throw new Error(response.e?.response?.data?.message || 'Error al revertir el depósito.');
            }
            setIsSuccess(true);
            setReversalResult(response.data); // Asume que la respuesta tiene response.data
            return { success: true, data: response.data };
        } catch (err) {
            setError(err.message || 'Error desconocido al revertir el depósito.');
            setIsSuccess(false);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    }, []); // La función no depende de ningún estado, por lo que useCallback está bien aquí

    return { triggerReverseDeposit, isLoading, error, isSuccess, reversalResult };
};