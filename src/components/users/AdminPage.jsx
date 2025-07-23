// src/pages/CuentasAdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useMostActiveAccounts } from '../../shared/hooks/useMostActiveAccounts';
import { useAccountDetailsForAdmin } from '../../shared/hooks/useAccountDetailsForAdmin';
import { useReverseDeposit } from '../../shared/hooks/useReverseDeposit';
import { getUsers } from '../../services/api'; // Importamos getUsers para buscar usuarios por DPI/username

// --- Componente para mostrar Cuentas Más Activas ---
const MostActiveAccountsDisplay = () => {
    const { accounts, loading, error } = useMostActiveAccounts();

    if (loading) return (
        <div className="card shadow-sm p-3 mb-4 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 text-muted">Cargando cuentas con más movimientos...</p>
        </div>
    );
    if (error) return <div className="alert alert-danger" role="alert">Error al cargar cuentas activas: {error}</div>;
    if (!accounts || accounts.length === 0) return <div className="alert alert-info" role="alert">No hay cuentas con movimientos para mostrar.</div>;

    return (
        <div className="card shadow-sm p-4 mb-4 bg-white rounded">
            <h3 className="card-title text-primary mb-3">
                <i className="bi bi-graph-up me-2"></i> Cuentas con Más Movimientos
            </h3>
            <p className="card-subtitle text-muted mb-4">Estas son las cuentas con mayor actividad transaccional.</p>
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>No. Cuenta</th>
                            <th>Propietario</th>
                            <th>Movimiento Total</th>
                            <th>Saldo Actual</th>
                            <th>Moneda</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.noAccount}>
                                <td><span className="badge bg-secondary">{account.noAccount}</span></td>
                                <td>{account.ownerName} (<small className="text-muted">{account.ownerUsername}</small>)</td>
                                <td><span className="fw-bold text-success">{account.totalMovement.toFixed(2)}</span></td>
                                <td>{account.currentBalance.toFixed(2)}</td>
                                <td>{account.currency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Componente para buscar y mostrar Detalles de Cuenta ---
const AccountDetailsSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('accountId'); // 'accountId', 'dpi', 'username'
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [userAccounts, setUserAccounts] = useState([]); // Para guardar las cuentas de un usuario encontrado
    const [searchFeedback, setSearchFeedback] = useState('');

    const { accountDetails, loading, error } = useAccountDetailsForAdmin(selectedAccountId);

    const handleSearch = async () => {
        setSearchFeedback('');
        setSelectedAccountId(null); // Resetear el ID de cuenta seleccionada
        setUserAccounts([]); // Resetear las cuentas del usuario

        if (!searchTerm.trim()) {
            setSearchFeedback('Por favor, ingresa un término de búsqueda.');
            return;
        }

        if (searchType === 'accountId') {
            setSelectedAccountId(searchTerm.trim());
        } else {
            // Lógica para buscar por DPI o Username
            try {
                // Asumo que getUsers() devuelve una lista de usuarios y podemos filtrar en el frontend
                // O idealmente, tendrías una ruta en el backend para buscar usuarios por DPI/username.
                // Si no tienes una ruta específica, esta es una forma de hacerlo (menos eficiente para muchos usuarios)
                const response = await getUsers();
                if (response.error) {
                    throw new Error(response.e?.response?.data?.message || 'Error al obtener usuarios');
                }
                const users = response.data.users; // Asumo que response.data.users contiene la lista de usuarios

                let foundUser = null;
                if (searchType === 'dpi') {
                    foundUser = users.find(u => u.DPI === searchTerm.trim());
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

            } catch (err) {
                setSearchFeedback(`Error al buscar usuario: ${err.message}`);
                console.error("Error al buscar usuario por DPI/username:", err);
            }
        }
    };

    const handleSelectAccount = (accountId) => {
        setSelectedAccountId(accountId);
        setUserAccounts([]); // Ocultar la lista de cuentas una vez que se selecciona una
    };

    return (
        <div className="card shadow-sm p-4 mb-4 bg-white rounded">
            <h3 className="card-title text-primary mb-3">
                <i className="bi bi-search me-2"></i> Buscar Detalles de Cuenta
            </h3>
            <p className="card-subtitle text-muted mb-3">Busca por ID de cuenta, DPI o nombre de usuario del propietario.</p>

            <div className="input-group mb-3">
                <select
                    className="form-select"
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                        setSearchTerm(''); // Limpiar término al cambiar tipo de búsqueda
                        setSelectedAccountId(null); // Resetear cuenta seleccionada
                        setUserAccounts([]); // Resetear cuentas de usuario
                        setSearchFeedback('');
                    }}
                >
                    <option value="accountId">ID de Cuenta</option>
                    <option value="dpi">DPI del Propietario</option>
                    <option value="username">Nombre de Usuario del Propietario</option>
                </select>
                <input
                    type="text"
                    className="form-control"
                    placeholder={`Ingresa el ${searchType === 'accountId' ? 'ID de la cuenta' : searchType === 'dpi' ? 'DPI del usuario' : 'nombre de usuario'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    disabled={!searchTerm.trim()}
                >
                    <i className="bi bi-search me-1"></i> Buscar
                </button>
            </div>

            {searchFeedback && (
                <div className={`alert ${searchFeedback.includes('Error') || searchFeedback.includes('No se encontró') ? 'alert-warning' : 'alert-info'} mt-2`}>
                    {searchFeedback}
                </div>
            )}

            {userAccounts.length > 0 && (
                <div className="mt-3 card card-body bg-light">
                    <h5>Cuentas del Usuario Encontrado:</h5>
                    <ul className="list-group">
                        {userAccounts.map(acc => (
                            <li key={acc._id} className="list-group-item d-flex justify-content-between align-items-center">
                                No. Cuenta: {acc.noAccount} ({acc.currency})
                                <button className="btn btn-sm btn-outline-info" onClick={() => handleSelectAccount(acc._id)}>
                                    Ver Detalles
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {loading && selectedAccountId && (
                <div className="text-center mt-3">
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Cargando detalles...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando detalles de la cuenta...</p>
                </div>
            )}
            {error && selectedAccountId && <div className="alert alert-danger mt-3" role="alert">Error al cargar detalles: {error}</div>}

            {accountDetails && (
                <div className="mt-4 p-3 border rounded shadow-sm bg-light">
                    <h4 className="text-secondary mb-3">
                        <i className="bi bi-info-circle me-2"></i> Detalles de la Cuenta: <span className="text-dark fw-bold">{accountDetails.noAccount}</span>
                    </h4>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Propietario:</strong> {accountDetails.user?.name} (Usuario: {accountDetails.user?.username})</li>
                        <li className="list-group-item"><strong>Email Propietario:</strong> {accountDetails.user?.email}</li>
                        <li className="list-group-item"><strong>Saldo Actual:</strong> <span className="text-success fw-bold">{accountDetails.amount.toFixed(2)} {accountDetails.currency}</span></li>
                        <li className="list-group-item"><strong>Tipo de Cuenta:</strong> {accountDetails.type}</li>
                        <li className="list-group-item"><strong>Estado:</strong> <span className={`badge bg-${accountDetails.status ? 'success' : 'danger'}`}>{accountDetails.status ? 'Activa' : 'Inactiva'}</span></li>
                        <li className="list-group-item"><strong>Fecha Creación:</strong> {new Date(accountDetails.createdAt).toLocaleString()}</li>
                    </ul>

                    <h5 className="mt-4 text-secondary">
                        <i className="bi bi-clock-history me-2"></i> Últimos 5 Movimientos:
                    </h5>
                    {accountDetails.last5Movements && accountDetails.last5Movements.length > 0 ? (
                        <ul className="list-group">
                            {accountDetails.last5Movements.map((transaction) => (
                                <li key={transaction._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{transaction.type}:</strong> <span className={`fw-bold ${transaction.type === 'DEPOSIT' || (transaction.toAccount === accountDetails.noAccount && transaction.type === 'TRANSFER') ? 'text-success' : 'text-danger'}`}>{transaction.amount.toFixed(2)} {transaction.currency}</span>
                                        <br />
                                        <small className="text-muted">{new Date(transaction.createdAt).toLocaleString()}</small>
                                        <br />
                                        {transaction.fromAccount && <small>Origen: {transaction.fromAccount}</small>}
                                        {transaction.toAccount && <small> Destino: {transaction.toAccount}</small>}
                                    </div>
                                    {transaction.type === 'DEPOSIT' && (
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            title="Revertir Depósito"
                                            onClick={() => { /* Lógica para pasar el ID a ReverseDepositTool */
                                                 // Aquí podrías usar un contexto o pasar una prop para comunicar al ReverseDepositTool
                                                 // Por simplicidad, podríamos directamente llamar a la API si fuera un caso aislado,
                                                 // pero lo ideal es que el ReversDepositTool sea un componente aparte que gestione su propia UI.
                                                 alert(`Puedes usar el ID de esta transacción (${transaction._id}) en la sección de "Revertir Depósito".`);
                                            }}
                                        >
                                            <i className="bi bi-arrow-counterclockwise"></i>
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="alert alert-light text-center mt-3">No hay movimientos recientes para esta cuenta.</div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Componente para Revertir Depósito ---
const ReverseDepositTool = () => {
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
            setFeedbackMessage('✅ Depósito revertido exitosamente! Nuevo saldo: ' + result.data.updatedAccountBalance.toFixed(2) + ' ' + result.data.currency);
            setTransactionId(''); // Limpiar campo
        } else {
            setFeedbackMessage(`❌ Error al revertir: ${result.error || 'Desconocido'}`);
        }
    };

    return (
        <div className="card shadow-sm p-4 bg-white rounded">
            <h3 className="card-title text-primary mb-3">
                <i className="bi bi-arrow-counterclockwise me-2"></i> Revertir Depósito
            </h3>
            <p className="card-subtitle text-muted mb-3">Ingresa el ID de una transacción de depósito para revertirla (solo si no ha pasado más de 1 minuto).</p>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="ID de la Transacción de Depósito"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                />
                <button
                    className="btn btn-warning"
                    onClick={handleReverse}
                    disabled={isLoading || !transactionId.trim()}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Revirtiendo...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-arrow-counterclockwise me-1"></i> Revertir Depósito
                        </>
                    )}
                </button>
            </div>
            {feedbackMessage && (
                <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} mt-2`}>
                    {feedbackMessage}
                </div>
            )}
            {error && <div className="alert alert-danger mt-2" role="alert">Error del sistema: {error}</div>}
        </div>
    );
};

// --- Componente principal de la página de Cuentas del Admin ---
export const AdminPage = () => {
    // Puedes añadir lógica para verificar el rol aquí si no lo haces en el router
    // const userDetails = JSON.parse(localStorage.getItem('user'));
    // const userRole = userDetails?.user?.role;
    // if (userRole !== "ADMIN_ROLE" && userRole !== "SUPERVISOR_ROLE") {
    //     return <p className="alert alert-danger">Acceso denegado. No tienes permisos para ver esta página.</p>;
    // }

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center text-primary fw-bold">
                <i className="bi bi-bank me-3"></i> Gestión de Cuentas Bancarias
            </h1>
            <p className="lead text-center text-muted mb-5">
                Desde aquí, como administrador, puedes supervisar y gestionar las cuentas de los usuarios de manera eficiente.
            </p>

            <div className="row">
                <div className="col-md-12">
                    <MostActiveAccountsDisplay />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-12">
                    <AccountDetailsSearch />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-12">
                    <ReverseDepositTool />
                </div>
            </div>

            {/* Puedes agregar más componentes o secciones aquí si es necesario */}
        </div>
    );
};