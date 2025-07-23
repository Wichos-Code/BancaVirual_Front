import React from 'react';
import { useDeleteMyAccount } from '../../shared/hooks/useDeleteMyAccount';

export const DeleteMyAccount = ({ id, onDeleted }) => {
  const { fecthDeleteMyAccount, isLoading } = useDeleteMyAccount();

  const handleDelete = async () => {
    if (window.confirm('Confirma eliminación de cuenta')) {
      await fecthDeleteMyAccount(id);
      onDeleted();
    }
  };

  return (
    <>
      <button 
        onClick={handleDelete}
        disabled={isLoading}
        className="bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
        Eliminar
      </button>
    </>
  );
};