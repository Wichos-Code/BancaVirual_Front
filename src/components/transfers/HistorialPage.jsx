import React, { useEffect } from "react";
import { useMyHistorial } from "../../shared/hooks/useMyHistorial";
import { useParams, useNavigate } from "react-router-dom";
 
export const HistorialPage = () => {
  const { transactions, fetchHistorial } = useMyHistorial();
  const { noAccount } = useParams();
 
  useEffect(() => {
    fetchHistorial(noAccount);
  }, [fetchHistorial, noAccount]);
 
  const navigate = useNavigate();
 
  const goToNavigate = (route) => {
    navigate(route);
  };
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
 
  const getTransferTypeLabel = (transfer) => {
    if (transfer.type === "DEPOSIT") return "Depósito recibido";
    if (transfer.type === "WITHDRAWAL") return "Retiro";
    if (transfer.type === "TRANSFER") {
      if (transfer.fromAccount === Number(noAccount)) return "Transferencia enviada";
      if (transfer.toAccount === Number(noAccount)) return "Transferencia recibida";
    }
    return "Movimiento";
  };
 
  const getAmountPrefix = (transfer) => {
    if (transfer.type === "DEPOSIT") return "+";
    if (transfer.type === "WITHDRAWAL") return "-";
    if (transfer.type === "TRANSFER") {
      return transfer.fromAccount === Number(noAccount) ? "-" : "+";
    }
    return "";
  };
 
  const getAmountColor = (transfer) => {
    if (transfer.type === "DEPOSIT") return "text-green-600";
    if (transfer.type === "WITHDRAWAL") return "text-red-600";
    if (transfer.type === "TRANSFER") {
      return transfer.fromAccount === Number(noAccount) ? "text-red-600" : "text-green-600";
    }
    return "text-gray-600";
  };
 
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
<div className="max-w-4xl mx-auto">
<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
<div className="bg-[#163a5d] px-8 py-6">
<div className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-bold text-white">Historial de Movimientos</h1>
</div>
<button
                className="bg-gray-100 text-gray-700 bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
                onClick={() => goToNavigate(`/bancavirtual/mis-cuentas`)}
>
                ← Volver a Cuentas
</button>
</div>
</div>
 
          <div className="p-8">
            {transactions.length === 0 ? (
<div className="text-center py-12">
<p className="text-gray-600">No hay movimientos para mostrar</p>
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
<div className={`p-2 rounded-full`}>
                          {/* Aquí podrías poner un ícono en el futuro */}
</div>
<div>
<p className="font-semibold text-gray-800">
                            {getTransferTypeLabel(transfer)}
</p>
<p className="text-sm text-gray-600">
                            {formatDate(transfer.createdAt)}
</p>
</div>
</div>
<div className="text-right">
<p className={`font-bold text-lg ${getAmountColor(transfer)}`}>
                          {getAmountPrefix(transfer)}
                          {transfer.currency} {transfer.amount}
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
};