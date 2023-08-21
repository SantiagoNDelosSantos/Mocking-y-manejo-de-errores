// Import passport - local pasport:
import passport from 'passport';
import local from 'passport-local';

// Import createHash y isValidPassword: 
import {
    createHash,
    isValidPassword
} from "../utils/bcrypt.utils.js";

// Import UserController:
import UserController from '../controllers/userController.js'

// Import CartController:
import CartController from '../controllers/cartController.js';

// Import email y contraseña admin:
import {
    envAdminCoder,
    envPassCoder
} from '../config.js';
import { config } from 'dotenv';

// Instancia de localStrategy: 
const localStrategy = local.Strategy;

// Instancia de UserController: 
const userController = new UserController();

// Instancia de CartController: 
const cartController = new CartController();

// Función de PassportLocal para exportarla:
export const initializePassportLocal = () => {

    // Primera estrategia - Registro:

    passport.use('register', new localStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },

        async (req, username, password, done) => {

            // Sacamos del body del formulario toda la informacion del usuario. 
            const {
                first_name,
                last_name,
                email,
                age, 
            } = req.body;

            try {

                // Buscamos el correo en la base de datos: 
                const responseControllerU = await userController.getUserByEmailOrNameOrIdController(username);

                // Extraermos solo el resultado:
                const exist = responseControllerU.result;

                if (exist) {
                    const errorMessage = 'El usuario ya existe. Presione "Ingresa aquí" para iniciar sesión.';
                    return done(null, false, {
                        message: errorMessage
                    });
                } else {

                    // Crearmmos un carrito para el usuario: 
                    const responseControllerC = await cartController.createCartController();
                    // Extraemos solo el resultado: 
                    const cart = responseControllerC.result;

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: 'user',
                        cart: cart._id,
                    };

                    // Creamos un nuevo usuario:
                    const responseControllerU = await userController.createUserControler(newUser);
                    // Extraemos solo el resultado: 
                    const user = responseControllerU.result;

                    return done(null, user);
                };

            } catch (error) {
                return done('Error de registro', error);
            };
        }
    ));

    // Segunda estrategia - Login:

    passport.use(
        'login',
        new localStrategy({
            usernameField: 'email'
        }, async (username, password, done) => {
            try {
                // Verificar si el usuario es administrador
                if (username === envAdminCoder && password === envPassCoder) {

                    let userAdmin = {
                        name: "Admin",
                        email: config.envAdminCoder,
                        age: "00",
                        role: "admin",
                        id: 0,
                        cart: 0,
                    };

                    // Redirigir al panel de administrador
                    return done(null, userAdmin);

                } else {

                    // Buscamos el correo en la base de datos: 
                    const responseControllerU = await userController.getUserByEmailOrNameOrIdController(username);

                    // Extraermos solo el resultado:
                    const user = responseControllerU.result;

                    // Si no se encuentra al usuario en la base de datos
                    if (!user) {
                        const errorMessage = 'No hay una cuenta registrada con este correo. Presione "Regístrarse aquí" para crear una cuenta.';
                        return done(null, false, {
                            message: errorMessage
                        });
                    }

                    // Si el usuario existe en la base de datos, verificar si la contraseña es válida
                    if (!isValidPassword(user, password)) {
                        const errorMessage = 'El correo sí se encuentra registrado pero, la contraseña ingresada es incorrecta.';
                        return done(null, false, {
                            message: errorMessage
                        });
                    }

                    // Si el usuario existe y la contraseña es válida, retornar el usuario autenticado
                    
                    return done(null, user);
                }
                
            } catch (error) {
                // Si ocurre un error durante la búsqueda o verificación, retornar el error
                return done(error);
            }

        })
    );

};