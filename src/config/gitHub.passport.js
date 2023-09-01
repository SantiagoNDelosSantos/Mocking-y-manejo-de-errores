// github.passport.js:
import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';

// Import UserController:
import SessionController from '../controllers/sessionController.js';

// Import CartController:
import CartController from '../controllers/cartController.js';

// Importación de variables de entorno GitHub:
import { envClientID, envClientSecret, envCallbackURL } from '../config.js';

// Instancia de SessionController: 
let sessionController = new SessionController();

// Instancia de CartController: 
let cartController = new CartController();

// Función de GitHub passport para expotarla:
export const initializePassportGitHub = (req, res) => {

    // Estrategia de registro con GitHub:

    passport.use('github', new GitHubStrategy({
        req,
            clientID: envClientID,
            clientSecret: envClientSecret,
            callbackURL: envCallbackURL,
        },

        async ( accessToken, refreshToken, profile, done) => {

            try {

                const identifier = profile._json.name;

                console.log(req)
        
                // Buscamos al usuario en la base de datos: 
                const existSessionControl = await sessionController.getUserByEmailOrNameOrIdController(req, res, identifier);

                // Verificamos si no hubo algun error en el sessionController, si lo hubo devolvemos el mensaje de error:
                if (existSessionControl.statusCode === 500) {
                    return done(null, false, {
                        message: existSessionControl.message
                    });
                }

                // Verificamos si el usuario ya esta registrado, en dicho caso devolvemos el resultado:
                else if (existSessionControl.statusCode === 200) {
                    // Extraermos solo el resultado:
                    const exist = existSessionControl.result;
                    return done(null, exist);
                }

                // Si el usuario no esta registrado en la base de datos (404), entonces se pocede a crear un usuario con los datos de GitHub: 
                else if (existSessionControl.statusCode === 404) {

                    // Creammos un carrito para el usuario: 
                    const resultCartControl = await cartController.createCartController(req, res);

                    // Validamos si no hubo algun error en el cartController, si lo hubo devolvemos el mensaje de error:
                    if (resultCartControl.statusCode === 500) {
                        return done(null, false, {
                            message: resultCartControl.message
                        });
                    }

                    // Si no hubo error en el cartController continuamos con la creación del usuario:
                    else if (resultCartControl.statusCode === 200) {

                        // Extraemos solo el carrito creado por el cartController: 
                        const cart = resultCartControl.result;

                        // Creamos el objeto con los datos del usuario y le añadimos el _id de su carrito: 
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "X",
                            email: "X",
                            age: 0,
                            password: "Sin contraseña.",
                            role: "user",
                            cart: cart._id,
                        };

                        // Creamos el nuevo usuario:
                        const createSessionControl = await sessionController.createUserControler(req, res, newUser);

                        // Verificamos si no hubo algun error en el sessionController, si lo hubo devolvemos el mensaje de error:
                        if (createSessionControl.statusCode === 500) {
                            return done(null, false, {
                                message: createSessionControl.message
                            });
                        }

                        // Si no hubo error en el sessionController devolvemos el nuevo usuario:
                        else if (createSessionControl.statusCode === 200) {
                            const user = createSessionControl.result;
                            return done(null, user);
                        }
                    }
                };
            } catch (error) {
                console.log(error)
                return done(null, false, {
                    message: 'Error de registro en gitHub.passport.js - Login GitHub: ' + error.message
                });
            };
        }));

};