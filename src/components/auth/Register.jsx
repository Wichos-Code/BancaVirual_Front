import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { Input } from "../Input";
import {
  validateName, validateNameMessage,
  validateSurname, validateSurnameMessage,
  validateUsername, validateUsernameMessage,
  validateDPI, validateDPIMessage,
  validateEmail, validateEmailMessage,
  validateIncome, validateIncomeMessage,
  validateDirection, validateDirectionMessage,
  validatePhone, validatePhoneMessage,
  validateWorkName, validateWorkNameMessage,
  validatePassword, validatePasswordMessage,
  validatePasswordConfirm
} from "../../shared/validators";
import { useRegister } from "../../shared/hooks/useRegister";

import { UserIcon, UserCircleIcon, CreditCardIcon, EnvelopeIcon, CurrencyDollarIcon, MapPinIcon, PhoneIcon, BuildingOfficeIcon, KeyIcon } from "@heroicons/react/24/outline";
import fondo from "../../assets/img/FondoBF.png";

export const Register = ({ switchAuthHandler }) => {
  const navigate = useNavigate();
  const { register, isLoading } = useRegister();

  const [form, setForm] = useState({
    name: { value: "", isValid: false, showError: false },
    surname: { value: "", isValid: false, showError: false },
    username: { value: "", isValid: false, showError: false },
    dpi: { value: "", isValid: false, showError: false },
    email: { value: "", isValid: false, showError: false },
    income: { value: "", isValid: false, showError: false },
    direction: { value: "", isValid: false, showError: false },
    phone: { value: "", isValid: false, showError: false },
    workName: { value: "", isValid: false, showError: false },
    password: { value: "", isValid: false, showError: false },
    passwordConfirm: { value: "", isValid: false, showError: false }
  });

  const onChange = useCallback((value, field) => {
    setForm(f => ({ ...f, [field]: { ...f[field], value } }));
  }, []);

  const onBlur = useCallback((value, field) => {
    let valid = false;
    switch (field) {
      case "name": valid = validateName(value); break;
      case "surname": valid = validateSurname(value); break;
      case "username": valid = validateUsername(value); break;
      case "dpi": valid = validateDPI(value); break;
      case "email": valid = validateEmail(value); break;
      case "income": valid = validateIncome(value); break;
      case "direction": valid = validateDirection(value); break;
      case "phone": valid = validatePhone(value); break;
      case "workName": valid = validateWorkName(value); break;
      case "password": valid = validatePassword(value); break;
      case "passwordConfirm": valid = validatePasswordConfirm(form.password.value, value); break;
      default: break;
    }
    setForm(f => ({ ...f, [field]: { ...f[field], isValid: valid, showError: !valid } }));
  }, [form.password.value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = Object.keys(form).reduce((acc, key) => {
      if (key !== 'passwordConfirm') {
        acc[key] = form[key].value;
      }
      return acc;
    }, {});

    const { success } = await register(payload);
    if (success) {
      navigate("/bancavirtual/acceso/verificación");
    }
  };

  const isFormInvalid = Object.values(form).some(field => !field.isValid);
  const disabled = isLoading || isFormInvalid;
  
  const formVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: 50 },
  };

  const buttonVariants = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${fondo})` }}>
      <motion.div variants={formVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 my-8 flex flex-col items-center space-y-4 shadow-lg">
        <span className="text-[#163a5d] font-bold text-3xl pb-4">Crea tu cuenta</span>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <Input field="name" value={form.name.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.name.showError} validationMessage={validateNameMessage} type="text" placeholder="Nombres" Icon={UserIcon} />
          <Input field="surname" value={form.surname.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.surname.showError} validationMessage={validateSurnameMessage} type="text" placeholder="Apellidos" Icon={UserIcon} />
          <Input field="username" value={form.username.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.username.showError} validationMessage={validateUsernameMessage} type="text" placeholder="Nombre de usuario" Icon={UserCircleIcon} />
          <Input field="dpi" value={form.dpi.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.dpi.showError} validationMessage={validateDPIMessage} type="text" placeholder="DPI" Icon={CreditCardIcon} />
          <Input field="email" value={form.email.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.email.showError} validationMessage={validateEmailMessage} type="email" placeholder="ejemplo@gmail.com" Icon={EnvelopeIcon} />
          <Input field="income" value={form.income.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.income.showError} validationMessage={validateIncomeMessage} type="number" placeholder="Ingreso mensual" Icon={CurrencyDollarIcon} />
          <Input field="direction" value={form.direction.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.direction.showError} validationMessage={validateDirectionMessage} type="text" placeholder="Dirección" Icon={MapPinIcon} />
          <Input field="phone" value={form.phone.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.phone.showError} validationMessage={validatePhoneMessage} type="tel" placeholder="+502 XXXX XXXX" Icon={PhoneIcon} />
          <Input field="workName" value={form.workName.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.workName.showError} validationMessage={validateWorkNameMessage} type="text" placeholder="Nombre de tu empresa/trabajo" Icon={BuildingOfficeIcon} />
          <Input field="password" value={form.password.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.password.showError} validationMessage={validatePasswordMessage} type="password" placeholder="Contraseña" Icon={KeyIcon} />
          <Input field="passwordConfirm" value={form.passwordConfirm.value} onChangeHandler={onChange} onBlurHandler={onBlur} showErrorMessage={form.passwordConfirm.showError} validationMessage={`Las contraseñas deben coincidir.`} type="password" placeholder="Confirmar contraseña" Icon={KeyIcon} />

          <motion.button type="submit" disabled={disabled} variants={buttonVariants} whileTap="whileTap" whileHover="whileHover" className="w-60 mt-3 mx-auto py-3 rounded-2xl text-[#163a5d] bg-yellow-200 font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:bg-gray-400 disabled:hover:bg-gray-400">
            {isLoading ? "Creando cuenta…" : "Crear cuenta"}
          </motion.button>
        </form>
        <p onClick={switchAuthHandler} className="text-[#163a5d] hover:underline cursor-pointer mt-2">
          ¿Ya tienes cuenta? <span className="font-semibold">Inicia sesión</span>
        </p>
      </motion.div>
    </div>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired
};