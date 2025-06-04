export const validateDPI = (dpi) => {
  const regex = /^\d{13}$/
  return regex.test(dpi)
}

export const validateDPIMessage = 'Por favor, ingresa un DPI válido de 13 dígitos'