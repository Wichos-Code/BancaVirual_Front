import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
import { useVerifyEmail } from "../../shared/hooks/useVerifyEmail";
import toast from "react-hot-toast";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verify, isLoading } = useVerifyEmail();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); 

  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[idx] = val;
    setDigits(newDigits);

    if (val && idx < 5) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && digits[idx] === "") {
      if (idx > 0) {
        inputsRef.current[idx - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) return;

    setStatus("loading");
    const ok = await verify(code);
    setStatus(ok ? "success" : "error");
  };

  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => {
        navigate("/bancavirtual/acceso");
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate]);

  if (status === "success") {
    return (
      <motion.div
          style={{ backgroundSize: "200% 200%" }}
          className="min-h-screen flex flex-col items-center justify-center px-4
                     bg-gradient-to-br from-[#bcddff] to-[#61a3ff]"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
        <div className="bg-[#163a5d] p-8 rounded-2xl shadow-lg max-w-md w-full text-center text-white">
          <p className="text-lg font-semibold">
            ¡Verificación exitosa!
          </p>
        </div>
      </motion.div>
    );
  }

  if (status === "loading" || isLoading) {
    return (
      <motion.div
          style={{ backgroundSize: "200% 200%" }}
          className="min-h-screen flex flex-col items-center justify-center px-4
                     bg-gradient-to-br from-[#bcddff] to-[#61a3ff]"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          <p className="text-gray-600 text-lg">Verificando código…</p>
        </div>
      </motion.div>
    );
  }

  if (status === "error") {
    return (
      <motion.div
          style={{ backgroundSize: "200% 200%" }}
          className="min-h-screen flex flex-col items-center justify-center px-4
                     bg-gradient-to-br from-[#bcddff] to-[#61a3ff]"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
        <div className="bg-[#163a5d] p-8 rounded-2xl max-w-md w-full text-center text-white">
          <p className="text-red-500 font-semibold mb-6">
            El código ingresado es inválido o ha expirado.
          </p>
          <button
            className="w-60 py-3 mb-4 rounded-full bg-yellow-200 hover:opacity-90 text-[#163a5d] font-semibold transition"
            onClick={() => {
              setStatus("idle");
              setDigits(["", "", "", "", "", ""]);
              inputsRef.current[0].focus();
            }}
          >
            Intentar de nuevo
          </button>
          
          <button
            className="w-full mt-3 text-white hover:underline"
            onClick={() => navigate("/bancavirtual/acceso")}
          >
            Volver al inicio
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
          style={{ backgroundSize: "200% 200%" }}
          className="min-h-screen flex flex-col items-center justify-center px-4
                     bg-gradient-to-br from-[#bcddff] to-[#61a3ff]"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
      <div className="bg-[#163a5d] p-8 rounded-2xl shadow-lg max-w-md w-full text-center text-white">
        <h2 className="font-bold text-2xl mb-4">Escriba su código</h2>
        <p className="text-gray-200 mb-6">
          Escriba el código que enviamos a su correo electrónico.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[idx]}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="
                  w-10 h-12
                  text-center text-2xl
                  border-b-2 border-gray-300
                  focus:border-yellow-200 focus:outline-none
                "
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={digits.some((d) => d === "")}
            className={`
              w-60 
              py-3 
              rounded-full 
              text-[#163a5d]
              ${digits.every((d) => d !== "")
                ? "bg-yellow-200 hover:opacity-90"
                : "bg-gray-300"}
              font-semibold transition
            `}
            style={{
              cursor: digits.every((d) => d !== "") ? "pointer" : "default"
            }}
          >
            Verificar
          </button>
        </form>

        <button
          className="mt-6 text-white hover:underline"
          onClick={() => navigate("/bancavirtual/acceso")}
        >
          Cancelar y volver
        </button>
      </div>
    </motion.div>
  );
};
