export const validateIncome = (income) => {
  const value = Number(income)
  if (Number.isNaN(value)) return false
  return value >= 1500
}

export const validateIncomeMessage = 'El ingreso mínimo es Q1500'