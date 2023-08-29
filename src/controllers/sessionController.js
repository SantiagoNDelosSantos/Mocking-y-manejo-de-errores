// Import jwt, passport y variables de jwt:
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { envCoderSecret, envCoderCookie, envCoderUserIDCookie } from '../config.js';

// Imports DTOs: 
import { CurrentUserDTO } from './DTO/user.dto.js';


// Import de SessionService: 
import SessionService from '../services/user.service.js'


// Clase para el Controller de session: 

export default class SessionController{

    constructor(){
        // Instancia de SessionService: 
        this.sessionService = new SessionService();
    }

    // Métodos para SessionController: 

    // Register - Controller: 

    async registerUserController(req, res, next) {

        console.log(req.body)
    
        passport.authenticate('register', {
            session: false
        }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    message: info.message
                });
            }
            res.json({
                message: 'Registro exitoso',
                user
            });
        })(req, res, next);


        
    };
    



}



































export const loginUser = (req, res, next) => {




    passport.authenticate('login', {
        session: false
    }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                message: info.message
            });
        } else {
            let token = jwt.sign({
                email: user.email,
                first_name: user.first_name,
                role: user.role,
                cart: user.cart,
                userID: user._id
            }, envCoderSecret, {
                expiresIn: '7d'
            });
            res.cookie(envCoderCookie, token, {
                httpOnly: true
            }).send({
                status: 'success'
            });
        }
    })(req, res, next);
};

export const getCurrentUser = (req, res) => {
    res.send(new CurrentUserDTO(req.user));
};





export const authenticateWithGitHub = (req, res, next) => {



    passport.authenticate('github', {
        session: false
    }, (err, user, info) => {
        console.log('usurrio' + user)
        if (err) {
            return next(err);
        }
        if (user.password === "Sin contraseña.") {
            // Crear una cookie con el ID del usuario
            res.cookie(envCoderUserIDCookie, user._id, {
                httpOnly: true,
                maxAge: 1 * 60 * 1000
            }).redirect('/completeProfile');
        } else {
            res.redirect('/products');
        }
    })(req, res, next);
};






export const getProfileUser = async (req, res) => {



    const user = new CurrentUserDTO(req.user);

    res.render('profile', {
        title: 'Perfil',
        user: user
    });

};