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
                setMyAccounts([]);
                return;
            }

            if (response && response.data && Array.isArray(response.data.accounts)) {
                setMyAccounts(response.data.accounts);
            } else {
                console.warn("La respuesta de getMyAccounts no tiene la estructura esperada:", response);
                setMyAccounts([]);
                toast.error("Error al procesar las cuentas recibidas.");
            }

        } catch (err) {
            console.error("Error fetching accounts:", err);
            toast.error("No se pudieron cargar las cuentas. Inténtalo de nuevo.");
            setMyAccounts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { accounts, fetchAccounts, isLoading };
};