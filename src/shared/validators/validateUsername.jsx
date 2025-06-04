export const validateUsername = (username) => {
    const regex = /^\S{5,20}$/

    return regex.test(username)
}

export const validateUsernameMessage = 'Ingresar minimo 5 caracteres, sin espacios';