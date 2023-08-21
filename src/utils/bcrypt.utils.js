import bcrypt from 'bcrypt';

// Funciones para trabajar con contraseñas usando bcrypt:

// Crea un hash a partir de una contraseña utilizando bcrypt.
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Comprueba si una contraseña coincide con el hash almacenado en el usuario.
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);