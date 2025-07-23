import React, { useState } from 'react';
import { useCreateAccount } from '../../shared/hooks/useCreateAccount';

export const CreateAccountForm = () => {
    const { registerAccount, isLoading } = useCreateAccount();
    const [form, setForm] = useState({
        searchTerm: '',
        searchType: 'username',
        amount: '',
        currency: 'GTQ',
        type: 'Savings'
    });
    const [message, setMessage] = useState('');
    const [isSuccessMessage, setIsSuccessMessage] = useState(false); // Nuevo estado para controlar el tipo de mensaje

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpia el mensaje anterior
        setIsSuccessMessage(false); // Restablece el estado del tipo de mensaje

        const dataToSend = {
            amount: parseFloat(form.amount),
            currency: form.currency,
            type: form.type,
        };

        if (form.searchType === 'username') {
            dataToSend.targetUsername = form.searchTerm.trim();
        } else if (form.searchType === 'dpi') {
            dataToSend.targetDPI = form.searchTerm.trim();
        }

        const response = await registerAccount(dataToSend);

        if (response.error) {
            setMessage(`Error: ${response.message || 'Error al crear la cuenta.'}`);
            setIsSuccessMessage(false); // Es un mensaje de error
        } else {
            setMessage(`Cuenta creada con éxito. Número de Cuenta: ${response.data.account.noAccount}`);
            setIsSuccessMessage(true); // Es un mensaje de éxito
            setForm({ // Limpia el formulario solo si es exitoso
                searchTerm: '',
                searchType: 'username',
                amount: '',
                currency: 'GTQ',
                type: 'Savings'
            });
        }
    };

    const monedas = [
        { value: 'USD', label: 'Dólar Estadounidense (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'GTQ', label: 'Quetzal Guatemalteco (GTQ)' },
        { value: 'MXN', label: 'Peso Mexicano (MXN)' },
        { value: 'COP', label: 'Peso Colombiano (COP)' },
        { value: 'ARS', label: 'Peso Argentino (ARS)' },
        { value: 'JPY', label: 'Yen Japonés (JPY)' },
        { value: 'GBP', label: 'Libra Esterlina (GBP)' }
    ];

    const tiposCuenta = [
        { value: 'Savings', label: 'Cuenta de Ahorros' },
        { value: 'Monetary', label: 'Cuenta monetaria' },
    ];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apertura de Nueva Cuenta</h1>
                        <p className="text-gray-600">Crear una cuenta para un cliente existente</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                Información del Cliente
                            </h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar Cliente por:
                                </label>
                                <select
                                    name="searchType"
                                    value={form.searchType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="username">Nombre de Usuario</option>
                                    <option value="dpi">DPI</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Término de Búsqueda:
                                </label>
                                <input
                                    type="text"
                                    name="searchTerm"
                                    value={form.searchTerm}
                                    onChange={handleChange}
                                    placeholder={`Ingresa el ${form.searchType === 'username' ? 'nombre de usuario' : 'DPI'}`}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                Detalles de la Nueva Cuenta
                            </h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monto Inicial:
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Moneda
                                    </label>
                                    <select
                                        name="currency"
                                        value={form.currency}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        {monedas.map(moneda => (
                                            <option key={moneda.value} value={moneda.value}>
                                                {moneda.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Cuenta
                                    </label>
                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        {tiposCuenta.map(tipo => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                className="bg-[#163a5d] hover:bg-[#164a5d] text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creando cuenta...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-lg text-center ${isSuccessMessage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};