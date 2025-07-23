// shared/hooks/useAccountDetailsForAdmin.js
import { useState, useEffect, useCallback } from 'react';
import { getAccountDetailsForAdmin } from '../../services/api'; // Asegúrate de que esta ruta sea correcta

export const useAccountDetailsForAdmin = (accountId) => {
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccountDetails = useCallback(async (idToFetch) => {
        if (!idToFetch) {
            setAccountDetails(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getAccountDetailsForAdmin(idToFetch);

            if (response.success) {
                setAccountDetails(response.data.accountDetails);
            } else {
                const errorMessage = response.message || 'Error al obtener detalles de la cuenta.';
                setError(errorMessage);
                setAccountDetails(null);
            }
        } catch (err) {
            console.error("Excepción en useAccountDetailsForAdmin:", err);
            setError(err.response?.data?.message || err.message || 'Error desconocido al cargar los detalles de la cuenta.');
            setAccountDetails(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccountDetails(accountId);
    }, [accountId, fetchAccountDetails]);

    return { accountDetails, loading, error, refetch: fetchAccountDetails };
};