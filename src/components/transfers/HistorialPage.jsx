import React from "react";
import { useMyHistorial } from "../../shared/hooks/useMyHistorial";
import { useParams, useNavigate  } from "react-router-dom";
import { useEffect, useState } from "react";

export const HistorialPage = () => {
    const { transactions, fetchHistorial } = useMyHistorial();
    const { noAccount } = useParams();

    console.log(noAccount)
    
    useEffect(() => {
        fetchHistorial(noAccount);
    }, [fetchHistorial]);

    const navigate = useNavigate();

    const goToNavigate = (route) => {
        navigate(route);
    }

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
        });
    };
    return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Historial de Transferencias</h1>
                </div>
                <button
                    className="bg-gray-100 text-gray-700 bg-opacity-20 hover:bg-opacity-3 px-4 py-2 rounded-lg transition-all"
                    onClick={() => goToNavigate(`/bancavirtual/mis-cuentas`)}
                >
                  ← Volver a Cuentas
                </button>
              </div>
            </div>

            <div className="p-8">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                  </div>
                  <p className="text-gray-600">No hay transferencias para mostrar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transfer) => (
                    <div
                      key={transfer._id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transfer.type === 'DEPOSIT' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {transfer.type === 'DEPOSIT' ? 'Transferencia Recibida' : 'Transferencia Enviada'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(transfer.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            transfer.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transfer.type === 'DEPOSIT' ? '+' : '-'}{transfer.currency} {transfer.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}