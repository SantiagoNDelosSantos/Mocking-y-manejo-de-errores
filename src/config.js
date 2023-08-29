import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option('--mode <mode>', 'mode en que se levantara la app', 'dev')

program.parse()

const mode = program.opts().mode 

dotenv.config({
    path: mode == 'dev' ? '.env.development' : '.env.production'
})

// Exporto las variables de entorno: 

// Entorno: 
export const envEntorno = process.env.ENVIRONMENT;

// MongoDB
export const envMongoURL = process.env.MONGO_URL;
export const envPort = process.env.PORT;

// GitHub:
export const envClientID = process.env.CLIENT_ID;
export const envClientSecret = process.env.CLIENT_SECRET;
export const envCallbackURL = process.env.CALLBACK_URL;

// JWT:
export const envCoderSecret = process.env.CODER_SECRET;
export const envCoderCookie = process.env.CODER_COOKIE;
export const envCoderUserIDCookie = process.env.CODER_USER;

// ADMIN:
export const envAdminCoder = process.env.ADMIN_EMAIL;
export const envPassCoder = process.env.ADMIN_PASSWORD;

console.log(program.opts())

// Cargar variables de entorno, antes de levantar el servidor: 
// npm run dev-D : npm run dev-P