import React, { useState, useEffect, useCallback } from 'react';
import { useAddTransaction } from '../../shared/hooks/useAddTransaction';
import { useGetMyAccounts } from '../../shared/hooks/useGetMyAccounts';

export const TransfersPage = () => {
    const { addTransaction, isLoading: isAddingTransaction } = useAddTransaction();
    const { accounts, fetchAccounts, isLoading: isFetchingAccounts } = useGetMyAccounts();

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const [formData, setFormData] = useState({ fromAccount: '', toAccount: '', amount: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [transactionMessage, setTransactionMessage] = useState('');
    const [transactionDetails, setTransactionDetails] = useState(null);

    const validate = useCallback(() => {
        const newErrors = {};
        if (!formData.fromAccount) {
            newErrors.fromAccount = 'Selecciona una cuenta de origen';
        }
        if (!formData.toAccount) {
            newErrors.toAccount = 'Ingresa la cuenta de destino';
        }

        const amountNum = parseFloat(formData.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            newErrors.amount = 'Ingresa un monto válido y mayor a cero.';
        } else {
            const selectedAccount = accounts.find(acc => acc.noAccount === formData.fromAccount);
            if (selectedAccount && amountNum > selectedAccount.amount) {
                newErrors.amount = `Fondos insuficientes. Saldo disponible: ${formatCurrency(selectedAccount.amount, selectedAccount.currency)}.`;
            }
            if (formData.fromAccount && formData.toAccount && formData.fromAccount === formData.toAccount) {
                newErrors.toAccount = 'No puedes transferir dinero a la misma cuenta.';
            }
        }
        return newErrors;
    }, [formData, accounts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
      
        if (transactionMessage) {
            setTransactionMessage('');
            setSuccess(false);
            setTransactionDetails(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);
        setTransactionMessage('');
        setTransactionDetails(null);

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setTransactionMessage('Por favor, corrige los errores del formulario.');
            return;
        }

        const amountAsNumber = parseFloat(formData.amount);

        try {
            const response = await addTransaction({
                fromAccount: formData.fromAccount,
                toAccount: formData.toAccount,
                amount: amountAsNumber
            });

            if (response && response.success) {
                setSuccess(true);
                setTransactionMessage(response.message || '¡Transferencia Exitosa!');
                setTransactionDetails(response.data);
                setFormData({ fromAccount: '', toAccount: '', amount: '' });
                fetchAccounts();
            } else if (response && response.message) {
                setSuccess(false);
                setTransactionMessage(response.message);
            } else {
                setSuccess(false);
                setTransactionMessage('Respuesta inesperada del servidor.');
            }
        } catch (error) {
            console.error("Error en handleSubmit de TransfersPage (catch):", error);
            setSuccess(false);
            setTransactionMessage(error.message || 'Ocurrió un error inesperado al procesar la transferencia.');
        }
    };

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-[#163a5d] px-8 py-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            Transferencia Bancaria
                        </h1>
                        <p className="text-blue-100 mt-2">Transfiere dinero de forma rápida y segura</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Cuenta de Origen
                            </label>
                            <div className="space-y-2">
                                {isFetchingAccounts ? (
                                    <p className="text-gray-600">Cargando cuentas...</p>
                                ) : accounts.length === 0 ? (
                                    <p className="text-gray-600">No tienes cuentas disponibles.</p>
                                ) : (
                                    accounts.map((account) => (
                                        <div key={account._id} className="relative">
                                            <input
                                                type="radio"
                                                id={`from-${account.noAccount}`}
                                                name="fromAccount"
                                                value={account.noAccount}
                                                checked={formData.fromAccount === account.noAccount}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor={`from-${account.noAccount}`}
                                                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    formData.fromAccount === account.noAccount
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-mono text-sm font-semibold">{account.noAccount}</div>
                                                        <div className="text-xs text-gray-600">{account.type}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            {formatCurrency(account.amount, account.currency)}
                                                        </div>
                                                        <div className="text-xs text-gray-600">Saldo disponible</div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                            {errors.fromAccount && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    {errors.fromAccount}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <div className="bg-blue-100 rounded-full p-3">
                                &#x2193;
                            </div>
                        </div>

                        <div>
                            <label htmlFor="toAccount" className="block text-sm font-semibold text-gray-700 mb-2">
                                Cuenta de Destino
                            </label>
                            <input
                                type="text"
                                id="toAccount"
                                name="toAccount"
                                value={formData.toAccount}
                                onChange={handleInputChange}
                                placeholder="Ingresa el número de cuenta de destino"
                                className={`w-full px-4 py-3 rounded-lg border-2 font-mono transition-colors ${
                                    errors.toAccount
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-blue-500'
                                } focus:outline-none`}
                            />
                            {errors.toAccount && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    {errors.toAccount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                Monto a Transferir
                            </label>
                            <div className="relative">
                                <label className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    $
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors ${
                                        errors.amount
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                    } focus:outline-none`}
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    {errors.amount}
                                </p>
                            )}
                        </div>

                        {transactionMessage && (
                            <div className={`p-3 rounded-lg text-center font-medium ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {transactionMessage}
                                {success && transactionDetails && (
                                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Monto Transcurrido:</span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(transactionDetails.amount, accounts.find(acc => acc.noAccount === transactionDetails.from)?.currency || 'GTQ')}
                                            </span>
                                        </div>
                                        {transactionDetails.convertedAmount && transactionDetails.convertedTo && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Monto Recibido:</span>
                                                <span className="font-semibold text-lg">
                                                    {formatCurrency(transactionDetails.convertedAmount, transactionDetails.convertedTo)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Desde Cuenta:</span>
                                            <span className="font-mono text-sm">{transactionDetails.from}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Hacia Cuenta:</span>
                                            <span className="font-mono text-sm">{transactionDetails.to}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isAddingTransaction || Object.keys(errors).length > 0}
                            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                                isAddingTransaction || Object.keys(errors).length > 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#163a5d] hover:bg-[#165a5d] transform hover:scale-[1.02]'
                            } shadow-lg`}
                        >
                            {isAddingTransaction ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Procesando transferencia...
                                </div>
                            ) : (
                                'Realizar Transferencia'
                            )}
                        </button>
                        {errors.general && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                {errors.general}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};