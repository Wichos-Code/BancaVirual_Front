// shared/hooks/useAddTransaction.js
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { setTransaction } from "../../services/api"; // Asegúrate de que esta ruta sea correcta

export const useAddTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);

    const addTransaction = useCallback(async (data) => {
        setIsLoading(true);
        try {
            const response = await setTransaction(data);

            // Asumiendo que `setTransaction` (tu servicio API) ya maneja errores HTTP y devuelve un objeto con `error` o `data`.
            // Si tu backend devuelve { success: true, message: "..." } para el éxito
            // y { success: false, message: "..." } para errores de validación de negocio (con status 2xx),
            // entonces esta lógica es robusta.

            if (response.error) {
                // Esto se ejecuta si `setTransaction` detecta un error (ej. status 4xx o 5xx)
                console.error("Error en useAddTransaction:", response.e);
                const err = response.e;
                const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Error desconocido en la transacción.";
                toast.error(msg);
                return { success: false, message: msg }; // Devolver success: false
            } else {
                // Esto se ejecuta si `setTransaction` fue exitoso (status 2xx)
                // Y esperamos que `response.data` contenga `success: true` del backend
                if (response.data && response.data.success) {
                    return {
                        success: true,
                        message: response.data.message || "Transacción enviada con éxito.",
                        data: response.data // Devuelve todos los datos de la respuesta para el componente
                    };
                } else {
                    // Caso donde la llamada HTTP fue exitosa (2xx), pero el backend indica un fallo lógico (ej. success: false)
                    const msg = response.data?.message || "La transacción no se pudo completar (respuesta lógica del servidor).";
                    toast.error(msg);
                    return { success: false, message: msg };
                }
            }
        } catch (err) {
            // Este catch es principalmente para errores de red o errores no manejados por `setTransaction`
            console.error("Excepción en useAddTransaction (catch):", err);
            const msg = err.message || "Ocurrió un error de red.";
            toast.error(msg);
            return { success: false, message: msg };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { addTransaction, isLoading };
};