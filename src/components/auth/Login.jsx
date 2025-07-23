import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '../Input';
import {
  validateEmail, validateEmailMessage,
  validatePassword, validatePasswordMessage,
  validateUsername, validateUsernameMessage
} from '../../shared/validators';
import { useLogin } from '../../shared/hooks/useLogin';

import { UserIcon, KeyIcon } from "@heroicons/react/24/outline";
import fondo from "../../assets/img/FondoBF.png";

export const Login = ({ switchAuthHandler }) => {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();
  const [status, setStatus] = useState('base'); // 'base', 'loading', 'success', 'error'

  const [form, setForm] = useState({
    identifier: { value: '', isValid: false, showError: false },
    password:   { value: '', isValid: false, showError: false },
  });

  // Efecto para la redirección después de un inicio de sesión exitoso
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        switch (userDetails?.role) {
          case "ADMIN_ROLE":
            navigate("/bancavirtual/usuarios");
            break;
          case "SUPERVISOR_ROLE":
          case "CLIENT_ROLE":
            navigate("/bancavirtual/transferencias");
            break;
          default:
            navigate("/");
            break;
        }
      }, 1200); // Espera para que el usuario vea la animación de éxito
      return () => clearTimeout(timer);
    }
    // Si hay un error, resetea el formulario después de mostrar el toast
    if (status === 'error') {
      const timer = setTimeout(() => setStatus('base'), 1500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const onChange = useCallback((value, field) => {
    setForm(f => ({ ...f, [field]: { ...f[field], value } }));
  }, []);

  const onBlur = useCallback((value, field) => {
    const valid = field === 'identifier'
      ? (value.includes('@') ? validateEmail(value) : validateUsername(value))
      : validatePassword(value);
    setForm(f => ({ ...f, [field]: { ...f[field], isValid: valid, showError: !valid } }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const { success } = await login(form.identifier.value, form.password.value);
    setStatus(success ? 'success' : 'error');
  };

  const formVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };
  
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
  };

  const disabled = isLoading || !form.identifier.isValid || !form.password.isValid;

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div key="loading" variants={contentVariants} className="flex flex-col items-center">
            <p className="text-lg font-semibold text-[#163a5d]">Iniciando sesión...</p>
            <motion.div
              className="w-12 h-12 border-4 border-gray-200 border-t-[#163a5d] rounded-full mt-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
            />
          </motion.div>
        );
      case 'success':
        return (
          <motion.div key="success" variants={contentVariants} className="flex flex-col items-center text-green-500">
            <p className="text-lg font-semibold">¡Éxito!</p>
            <motion.svg className="w-16 h-16 mt-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
          </motion.div>
        );
      default: // 'base' o 'error'
        return (
          <motion.div key="form" variants={contentVariants} className="w-full flex flex-col items-center">
            <span className="text-[#163a5d] font-bold text-3xl pb-4">¡Bienvenido de nuevo!</span>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <Input field="identifier" value={form.identifier.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.identifier.showError} validationMessage={form.identifier.value.includes('@') ? validateEmailMessage : validateUsernameMessage} type="text" placeholder="Usuario o DPI" Icon={UserIcon} />
              <Input field="password" value={form.password.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.password.showError} validationMessage={validatePasswordMessage} type="password" placeholder="Contraseña" Icon={KeyIcon} />
              <motion.button type="submit" disabled={disabled} variants={buttonVariants} whileTap="whileTap" whileHover="whileHover" className="w-60 mt-3 mx-auto py-3 rounded-2xl text-[#163a5d] bg-yellow-200 font-medium hover:opacity-90 transition disabled:opacity-50 disabled:bg-gray-400 disabled:hover:bg-gray-400">
                Iniciar sesión
              </motion.button>
            </form>
            <p onClick={switchAuthHandler} className="text-[#163a5d] hover:underline cursor-pointer mt-4">
              ¿Aún sin cuenta? <span className="font-semibold">Regístrate</span>
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${fondo})` }}>
      <motion.div variants={formVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-lg min-h-[380px] justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {renderContent()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired
};