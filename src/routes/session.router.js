import {
    Router
} from 'express';
import passport from 'passport';

import {
    registerUser,
    loginUser,
    getCurrentUser,
    authenticateWithGitHub,
    getProfileUser
} from './Middlewares/passport.middleware.js';

import {
    completeProfile
} from '../config/formExtra.js';

const sessionRouter = Router();

// Register:
sessionRouter.post('/register', registerUser);

// Login:
sessionRouter.post('/login', loginUser);

// GitHub:
sessionRouter.get('/github', passport.authenticate('github', {
    session: false,
    scope: 'user:email'
}));

sessionRouter.get('/githubcallback', authenticateWithGitHub);

// Formulario extra - GitHub:
sessionRouter.post('/completeProfile', completeProfile);

// Current user:
sessionRouter.get('/current', passport.authenticate('jwt', {
    session: false
}), getCurrentUser);

// Ver perfil usuario: 
sessionRouter.get('/profile', passport.authenticate('jwt', {
    session: false
}), getProfileUser)

export default sessionRouter;