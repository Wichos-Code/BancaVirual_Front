export const validateIncome = (income) => {
  const value = Number(income)
  if (Number.isNaN(value)) return false
  return value >= 100
}

export const validateIncomeMessage = 'El ingreso mínimo es Q100'