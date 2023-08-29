// Import Router: 
import { Router } from 'express';
// Passport:
import passport from 'passport';


import { loginUser, getCurrentUser, authenticateWithGitHub, getProfileUser} from '../controllers/sessionController.js';



// Importamos el usuario creado luego de GitHub y luego de completar el formulario: 
import {completeProfile} from '../config/formExtra.js'

// Instancia de Router:
const sessionRouter = Router();


// Import SessionController:
import SessionController from "../controllers/sessionController.js";

// Instancia de SessionController: 
let sessionController = new SessionController();

// Register:
sessionRouter.post('/register', async (req, res, next) => {
    const result = await sessionController.registerUserController(req, res, next);
    if(result){
        req.logger.debug(result)
    }
});



























// Login:
sessionRouter.post('/login', loginUser);

// Current user:
sessionRouter.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);

// GitHub:
sessionRouter.get('/github', passport.authenticate('github', { session: false, scope: 'user:email' }));

sessionRouter.get('/githubcallback', authenticateWithGitHub);

// Formulario extra - GitHub:
sessionRouter.post('/completeProfile', completeProfile);

// Ver perfil usuario: 
sessionRouter.get('/profile', passport.authenticate('jwt', { session: false }), getProfileUser)

export default sessionRouter;
