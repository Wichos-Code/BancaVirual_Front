import React, { useState, useEffect } from 'react'
import { useAddDeposit } from '../../shared/hooks/useAddDeposit';

export const DepositPage = () => {
  const { addDeposit } = useAddDeposit();
  
  const [formData, setFormData] = useState({fromAccount: '', amount: ''})

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.fromAccount) newErrors.fromAccount = 'Selecciona una cuenta de origen'
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Ingresa un amount válido'
    return newErrors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    console.log('Input changed:', name, value)
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
      console.log(formData);

      e.preventDefault();
      const validationErrors = validate()
      setErrors(validationErrors)
      if (Object.keys(validationErrors).length > 0) return
      await addDeposit(formData);
      setFormData({fromAccount: '', amount: ''});
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Deposito Exitoso!</h2>
            <p className="text-gray-600">Tu deposito ha sido procesada correctamente.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">amount:</span>
              <span className="font-semibold text-lg">${parseFloat(formData.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Desde:</span>
              <span className="font-mono text-sm">{formData.accountOrigin}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Transferencia Bancaria
            </h1>
            <p className="text-blue-100 mt-2">Deposita dinero de forma rápida y segura</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex justify-center">
              <div className="bg-blue-100 rounded-full p-3">
              </div>
            </div>

            <div>
              <label htmlFor="accountDestino" className="block text-sm font-semibold text-gray-700 mb-2">
                Cuenta de Destino
              </label>
              <input
                type="text"
                id="fromAccount"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleInputChange}
                placeholder="Ingresa el número de cuenta de destino"
                className={`w-full px-4 py-3 rounded-lg border-2 font-mono transition-colors ${
                  errors.fromAccount 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none`}
              />
              {errors.fromAccount && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  {errors.fromAccount}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                amount a Transferir
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

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02]'
              } shadow-lg`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando deposito...
                </div>
              ) : (
                'Realizar Deposito'
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
  )
}
