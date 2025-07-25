import React, { useState, useEffect } from 'react'
import { useMyFavoriteAccounts } from '../../shared/hooks/useMyFavoriteAccounts';
import { useNavigate } from 'react-router-dom';
import { DeleteMyAccount } from './DeleteMyAccount';

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
            <div className=" rounded-2xl shadow-xl p-8">
    
                <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Listado de cuentas favoritas</h2>
                            <div className="flex space-x-3">
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                                onClick={handleUpdate}>
                                Actualizar
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                                onClick={() => goToNavigate('/bancavirtual/mis-cuentas')}>
                                Mis cuentas
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
                                    <div className="text-sm text-gray-600">
                                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:bg-gray-200 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Saldo disponible</span>
                                    <p className="text-sm text-gray-600">{favorite.currency} {favorite.amount}</p>
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