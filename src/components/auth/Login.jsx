import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Input } from '../Input'
import { Logo } from '../Logo'
import {
  validateEmail, validateEmailMessage,
  validatePassword, validatePasswordMessage,
  validateUsername, validateUsernameMessage
} from '../../shared/validators'
import { useLogin } from '../../shared/hooks/useLogin'

// ✅ Importación del fondo
import backgroundRegister from "../../assets/img/backgroundRegister.png";

export const Login = ({ switchAuthHandler }) => {
  const { login, isLoading } = useLogin()

  const [form, setForm] = useState({
    identifier: { value: '', isValid: false, showError: false },
    password:   { value: '', isValid: false, showError: false },
  })

  const onChange = useCallback((value, field) => {
    setForm(f => ({ 
      ...f, 
      [field]: { ...f[field], value } 
    }))
  }, [])

  const onBlur = useCallback((value, field) => {
    let valid = false

    if (field === 'identifier') {
      valid = value.includes('@')
        ? validateEmail(value)
        : validateUsername(value)
    } else if (field === 'password') {
      valid = validatePassword(value)
    }

    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid: valid, showError: !valid }
    }))
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    login(form.identifier.value, form.password.value)
  }

  const disabled = isLoading 
    || !form.identifier.isValid 
    || !form.password.isValid

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundRegister})`
      }}
    >
      <div className="w-full max-w-md mx-auto bg-[#163a5d]/80 rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-lg">
        <Logo text="¡Bienvenido de nuevo!" />

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            field="identifier"
            value={form.identifier.value}
            onChangeHandler={onChange}
            onBlurHandler={onBlur}
            showErrorMessage={form.identifier.showError}
            validationMessage={
              form.identifier.value.includes('@')
                ? validateEmailMessage
                : validateUsernameMessage
            }
            type="text"
            placeholder="Ingresar nombre de usuario o dpi"
          />

          {/* Contraseña */}
          <Input
            field="password"
            value={form.password.value}
            onChangeHandler={onChange}
            onBlurHandler={onBlur}
            showErrorMessage={form.password.showError}
            validationMessage={validatePasswordMessage}
            type="password"
            placeholder="Ingresar contraseña"
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
            style={{ fontWeight: '620' }}
          >
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <p
          onClick={switchAuthHandler}
          className="text-white hover:underline cursor-pointer mb-4 mt-2"
        >
          ¿Aún sin cuenta? <strong>Regístrate</strong>
        </p>
      </div>
    </div>
  )
}

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired
}
