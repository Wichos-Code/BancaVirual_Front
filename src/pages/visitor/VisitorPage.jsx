import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import VisitorImage from "../../assets/img/VisitorImage.jpeg";

export const VisitorPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/bancavirtual/acceso");
  };

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800 flex flex-col">
      <motion.section
        className="relative w-full bg-[#163A5D] text-white overflow-hidden flex flex-col-reverse md:flex-row items-center justify-center px-6 py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="z-10 max-w-xl text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Bienvenido a Banca Virtual
          </h1>
          <p className="text-base md:text-lg mb-6">
            Accede a todos tus servicios financieros sin salir de casa:
            consulta saldos, realiza transferencias, paga tus servicios y mucho más.
          </p>
          <button
            className="bg-yellow-200 hover:bg-yellow-400 text-[#163A5D] font-semibold text-base md:text-lg px-8 py-3 rounded-lg transition-colors shadow-md"
            onClick={handleLogin}
          >
            Comenzar
          </button>
        </motion.div>

        <motion.div
          className="mb-8 md:mb-0 md:ml-12 flex-shrink-0"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-56 h-56 md:w-80 md:h-80 bg-white rounded-full shadow-lg overflow-hidden flex items-center justify-center">
            <img
              src={VisitorImage}
              alt="Banco Virtual"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </motion.section>

      <main className="flex-grow bg-gray-50 py-16 px-6 md:px-12 lg:px-20">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
        <h2 className="text-2xl md:text-3xl font-semibold text-[#163A5D] text-center mb-10">
          Nuestros Servicios
        </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div
            className="group bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-[#163A5D] text-white rounded-full flex items-center justify-center text-2xl">
                🏦
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Abrir Cuenta
            </h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Crea tu cuenta bancaria en línea en pocos minutos.
              ¡Comienza a ahorrar hoy mismo!
            </p>
          </motion.div>

          <motion.div
            className="group bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-200 text-[#00A0A3] rounded-full flex items-center justify-center text-2xl">
                🔁
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Transferencias
            </h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Envía dinero a otras cuentas en el banco o a otros bancos
              de forma inmediata y segura.
            </p>
          </motion.div>

          <motion.div
            className="group bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-[#163A5D] text-white rounded-full flex items-center justify-center text-2xl">
                💡
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Pagos de Servicios
            </h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Paga luz, agua, teléfono y más desde un único lugar.
              Controla tus vencimientos con notificaciones.
            </p>
          </motion.div>

          <motion.div
            className="group bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-200 text-[#00A0A3] rounded-full flex items-center justify-center text-2xl">
                📄
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
              Consultas & Estados
            </h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Revisa tus estados de cuenta, movimientos recientes y
              descarga tus comprobantes cuando lo necesites.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Banco Virtual Desarrollado por ByteForce. Todos los derechos reservados.</p>
        <p className="mt-1">
          <a href="#" className="underline hover:text-gray-700">Términos y Condiciones</a> ·{" "}
          <a href="#" className="underline hover:text-gray-700">Política de Privacidad</a>
        </p>
      </footer>
    </div>
  );
};
