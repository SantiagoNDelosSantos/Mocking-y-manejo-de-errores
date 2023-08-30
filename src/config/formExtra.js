import jwt from 'jsonwebtoken';
import {
    envCoderSecret,
    envCoderCookie,
    envCoderUserIDCookie
} from '../config.js';

// Import UserController:
import UserController from '../controllers/sessionController.js';

// Import UserController:
const userController = new UserController();

// Función para completeProfile: 
export const completeProfile = async (req, res) => {

    const userId = req.signedCookies.envCoderUserIDCookie; // Obtener el valor de la cookie
    // Resto del código para completar el perfil...

    console.log('Valor de la cookie userId:', userId);

    const last_name = req.body.last_name;
    const email = req.body.email;
    const age = req.body.age;
    const password = req.body.password;

    try {

        // Crear el actualizar el  usuario con los datos del formulario:
        const updateUser = {
            last_name,
            email,
            age,
            password,
        };

        // Actualizar el usuario en la base de datos:

        const responseControllerU = await userController.updateUserController(userId, updateUser);
        // Extraermos solo el resultado:
        const userCompleteDB = responseControllerU.result;

        // Generar el token JWT:
        let token = jwt.sign({
            email: userCompleteDB.email,
            first_name: userCompleteDB.first_name,
            tickets: userCompleteDB.tickets,
            role: userCompleteDB.role,
            cart: userCompleteDB.cart,
            userID: userCompleteDB._id
        }, envCoderSecret, {
            expiresIn: '7d'
        });

        // Token jwt: 
        res.cookie(envCoderCookie, token, { 
            httpOnly: true, signed:true, maxAge: 10* 60 *1000
        })

        // Redirigir al usuario a la vista de productos:
        res.send({
            status: 'success',
            redirectTo: '/products'
        });

    } catch (error) {
        console.error('Error al completar el perfil:', error);
        res.status(500).json({
            message: 'Error al completar el perfil. Inténtalo de nuevo.'
        });
    }

};