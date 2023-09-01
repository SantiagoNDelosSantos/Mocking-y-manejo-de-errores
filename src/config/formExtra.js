import jwt from 'jsonwebtoken';
import {
    envCoderSecret,
    envCoderTokenCookie,
    envCoderUserIDCookie
} from '../config.js';

// Import createHash: 
import {
    createHash
} from "../utils.js";

// Import UserController:
import SessionController from '../controllers/sessionController.js';

// Instancia de SessionController: 
let sessionController = new SessionController();

// Función para completeProfile: 
export const completeProfile = async (req, res) => {

    const userId = req.signedCookies.envCoderUserIDCookie; // Obtener el valor de la cookie
    // Resto del código para completar el perfil...

    console.log('Valor de la cookie userId:', userId);

    const last_name = req.body.last_name;
    const email = req.body.email;
    const age = req.body.age;
    const password = createHash(req.body.password);

    try {

        // Crear el objeto con los datos del formulario extra, para actualizar al usuario creado con los datos de GitHub:
        const updateUser = {
            last_name,
            email,
            age,
            password
        };

        // Actualizar el usuario en la base de datos:
        const updateSessionControl = await sessionController.updateUserController(req, res, userId, updateUser);

        // Verificamos si no hubo algun error en el sessionController o si no se encontro el usuario (404), de ocurrir devolvemos el mensaje de error:
        if (updateSessionControl.statusCode === 500 || updateSessionControl.statusCode === 404) {
            return done(null, false, {
                message: updateSessionControl.message
            });
        }

        // Si se encuantra el usuario , en dicho caso actualizamos el usuario:
        else if (updateSessionControl.statusCode === 200) {

            // Extraermos solo el resultado:
            const userExtraForm = updateSessionControl.result;

            // Generar el token JWT:
            let token = jwt.sign({
                email: userExtraForm.email,
                first_name: userExtraForm.first_name,
                tickets: userExtraForm.tickets,
                role: userExtraForm.role,
                cart: userExtraForm.cart,
                userID: userExtraForm._id
            }, envCoderSecret, {
                expiresIn: '7d'
            });
            // Token jwt: 
            res.cookie(envCoderTokenCookie, token, {
                httpOnly: true,
                signed: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            // Redirigir al usuario a la vista de productos:
            res.send({
                status: 'success',
                redirectTo: '/products'
            });
        }

    } catch (error) {
        return('Error al completar el perfil:' + error);
    }

};