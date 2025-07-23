// src/hooks/useAccountDetailsForAdmin.js
import { useState, useEffect } from 'react';
import { getAccountDetailsForAdmin } from '../../services/api'; // Asegúrate de que la ruta sea correcta

export const useAccountDetailsForAdmin = (accountId) => {
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!accountId) {
            setAccountDetails(null);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchAccountDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAccountDetailsForAdmin(accountId);
                if (response.error) {
                    throw new Error(response.e?.response?.data?.message || 'Error al obtener detalles de la cuenta');
                }
                setAccountDetails(response.data.accountDetails); // Asume response.data.accountDetails
            } catch (err) {
                setError(err.message || 'Error desconocido al cargar los detalles de la cuenta.');
                setAccountDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [accountId]); // Se re-ejecuta cada vez que accountId cambia

    return { accountDetails, loading, error };
};