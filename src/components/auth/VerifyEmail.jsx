import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useVerifyEmail } from "../../shared/hooks/useVerifyEmail";
import fondo from "../../assets/img/FondoBF.png";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verify, isLoading } = useVerifyEmail();

  const [digits, setDigits] = useState(Array(6).fill(""));
  const [status, setStatus] = useState("idle");
  const inputsRef = useRef([]);

  const handleVerify = useCallback(
    async (code) => {
      setStatus("loading");
      await new Promise((r) => setTimeout(r, 500));
      const ok = await verify(code);
      setStatus(ok ? "success" : "error");
    },
    [verify]
  );

  const handleChange = useCallback(
    (e, idx) => {
      const val = e.target.value;
      if (!/^[0-9]?$/.test(val)) return;

      const newDigits = [...digits];
      newDigits[idx] = val;
      setDigits(newDigits);

      if (val && idx < 5) {
        inputsRef.current[idx + 1]?.focus();
      }

      if (newDigits.every((d) => d !== "") && status === "idle") {
        setTimeout(() => handleVerify(newDigits.join("")), 100);
      }
    },
    [digits, status, handleVerify]
  );

  const handleKeyDown = useCallback(
    (e, idx) => {
      if (e.key === "Backspace" && digits[idx] === "" && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    },
    [digits]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify(digits.join(""));
  };

  useEffect(() => {
    if (status === "idle") {
      inputsRef.current[0]?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => navigate("/bancavirtual/acceso"), 2000);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 15 } },
  };
  const buttonVariants = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const effectiveStatus = isLoading ? "loading" : status;
  let content, bgColor = "bg-white", textColor = "text-[#163a5d]";

  switch (effectiveStatus) {
    case "loading":
      content = (
        <motion.div variants={contentVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center">
          <p className="text-gray-600 mb-2">Verificando código…</p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 border-t-yellow-200 rounded-full"
          />
        </motion.div>
      );
      break;
    case "success":
      textColor = "text-green-600";
      content = (
        <motion.div variants={contentVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center">
          <p className="text-lg font-semibold">¡Verificación exitosa!</p>
          <p className="text-sm text-gray-500 mt-2">Redirigiendo al inicio de sesión...</p>
        </motion.div>
      );
      break;
    case "error":
      textColor = "text-red-400";
      content = (
        <motion.div variants={contentVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center">
          <p className="font-semibold mb-4">Código inválido o expirado</p>
          <motion.button
            className="w-full py-2 rounded-lg bg-yellow-200 text-[#163a5d] font-semibold mb-4"
            onClick={() => {
              setStatus("idle");
              setDigits(Array(6).fill(""));
            }}
            variants={buttonVariants}
            whileTap="whileTap"
            whileHover="whileHover"
          >
            Intentar de nuevo
          </motion.button>
          <button className="text-sm underline" onClick={() => navigate("/bancavirtual/acceso")}>
            Volver al inicio
          </button>
        </motion.div>
      );
      break;
    default:
      const canSubmit = digits.every((d) => d !== "") && !isLoading;
      content = (
        <motion.div variants={contentVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Verifica tu cuenta</h2>
          <p className="mb-6">Ingresa el código de 6 dígitos que enviamos a tu correo.</p>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex justify-center space-x-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputsRef.current[i] = el)}
                  className="w-12 h-14 text-center text-2xl font-bold border rounded focus:outline-none"
                />
              ))}
            </div>
            <motion.button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-2 rounded-lg font-semibold ${canSubmit ? "bg-yellow-200 text-[#163a5d]" : "bg-gray-300 text-gray-500"}`}
              style={{ cursor: canSubmit ? "pointer" : "default" }}
              variants={buttonVariants}
              whileTap="whileTap"
              whileHover="whileHover"
            >
              Verificar
            </motion.button>
          </form>
          <button className="mt-4 text-sm underline" onClick={() => navigate("/bancavirtual/acceso")}>
            Cancelar
          </button>
        </motion.div>
      );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <motion.div
        className={`${bgColor} p-6 rounded-2xl shadow-lg max-w-md w-full text-center ${textColor}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">{content}</AnimatePresence>
      </motion.div>
    </div>
  );
};
