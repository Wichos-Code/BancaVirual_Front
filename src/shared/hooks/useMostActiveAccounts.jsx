// src/hooks/useMostActiveAccounts.js
import { useState, useEffect } from 'react';
import { getMostActiveAccounts } from '../../services/api'; // Asegúrate de que la ruta sea correcta

export const useMostActiveAccounts = () => {
    const [accounts, setAccounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMostActiveAccounts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getMostActiveAccounts();
                if (response.error) {
                    throw new Error(response.e?.response?.data?.message || 'Error al obtener cuentas más activas');
                }
                setAccounts(response.data.accounts); // Asume que la respuesta tiene response.data.accounts
            } catch (err) {
                setError(err.message || 'Error desconocido al cargar las cuentas más activas.');
                setAccounts(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMostActiveAccounts();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    return { accounts, loading, error };
};