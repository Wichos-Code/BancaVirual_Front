import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUsers } from "../../shared/hooks/useUsers.jsx";
import { useDeleteUser } from "../../shared/hooks/useDeleteUser.jsx";
import { useCreateUser } from "../../shared/hooks/useCreateUser.jsx";
import { useUpdateUser } from "../../shared/hooks/userUpdateUser.jsx";
import { Spinner } from "../Spinner.jsx";
import { UserModal } from "./UserModal.jsx";
import toast from "react-hot-toast";

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const buttonVariants = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.05 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

export const UsersList = () => {
  const { users, total, loading, error, refetch } = useUsers();
  const { deleteUser, loading: deleting } = useDeleteUser();
  const { createNewUser, loading: creating } = useCreateUser();
  const { updateExistingUser, loading: updating } = useUpdateUser();

  const [showSpinner, setShowSpinner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    if (loading || deleting || creating || updating) {
      setShowSpinner(true);
    } else {
      const t = setTimeout(() => setShowSpinner(false), 500);
      return () => clearTimeout(t);
    }
  }, [loading, deleting, creating, updating]);

  const handleDelete = async (dpi, role) => {
    if (role === "ADMIN_ROLE") {
      toast.error("No puedes eliminar un usuario administrador.");
      return;
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede revertir.")) {
      return;
    }

    const result = await deleteUser(dpi);
    if (result?.success) {
      toast.success("Usuario eliminado correctamente.");
      refetch();
    } else {
      const errorMessage = result?.e?.response?.data?.message || "Error al eliminar el usuario.";
      toast.error(errorMessage);
    }
  };

  const handleAddUserClick = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditUserClick = (user) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

   const handleFormSubmit = async (formData) => {
    if (userToEdit) {
      const dataToSend = {
        name: formData.name,
        surname: formData.surname,
        direction: formData.direction,
        workName: formData.workName,
        income: formData.income,
        phone: formData.phone,
        role: userToEdit.role === "ADMIN_ROLE" ? undefined : formData.role,
      };

      if (dataToSend.phone === "") {
        delete dataToSend.phone;
      }

      if (dataToSend.income === "") {
        delete dataToSend.income;
      }
      if (typeof dataToSend.income === 'string' && dataToSend.income !== '') {
        dataToSend.income = parseFloat(dataToSend.income);
      }
      const result = await updateExistingUser(userToEdit.dpi, dataToSend);
      if (result?.success) {
        toast.success("Usuario actualizado correctamente.");
        refetch();
        handleCloseModal();
      } else {
        toast.error(result?.message || "Error al actualizar el usuario.");
      }
    } else {
      const result = await createNewUser(formData);
      if (result?.success) {
        toast.success("Usuario creado correctamente.");
        refetch();
        handleCloseModal();
      } else {
        toast.error(result?.message || "Error al crear el usuario.");
      }
    }
  };

  if (showSpinner) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 font-semibold mt-10 p-4 bg-red-50 rounded-lg shadow-sm mx-auto max-w-lg">
        Error al cargar usuarios: {error}
      </p>
    );
  }

  if (!users || users.length === 0) {
    return (
      <motion.div
        className="text-center text-gray-500 mt-10 p-4 bg-white rounded-lg shadow-sm mx-auto max-w-lg flex flex-col items-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <p className="mb-4">No hay usuarios registrados en la plataforma.</p>
        <motion.button
          onClick={handleAddUserClick}
          variants={buttonVariants}
          whileTap="whileTap"
          whileHover="whileHover"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Agregar Usuario
        </motion.button>
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          isLoading={creating || updating}
          initialData={userToEdit}
        />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto px-4 py-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex justify-between items-center mb-6 border-b-2 border-white pb-2">
          <motion.h2
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } }}
          >
            Gestión de Usuarios
          </motion.h2>
          <motion.button
            onClick={handleAddUserClick}
            variants={buttonVariants}
            whileTap="whileTap"
            whileHover="whileHover"
            className="px-4 py-2 bg-yellow-200 
            hover:bg-yellow-300  font-semibold
            text-yellow-700 rounded-md hover:bg-blue-700 transition"
          >
            Agregar Usuario
          </motion.button>
        </div>

        <motion.p
          className="text-white mb-4 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }}
        >
          Total de usuarios: <span className="font-bold text-white">{total}</span>
        </motion.p>

        <div className="overflow-x-auto rounded-lg shadow-lg no-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-yellow-200 text-black">
              <tr>
                {[
                  "Estado",
                  "Usuario",
                  "Nombres",
                  "Apellidos",
                  "DPI",
                  "Email",
                  "Teléfono",
                  "Rol",
                  "Dirección",
                  "Trabajo",
                  "Ingresos",
                  "Acción",
                ].map((th) => (
                  <th
                    key={th}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user.dpi}
                    className="text-gray-700"
                    layout
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {user.status ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user.username}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user.surname}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">{user.dpi}</td>
                    <td className="px-4 py-3 text-sm overflow-hidden text-ellipsis max-w-[200px]">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user.phone || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-700">{user.role}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user.direction || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user.workName || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">
                      {user.income ? `Q${user.income.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm flex gap-2">
                      <motion.button
                        onClick={() => handleEditUserClick(user)}
                        disabled={updating || user.role === "ADMIN_ROLE"}
                        variants={buttonVariants}
                        whileTap="whileTap"
                        whileHover="whileHover"
                        className={`
                          px-3 py-1.5 text-sm rounded-md transition duration-200 ease-in-out
                          ${
                            updating || user.role === "ADMIN_ROLE"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "text-white bg-[#163a5d]"
                          }
                        `}
                      >
                        {updating ? "Editando..." : "Editar"}
                      </motion.button>

                      <motion.button
                        onClick={() => handleDelete(user.dpi, user.role)}
                        disabled={deleting || user.role === "ADMIN_ROLE"}
                        variants={buttonVariants}
                        whileTap="whileTap"
                        whileHover="whileHover"
                        className={`
                          px-3 py-1.5 text-sm rounded-md transition duration-200 ease-in-out
                          ${
                            deleting || user.role === "ADMIN_ROLE"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          }
                        `}
                      >
                        {deleting ? "Eliminando..." : "Eliminar"}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isLoading={creating || updating}
        initialData={userToEdit}
      />
    </AnimatePresence>
  );
};