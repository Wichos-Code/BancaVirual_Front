import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Input } from "../Input";
import { Logo } from "../Logo";
import {
  validateName, validateNameMessage,
  validateSurname, validateSurnameMessage,
  validateUsername, validateUsernameMessage,
  validateDPI, validateDPIMessage,
  validateEmail, validateEmailMessage,
  validateIncome, validateIncomeMessage,
  validateDirection, validateDirectionMessage,
  validatePhone, validatePhoneMessage,
  validatePassword, validatePasswordMessage,
  validatePasswordConfirm, validatePasswordConfirmMessage
} from "../../shared/validators";
import { useRegister } from "../../shared/hooks/useRegister";

export const Register = ({ switchAuthHandler }) => {
  const navigate = useNavigate();
  const { register, isLoading } = useRegister();

  const initialState = {
    name:             { value: "", isValid: false, showError: false },
    surname:          { value: "", isValid: false, showError: false },
    username:         { value: "", isValid: false, showError: false },
    dpi:              { value: "", isValid: false, showError: false },
    email:            { value: "", isValid: false, showError: false },
    income:           { value: "", isValid: false, showError: false },
    direction:        { value: "", isValid: false, showError: false },
    phone:            { value: "", isValid: false, showError: false },
    password:         { value: "", isValid: false, showError: false },
    passwordConfirm:  { value: "", isValid: false, showError: false }
  };
  const [form, setForm] = useState(initialState);

  const onChange = useCallback((value, field) => {
    setForm(f => ({ ...f, [field]: { ...f[field], value } }));
  }, []);

  const onBlur = useCallback((value, field) => {
    let valid = false;
    switch (field) {
      case "name":      valid = validateName(value); break;
      case "surname":   valid = validateSurname(value); break;
      case "username":  valid = validateUsername(value); break;
      case "dpi":       valid = validateDPI(value); break;
      case "email":     valid = validateEmail(value); break;
      case "income":    valid = validateIncome(value); break;
      case "direction": valid = validateDirection(value); break;
      case "phone":     valid = validatePhone(value); break;
      case "password":  valid = validatePassword(value); break;
      case "passwordConfirm":
        valid = validatePasswordConfirm(form.password.value, value);
        break;
      default: break;
    }
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid: valid, showError: !valid }
    }));
  }, [form.password.value]);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const payload = {
      name:       form.name.value,
      surname:    form.surname.value,
      username:   form.username.value,
      dpi:        form.dpi.value,
      email:      form.email.value,
      income:     form.income.value,
      direction:  form.direction.value,
      phone:      form.phone.value,
      password:   form.password.value
    };

    const { success } = await register(payload);
    if (success) {
      navigate("/bancavirtual/acceso/verificación");
    }
  }, [form, register, navigate]);

  const disabled = isLoading ||
    !form.name.isValid ||
    !form.surname.isValid ||
    !form.username.isValid ||
    !form.dpi.isValid ||
    !form.email.isValid ||
    !form.income.isValid ||
    !form.direction.isValid ||
    !form.phone.isValid ||
    !form.password.isValid ||
    !form.passwordConfirm.isValid;

  return (
    <div className="w-full max-w-md mx-auto bg-[#163a5d] rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-lg">
      <Logo text="Bienvenido al registro" />

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <Input
          field="name"
          value={form.name.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.name.showError}
          validationMessage={validateNameMessage}
          type="text"
          placeholder="Nombres"
        />
        <Input
          field="surname"
          value={form.surname.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.surname.showError}
          validationMessage={validateSurnameMessage}
          type="text"
          placeholder="Apellidos"
        />
        <Input
          field="username"
          value={form.username.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.username.showError}
          validationMessage={validateUsernameMessage}
          type="text"
          placeholder="Nombre de usuario"
        />
        <Input
          field="dpi"
          value={form.dpi.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.dpi.showError}
          validationMessage={validateDPIMessage}
          type="text"
          placeholder="DPI"
        />
        <Input
          field="email"
          value={form.email.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.email.showError}
          validationMessage={validateEmailMessage}
          type="email"
          placeholder="ejemplo@gmail.com"
        />
        <Input
          field="income"
          value={form.income.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.income.showError}
          validationMessage={validateIncomeMessage}
          type="number"
          placeholder="Ingreso"
        />
        <Input
          field="direction"
          value={form.direction.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.direction.showError}
          validationMessage={validateDirectionMessage}
          type="text"
          placeholder="Dirección"
        />
        <Input
          field="phone"
          value={form.phone.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.phone.showError}
          validationMessage={validatePhoneMessage}
          type="tel"
          placeholder="+502 1000 0000"
        />
        <Input
          field="password"
          value={form.password.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.password.showError}
          validationMessage={validatePasswordMessage}
          type="password"
          placeholder="Contraseña"
        />
        <Input
          field="passwordConfirm"
          value={form.passwordConfirm.value}
          onChangeHandler={onChange}
          onBlurHandler={onBlur}
          showErrorMessage={form.passwordConfirm.showError}
          validationMessage={validatePasswordConfirmMessage}
          type="password"
          placeholder="Confirmar contraseña"
        />

        <button
          type="submit"
          disabled={disabled}
          className="
            w-60
            mt-3
            mx-auto
            py-3
            rounded-full
            text-[#163a5d] bg-yellow-200
            hover:opacity-90 disabled:opacity-50
            transition
          "
          style={{ fontWeight: "620" }}
        >
          {isLoading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p
        onClick={switchAuthHandler}
        className="text-white hover:underline cursor-pointer mb-4 mt-2"
      >
        ¿Ya tienes cuenta? <strong>Inicia sesión</strong>
      </p>
    </div>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired
};
