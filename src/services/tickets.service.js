// Import clase del DAO de Tickets:
import TicketDAO from "../DAO/mongodb/TicketMongo.dao.js";

// Clase para el Service de tickets:
export default class TicketService {

    // Constructor de TicketService:
    constructor() {
        this.ticketDao = new TicketDAO();
    }

    // Métodos del TicketService: 

    // Crear colección de tickets - Service:
    async createTicketService(ticketInfo) {
        let response = {};
        try {
            const result = await this.ticketDao.createTicket(ticketInfo);
            response.status = "success";
            response.message = "Se ha creado la colección de tickets exitosamente.";
            response.result = result;
            response.statusCode = 200;
        } catch (error) {
            response.status = "error";
            response.message = "No se pudo crear la colección de tickets.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Obtener todos los tickets de un usuario - Service:
    async getTicketsByIdService(tid) {
        let response = {};
        try {
            const result = await this.ticketDao.getTicketsByID(tid);
            if (!result) {
                response.status = "error";
                response.message = `No se pudo encontrar la colección de tickets con ID ${tid}.`;
                response.statusCode = 404;
            } else {
                response.status = "success";
                response.message = "Se han obtenido los tickets del usuario exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "No se pudo obtener la colección de tickets - Service.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

}
