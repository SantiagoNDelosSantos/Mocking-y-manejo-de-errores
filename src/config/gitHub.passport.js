// github.passport.js:
import passport from 'passport';
import {
    Strategy as GitHubStrategy
} from 'passport-github2';

// Import UserController:
import SessionController from '../controllers/sessionController.js';

// Import CartController:
import CartController from '../controllers/cartController.js';

// Importación de variables de entorno GitHub:
import {
    envClientID,
    envClientSecret,
    envCallbackURL
} from '../config.js';

// Instancia de UserController: 
const userController = new SessionController();

// Instancia de CartController: 
const cartController = new CartController();

// Función de GitHub passport para expotarla:
export const initializePassportGitHub = () => {

    passport.use('github', new GitHubStrategy({
        clientID: envClientID,
        clientSecret: envClientSecret,
        callbackURL: envCallbackURL,
    }, async (accessToken, refreshToken, profile, done) => {

        try {

            // Buscamos al usuario en la base de datos: 
            const responseControllerU = await userController.getUserByEmailOrNameOrIdController(profile._json.name);

            // Extraermos solo el resultado:
            const exist = responseControllerU.result;

            if (exist) {
                return done(null, exist);
            } 
            if(!exist) {

                // Crearmmos un carrito para el usuario: 
                const responseControllerC = await cartController.createCartController();
                // Extraemos solo el resultado: 
                const cart = responseControllerC.result;

                const newUser = {
                    first_name: profile._json.name,
                    last_name: "X",
                    email: "X",
                    age: 0,
                    password: "Sin contraseña.",
                    role: "user",
                    cart: cart._id,
                };

                // Creamos un nuevo usuario:
                const responseControllerU = await userController.createUserControler(newUser);
                // Extraemos solo el resultado: 
                const user = responseControllerU.result;

                return done(null, user);
            };

        } catch (error) {
            return done(error);
        }
    }));

};