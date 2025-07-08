import React, { useState } from 'react'
import { useCreateAccount } from '../../shared/hooks/useCreateAccount';

export const AccountsPage = () => {
  const { registerAccount, isLoading } = useCreateAccount();
  const [ form, setForm ] = useState({ currency: '', type: '' });

  const handleChange = (e) => {
      const { name, type, value, files } = e.target;

      if (type === "file") {
          setForm(prev => ({ ...prev, [name]: files[0] }));
      } else {
          setForm(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleSubmit = async (e) => {
      console.log(form);

      e.preventDefault();
      await registerAccount(form);
      setForm({ currency: '', type: '' });
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
    { value: 'Monetary', label: 'Cuenta Monetaria' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Banca</h1>
            <p className="text-gray-600">Apertura de Nueva Cuenta</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                Información de Cuenta
              </h2>
              
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
                    <option value="">Seleccionar moneda...</option>
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
                    <option value="">Seleccionar tipo...</option>
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
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}