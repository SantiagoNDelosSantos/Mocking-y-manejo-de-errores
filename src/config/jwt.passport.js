// Imports passport, jwt: 
import passport from "passport";
import jwt from "passport-jwt";

// Importación variables de entorno: 
import { envCoderSecret, envCoderTokenCookie} from "../config.js";

const JWTStrategy = jwt.Strategy;
const ExtracJWT = jwt.ExtractJwt;

export const initializePassportJWT = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtracJWT.fromExtractors([cookieExtractor]),
        secretOrKey: envCoderSecret
    }, async(jwtPayload, done) => {
        try{
            return done(null, jwtPayload);
        } catch(error){
            return done (error);
        }
    }))
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies[envCoderTokenCookie]
    }
    return token 
};