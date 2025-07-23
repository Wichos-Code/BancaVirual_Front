// shared/hooks/useMostActiveAccounts.js
import { useState, useEffect, useCallback } from 'react';
import { getMostActiveAccounts } from '../../services/api'; // Asegúrate de que esta ruta sea correcta

export const useMostActiveAccounts = () => {
    const [accounts, setAccounts] = useState([]); // Inicializar como array vacío
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMostActiveAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMostActiveAccounts();
            // Asumiendo que getMostActiveAccounts en api.js devuelve { error: true, e } o response.data
            if (response.error) {
                // Si hay un error de Axios (ej. 403, 404, 500)
                const errorMessage = response.e?.response?.data?.message || response.e?.message || 'Error al obtener cuentas más activas.';
                setError(errorMessage);
                setAccounts([]);
            } else if (response.data && response.data.success) {
                // Si la API devuelve éxito
                setAccounts(response.data.accounts);
            } else {
                // Si la API devuelve un 200 pero sin success: true o sin accounts
                setError(response.data?.message || 'Respuesta inesperada al obtener cuentas activas.');
                setAccounts([]);
            }
        } catch (err) {
            // Este catch es para errores inesperados que no fueron manejados por el api.js
            console.error("Excepción en useMostActiveAccounts:", err);
            setError(err.message || 'Error desconocido al cargar las cuentas más activas.');
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    }, []); // No hay dependencias, se ejecuta una vez al montar

    useEffect(() => {
        fetchMostActiveAccounts();
    }, [fetchMostActiveAccounts]); // Se ejecuta al montar y cada vez que fetchMostActiveAccounts cambia (que no debería si es useCallback con [] dep)

    return { accounts, loading, error, refetch: fetchMostActiveAccounts }; // Añadir refetch
};