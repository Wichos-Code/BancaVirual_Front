import { useState, useEffect, useCallback } from "react";
import { getUsers } from "../../services/api";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      if (response.error) {
        const errorMessage = response.e?.response?.data?.msg || response.e?.message || "Error desconocido al cargar usuarios.";
        setError(errorMessage);
        setUsers([]);
        setTotal(0);
        console.error("Error al cargar usuarios en hook:", errorMessage);
      } else {
        const fetchedUsers = response.data.user || [];
        const fetchedTotal = response.data.total || fetchedUsers.length;

        setUsers(fetchedUsers);
        setTotal(fetchedTotal);
        console.log("Usuarios cargados en hook (después de corrección):", fetchedUsers);
        console.log("Total de usuarios en hook (después de corrección):", fetchedTotal);
      }
    } catch (err) {
      const errorMessage = err.message || "Error inesperado al cargar usuarios.";
      setError(errorMessage);
      setUsers([]);
      setTotal(0);
      console.error("Excepción al cargar usuarios en hook:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refetch = () => {
    fetchUsers();
  };

  return {
    users,
    total,
    loading,
    error,
    refetch,
  };
};