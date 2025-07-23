import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "../Spinner.jsx";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; 

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const buttonVariants = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.05 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

export const UserModal = ({ isOpen, onClose, onSubmit, isLoading, initialData = null }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    dpi: "",
    phone: "",
    direction: "",
    workName: "",
    income: "",
    role: "CLIENT_ROLE",
  });
  const [passwordRequired, setPasswordRequired] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        name: initialData.name || "",
        surname: initialData.surname || "",
        email: initialData.email || "",
        password: "",
        dpi: initialData.dpi || "",
        phone: initialData.phone || "",
        direction: initialData.direction || "",
        workName: initialData.workName || "",
        income: initialData.income || "",
        role: initialData.role || "CLIENT_ROLE",
      });
      setPasswordRequired(false);
    } else {
      setFormData({
        username: "",
        name: "",
        surname: "",
        email: "",
        password: "",
        dpi: "",
        phone: "",
        direction: "",
        workName: "",
        income: "",
        role: "CLIENT_ROLE",
      });
      setPasswordRequired(true);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (dataToSend.income) {
        dataToSend.income = parseFloat(dataToSend.income);
    }
    if (!passwordRequired) {
      delete dataToSend.password;
    }
    onSubmit(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              {initialData ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombres
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={25}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    maxLength={25}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="dpi" className="block text-sm font-medium text-gray-700">
                    DPI
                  </label>
                  <input
                    type="number"
                    id="dpi"
                    name="dpi"
                    value={formData.dpi}
                    onChange={handleChange}
                    required
                    disabled={!!initialData}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="8"
                    minLength="8"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direction"
                    name="direction"
                    value={formData.direction}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="workName" className="block text-sm font-medium text-gray-700">
                    Trabajo
                  </label>
                  <input
                    type="text"
                    id="workName"
                    name="workName"
                    value={formData.workName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="income" className="block text-sm font-medium text-gray-700">
                    Ingresos Mensuales
                  </label>
                  <input
                    type="number"
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    required
                    min="100"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {!initialData && (
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={passwordRequired}
                      minLength="8"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  </div>
                )}
                {(!initialData || (initialData && initialData.role !== "ADMIN_ROLE")) && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Rol
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="CLIENT_ROLE">Cliente</option>
                      <option value="SUPERVISOR_ROLE">Supervisor</option>
                    </select>
                  </div>
                )}
                {initialData && initialData.role === "ADMIN_ROLE" && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Rol
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      disabled
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">No se puede cambiar el rol de un administrador.</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  type="button"
                  onClick={onClose}
                  variants={buttonVariants}
                  whileTap="whileTap"
                  whileHover="whileHover"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                  disabled={isLoading}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileTap="whileTap"
                  whileHover="whileHover"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner className="h-5 w-5 text-white" /> : (initialData ? "Guardar Cambios" : "Crear Usuario")}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};