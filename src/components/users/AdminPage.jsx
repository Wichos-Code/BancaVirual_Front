import React, { useState, useEffect, useCallback } from 'react';
import { useMostActiveAccounts } from '../../shared/hooks/useMostActiveAccounts';
import { useAccountDetailsForAdmin } from '../../shared/hooks/useAccountDetailsForAdmin';
import { useReverseDeposit } from '../../shared/hooks/useReverseDeposit';
import { getUsers } from '../../services/api';

const formatCurrency = (amount, currency = 'GTQ') => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const MostActiveAccountsDisplay = () => {
    const { accounts, loading, error, refetch } = useMostActiveAccounts();

    if (loading) return (
        <div className="flex items-center justify-center p-6 mb-4 bg-white rounded-xl shadow-md">
            <div className="spinner-border text-blue-500 animate-spin mr-3" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-gray-600">Cargando cuentas con más movimientos...</p>
        </div>
    );
    if (error) return (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg shadow-md flex items-center">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i>
            <span>Error al cargar cuentas activas: {error}</span>
        </div>
    );
    if (!accounts || accounts.length === 0) return (
        <div className="p-4 mb-4 text-blue-700 bg-blue-100 rounded-lg shadow-md flex items-center">
            <i className="bi bi-info-circle-fill mr-2"></i>
            <span>No hay cuentas con movimientos para mostrar.</span>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                <i className="bi bi-graph-up mr-3"></i> Cuentas con Más Movimientos
            </h3>
            <p className="text-gray-600 mb-6">Estas son las cuentas con mayor actividad transaccional.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold rounded-tl-lg">No. Cuenta</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Propietario</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Movimiento Total</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold">Saldo Actual</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold rounded-tr-lg">Moneda</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.noAccount} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-800">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {account.noAccount}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-800">
                                    {account.ownerName} (<span className="text-gray-500 text-xs">{account.ownerUsername}</span>)
                                </td>
                                <td className="py-3 px-4 text-sm text-green-600 font-semibold">
                                    {formatCurrency(account.totalMovement, account.currency)}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-800">
                                    {formatCurrency(account.currentBalance, account.currency)}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-800">{account.currency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AccountDetailsSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('accountId');
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [userAccounts, setUserAccounts] = useState([]);
    const [searchFeedback, setSearchFeedback] = useState('');
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);

    const { accountDetails, loading: detailsLoading, error: detailsError, refetch: refetchAccountDetails } = useAccountDetailsForAdmin(selectedAccountId);



const handleSearch = async () => {
    setSearchFeedback('');
    setSelectedAccountId(null);
    setUserAccounts([]);

    if (!searchTerm.trim()) {
        setSearchFeedback('Por favor, ingresa un término de búsqueda.');
        return;
    }

    if (searchType === 'accountId') {
        setSelectedAccountId(searchTerm.trim());
    } else {
        setIsSearchingUsers(true);
        try {
            const apiResponseAxios = await getUsers();
            const apiResponseData = apiResponseAxios.data;


            if (apiResponseData && apiResponseData.message === 'Usuarios obtenidos con exito' && Array.isArray(apiResponseData.user)) {
                const users = apiResponseData.user;

                let foundUser = null;
                if (searchType === 'dpi') {
                    foundUser = users.find(u => String(u.dpi) === searchTerm.trim());
                } else if (searchType === 'username') {
                    foundUser = users.find(u => u.username === searchTerm.trim());
                }

                if (foundUser) {
                    if (foundUser.accounts && foundUser.accounts.length > 0) {
                        setUserAccounts(foundUser.accounts);
                        setSearchFeedback(`Usuario '${foundUser.username}' encontrado. Selecciona una cuenta para ver sus detalles.`);
                    } else {
                        setSearchFeedback(`Usuario '${foundUser.username}' encontrado, pero no tiene cuentas asociadas.`);
                    }
                } else {
                    setSearchFeedback(`No se encontró ningún usuario con el ${searchType} '${searchTerm}'.`);
                }
            } else {
                throw new Error(apiResponseData.message || 'La API no devolvió una lista de usuarios válida o con el formato esperado.');
            }

        } catch (err) {
            setSearchFeedback(`Error al buscar usuario: ${err.message}`);
            console.error("Error al buscar usuario por DPI/username:", err);
        } finally {
            setIsSearchingUsers(false);
        }
    }
};

    const handleSelectAccount = (accountId) => {
        setSelectedAccountId(accountId);
        setUserAccounts([]);
        setSearchFeedback('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setSearchFeedback('ID de transacción copiado al portapapeles!');
            setTimeout(() => setSearchFeedback(''), 2000);
        }).catch(err => {
            console.error('Error al copiar al portapapeles:', err);
            setSearchFeedback('Error al copiar el ID.');
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                <i className="bi bi-search mr-3"></i> Buscar Detalles de Cuenta
            </h3>
            <p className="text-gray-600 mb-6">Busca por ID de cuenta, DPI o nombre de usuario del propietario.</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                        setSearchTerm('');
                        setSelectedAccountId(null);
                        setUserAccounts([]);
                        setSearchFeedback('');
                    }}
                >
                    <option value="accountId">ID de Cuenta</option>
                    <option value="dpi">DPI del Propietario</option>
                    <option value="username">Nombre de Usuario del Propietario</option>
                </select>
                <input
                    type="text"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Ingresa el ${searchType === 'accountId' ? 'ID de la cuenta' : searchType === 'dpi' ? 'DPI del usuario' : 'nombre de usuario'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={handleSearch}
                    disabled={!searchTerm.trim() || isSearchingUsers || detailsLoading}
                >
                    {(isSearchingUsers || (searchType === 'accountId' && detailsLoading)) ? (
                        <>
                            <div className="spinner-border spinner-border-sm mr-2" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            Buscando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-search mr-2"></i> Buscar
                        </>
                    )}
                </button>
            </div>

            {searchFeedback && (
                <div className={`p-3 rounded-lg text-sm mb-4 ${searchFeedback.includes('Error') || searchFeedback.includes('No se encontró') || searchFeedback.includes('no tiene cuentas') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {searchFeedback}
                </div>
            )}

            {isSearchingUsers && searchType !== 'accountId' && (
                <div className="flex items-center justify-center p-6 mt-4 bg-white rounded-xl shadow-md">
                    <div className="spinner-border text-blue-500 animate-spin mr-3" role="status">
                        <span className="visually-hidden">Cargando usuarios...</span>
                    </div>
                    <p className="text-gray-600">Buscando usuarios...</p>
                </div>
            )}

            {userAccounts.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Cuentas del Usuario Encontrado:</h5>
                    <ul className="space-y-2">
                        {userAccounts.map(acc => (

                            <li key={acc._id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm border border-gray-200">
                                <span className="font-mono text-sm text-gray-700">No. Cuenta: {acc.noAccount} ({acc.currency})</span>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
                                    onClick={() => handleSelectAccount(acc._id)}
                                >
                                    Ver Detalles
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {detailsLoading && selectedAccountId && (
                <div className="flex items-center justify-center p-6 mt-4 bg-white rounded-xl shadow-md">
                    <div className="spinner-border text-blue-500 animate-spin mr-3" role="status">
                        <span className="visually-hidden">Cargando detalles...</span>
                    </div>
                    <p className="text-gray-600">Cargando detalles de la cuenta...</p>
                </div>
            )}
            {detailsError && selectedAccountId && (
                <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-lg shadow-md flex items-center">
                    <i className="bi bi-exclamation-triangle-fill mr-2"></i>
                    <span>Error al cargar detalles: {detailsError}</span>
                </div>
            )}

            {accountDetails && (
                <div className="mt-6 p-6 border border-gray-200 rounded-xl shadow-lg bg-gray-50">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i className="bi bi-info-circle mr-2 text-blue-600"></i> Detalles de la Cuenta: <span className="text-blue-700 ml-2">{accountDetails.noAccount}</span>
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <strong className="flex items-center"><i className="bi bi-person-fill mr-2 text-gray-500"></i>Propietario:</strong>
                            <span>{accountDetails.user?.name} (Usuario: {accountDetails.user?.username})</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <strong className="flex items-center"><i className="bi bi-envelope-fill mr-2 text-gray-500"></i>Email Propietario:</strong>
                            <span>{accountDetails.user?.email}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <strong className="flex items-center"><i className="bi bi-currency-dollar mr-2 text-gray-500"></i>Saldo Actual:</strong>
                            <span className="text-green-600 font-bold">{formatCurrency(accountDetails.amount, accountDetails.currency)}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <strong className="flex items-center">Tipo de Cuenta:</strong>
                            <span>{accountDetails.type}</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200">
                            <strong className="flex items-center">Estado:</strong>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${accountDetails.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {accountDetails.status ? 'Activa' : 'Inactiva'}
                            </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                            <strong className="flex items-center">Fecha Creación:</strong>
                            <span>{new Date(accountDetails.createdAt).toLocaleString()}</span>
                        </li>
                    </ul>

                    <h5 className="mt-6 text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i className="bi bi-clock-history mr-2 text-blue-600"></i> Últimos 5 Movimientos:
                    </h5>
                    {accountDetails.last5Movements && accountDetails.last5Movements.length > 0 ? (
                        <ul className="space-y-3">
                            {accountDetails.last5Movements.map((transaction) => (
                
                                <li key={transaction._id} className="p-4 bg-white rounded-md shadow-sm border border-gray-200 flex justify-between items-center">
                                    <div>
                                        <strong className="text-gray-900">{transaction.type}:</strong>{' '}
                                        <span className={`font-bold ${transaction.type === 'DEPOSIT' || (transaction.toAccount === accountDetails.noAccount && transaction.type === 'TRANSFER') ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(transaction.amount, transaction.currency)}
                                        </span>
                                        <br />
                                        <small className="text-gray-500">{new Date(transaction.createdAt).toLocaleString()}</small>
                                        <br />
                                        {transaction.fromAccount && <small className="text-gray-600">Origen: {transaction.fromAccount}</small>}
                                        {transaction.toAccount && <small className="text-gray-600"> Destino: {transaction.toAccount}</small>}
                                    </div>
                                    {transaction.type === 'DEPOSIT' && (
                                        <button
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors duration-200 flex items-center"
                                            title="Copiar ID para Revertir Depósito"
                                            onClick={() => copyToClipboard(transaction._id)}
                                        >
                                            <i className="bi bi-clipboard mr-1"></i> Copiar ID
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-gray-700 bg-gray-100 rounded-lg text-center">No hay movimientos recientes para esta cuenta.</div>
                    )}
                </div>
            )}
        </div>
    );
};

const ReverseDepositTool = ({ onDepositReversed }) => {
    const [transactionId, setTransactionId] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const { triggerReverseDeposit, isLoading, error, isSuccess, reversalResult } = useReverseDeposit();

    const handleReverse = async () => {
        setFeedbackMessage('');
        if (!transactionId.trim()) {
            setFeedbackMessage('Por favor, ingresa un ID de transacción.');
            return;
        }

        const result = await triggerReverseDeposit(transactionId);
        if (result.success) {
            setFeedbackMessage(`Depósito revertido exitosamente! Nuevo saldo: ${formatCurrency(result.data.updatedAccountBalance, result.data.currency)}`);
            setTransactionId('');
            if (onDepositReversed) {
                onDepositReversed();
            }
        } else {
            setFeedbackMessage(`Error al revertir: ${result.message || 'Desconocido'}`);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                <i className="bi bi-arrow-counterclockwise mr-3"></i> Revertir Depósito
            </h3>
            <p className="text-gray-600 mb-6">Ingresa el ID de una transacción de depósito para revertirla (solo si no ha pasado más de 1 minuto).</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ID de la Transacción de Depósito"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                />
                <button
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={handleReverse}
                    disabled={isLoading || !transactionId.trim()}
                >
                    {isLoading ? (
                        <>
                            <div className="spinner-border spinner-border-sm mr-2" role="status">
                                <span className="visually-hidden">Revirtiendo...</span>
                            </div>
                            Revirtiendo...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-arrow-counterclockwise mr-2"></i> Revertir Depósito
                        </>
                    )}
                </button>
            </div>
            {feedbackMessage && (
                <div className={`p-3 rounded-lg text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedbackMessage}
                </div>
            )}
            {error && <div className="p-3 text-red-700 bg-red-100 rounded-lg text-sm mt-2">Error del sistema: {error}</div>}
        </div>
    );
};

export const AdminPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleDepositReversed = useCallback(() => {
        setRefreshKey(prevKey => prevKey + 1);
    }, []);

    return (
        <div className="min-h-screen p-6 sm:p-10 font-sans">
            <h1 className="text-4xl font-extrabold text-white mb-6 text-center flex items-center justify-center">
                <i className="bi bi-bank mr-4 text-white"></i> Gestión de Cuentas Bancarias
            </h1>
            <p className="text-lg text-white mb-10 text-center max-w-3xl mx-auto">
                Desde aquí, como administrador, puedes supervisar y gestionar las cuentas de los usuarios de manera eficiente.
            </p>

            <div className="grid grid-cols-1 gap-6">
                <MostActiveAccountsDisplay key={`most-active-${refreshKey}`} />
            </div>
        </div>
    );
};