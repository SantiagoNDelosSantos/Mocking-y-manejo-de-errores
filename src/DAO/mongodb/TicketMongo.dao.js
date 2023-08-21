// Import mongoose para el mongoose.connect:
import mongoose from "mongoose";

// Import del modelo de ticket - Individual:
import { ticketModel } from './models/ticket.model.js'

// Importación de variables de entorno: 
import {
    envMongoURL
} from "../../config.js";

// Clase para el DAO de tickets:
export default class TicketDAO {

    // Conexión Mongoose:
    connection = mongoose.connect(envMongoURL);

    // Crear colección de tickets - DAO: 
    async createTicket(ticketInfo) {
        try {
            const result = await ticketModel.create(ticketInfo);
            return result;
        } catch (error) {
            throw new Error("No se pudo crear el ticket para el usuario - DAO. Error original: " + error.message);
        }
    }

    // Obtener ticket por id de un usuario - DAO:
    async getTicketsByID(tid) {
        try {
            const result = await ticketModel.findOne({
                _id: tid
            }).populate('tickets.ticket');
            return result;
        } catch (error) {
            throw new Error("No se pudieron obtener los tickets del usuario - DAO. Error original: " + error.message);
        }
    }

}
