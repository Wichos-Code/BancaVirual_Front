// shared/hooks/useReverseDeposit.js
import { useState, useCallback } from 'react';
import { reverseDeposit } from '../../services/api'; // Asegúrate de que esta ruta sea correcta

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
                const errorMessage = response.e?.response?.data?.message || response.e?.message || 'Error al revertir el depósito.';
                setError(errorMessage);
                setIsSuccess(false);
                return { success: false, message: errorMessage }; // Devolver un mensaje claro
            } else if (response.data && response.data.success) {
                setIsSuccess(true);
                setReversalResult(response.data);
                // Asumiendo que el backend devuelve updatedAccountBalance y currency en reversalDetails
                return {
                    success: true,
                    message: response.data.message || 'Depósito revertido exitosamente.',
                    data: {
                        updatedAccountBalance: response.data.updatedAccountBalance, // Asegúrate que el backend lo envíe
                        currency: response.data.reversalDetails?.currency // O de donde venga la moneda
                    }
                };
            } else {
                const errorMessage = response.data?.message || 'Respuesta inesperada al revertir el depósito.';
                setError(errorMessage);
                setIsSuccess(false);
                return { success: false, message: errorMessage };
            }
        } catch (err) {
            console.error("Excepción en useReverseDeposit:", err);
            const errorMessage = err.message || 'Error desconocido al revertir el depósito.';
            setError(errorMessage);
            setIsSuccess(false);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { triggerReverseDeposit, isLoading, error, isSuccess, reversalResult };
};