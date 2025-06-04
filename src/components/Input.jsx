import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export const Input = ({
  field,
  label,
  value,
  onChangeHandler,
  type,
  showErrorMessage,
  validationMessage,
  onBlurHandler,
  textArea,
  placeholder
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField
    ? (showPassword ? 'text' : 'password')
    : type

  const handleValueChange = useCallback(
    e => onChangeHandler(e.target.value, field),
    [onChangeHandler, field]
  )
  const handleInputBlur = useCallback(
    e => onBlurHandler(e.target.value, field),
    [onBlurHandler, field]
  )

  const baseInputClasses =
    `w-full p-3 rounded-full bg-white text-black
     border-2 border-transparent
     focus:border-blue-400 focus:outline-none
     transition`

  return (
    <div className="w-full max-w-md flex flex-col space-y-1">
      {label && (
        <label htmlFor={field} className="text-white">
          {label}
        </label>
      )}

      {textArea ? (
        <textarea
          id={field}
          name={field}
          rows={5}
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onBlur={handleInputBlur}
          className={`${baseInputClasses} mx-auto`}
        />
      ) : (
        <div className="relative w-85 mx-auto">
          <input
            id={field}
            name={field}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleValueChange}
            onBlur={handleInputBlur}
            className={`${baseInputClasses} pr-10`}
          />

          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword
                ? <EyeSlashIcon className="h-5 w-5" />
                : <EyeIcon      className="h-5 w-5" />
              }
            </button>
          )}
        </div>
      )}

      {showErrorMessage && (
        <p className="text-red-400 text-sm ml-7">
          {validationMessage}
        </p>
      )}
    </div>
  )
}

Input.propTypes = {
  field:             PropTypes.string.isRequired,
  label:             PropTypes.string,
  value:             PropTypes.string.isRequired,
  onChangeHandler:   PropTypes.func.isRequired,
  type:              PropTypes.string.isRequired,
  showErrorMessage:  PropTypes.bool.isRequired,
  validationMessage: PropTypes.string.isRequired,
  onBlurHandler:     PropTypes.func.isRequired,
  textArea:          PropTypes.bool,
  placeholder:       PropTypes.string
}

Input.defaultProps = {
  textArea:    false,
  label:       '',
  placeholder: ''
}
