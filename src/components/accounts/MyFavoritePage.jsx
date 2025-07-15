import React, { useState, useEffect } from 'react'
import { useMyFavoriteAccounts } from '../../shared/hooks/useMyFavoriteAccounts';
import { useNavigate } from 'react-router-dom';
import DeleteMyAccount from './DeleteMyAccount';

export const MyFavoritePage = () => {
    const { favorites, fetchFavorites, isLoading } = useMyFavoriteAccounts();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === "file") {
        setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
        setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const navigate = useNavigate();

    const goToNavigate = (route) => {
        navigate(route);
    }

    const handleUpdate = async (e) => {
        fetchFavorites();
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cuentas Favoritas</h1>
                    <p className="text-gray-600">Lista de Cuentas Registradas</p>
                </div>
    
                <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Mis Cuentas</h2>
                            <div className="flex space-x-3">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                                onClick={() => goToNavigate('/bancavirtual/cuentas')}>
                                Nueva Cuenta
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                                onClick={handleUpdate}>
                                Actualizar
                                </button>
                            </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                            {favorites.map((favorite) => (
                                <div
                                key={favorite._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                                
                                >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">

                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{favorite.type}</h3>
                                        <p className="text-sm text-gray-600">{favorite.noAccount}</p>
                                    </div>
                                    </div>
                                    <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {favorite.currency}
                                    </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Saldo disponible</span>
                                    <p className="text-sm text-gray-600">{favorite.amount}</p>
                                    <span className="text-sm font-medium">
                                    </span>
                                    </div>
                                    <div className="flex space-x-2">
                                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-blue-700 transition-colors"
                                    onClick={() => goToNavigate('/bancavirtual/transferencias')}>
                                        Transferir
                                    </button>
                                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    onClick={() => goToNavigate(`/bancavirtual/my-historial/${favorite.noAccount}`)}>
                                        Estado
                                    </button>
                                    <DeleteMyAccount id={favorite._id} onDeleted={fetchFavorites} />
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                </div>
            </div>
        </div>
        </div>
    );
    }