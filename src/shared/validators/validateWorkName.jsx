export const validateWorkName = (workName) => {
  return workName.trim().length >= 3 && workName.trim().length <= 50;
};

export const validateWorkNameMessage = 'El nombre del trabajo debe tener entre 3 y 50 caracteres';