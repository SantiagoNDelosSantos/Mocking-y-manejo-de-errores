// Import mongoose para mongoose.connect:
import mongoose from "mongoose";

// Import del modelo de mensajes:
import {
    messageModel
} from "./models/messages.model.js";

// Importación de varibles de entorno: 
import {
    envMongoURL
} from "../../config.js";

// Clase para el DAO de mensajes: 
export default class MessageDAO {

    // Conexión Mongoose:
    connection = mongoose.connect(envMongoURL);

    // Crear un mensaje - DAO:
    async createMessage(message) {
        try {
            const result = await messageModel.create(message);
            return result;
        } catch (error) {
            throw new Error("Error al crear el mensaje - DAO. Error original: " + error.message);
        }
    }

    // Traer todos los mensajes - DAO: 
    async getAllMessage() {
        try {
            let result = await messageModel.find().lean();
            return result;
        } catch (error) {
            throw new Error("Error al obtener los mensajes - DAO. Error original: " + error.message);
        }
    }

    // Borrar un mensaje - DAO:
    async deleteMessage(mid) {
        try {
            let result = await messageModel.deleteOne({
                _id: mid
            })
            return result;
        } catch (error) {
            throw new Error("Error al eliminar el mensaje - DAO. Error original: " + error.message);
        }
    }

}