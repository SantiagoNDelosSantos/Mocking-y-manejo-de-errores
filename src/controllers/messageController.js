// Import de MessageService:
import MessageService from '../services/message.service.js'

// Import mongoose para validación de IDs: 
import mongoose from 'mongoose';

// Clase para el Controller de mensajes: 
export default class MessageController {

    constructor() {
        // Instancia de MessageService: 
        this.messageService = new MessageService();
    }

    // Métodos para MessageController:

    // Crear un mensaje - Controler :
    async createMessageController(req, res) {
        let response = {};
        const message = req.body;
        try {
            if (!message) {
                response.status = "error";
                response.message = `No se proporcionó ningún cuerpo para el mensaje.`;
                response.statusCode = 400;
            } else {
                const responseService = await this.messageService.createMessageService(message);
                response.status = responseService.status;
                response.message = responseService.message;
                response.statusCode = responseService.statusCode;
                if (responseService.status === "success") {
                    response.result = responseService.result;
                    // Actualización Real Time:
                    const messages = await this.messageService.getAllMessageService();
                    const messageResult = messages.result;
                    req.socketServer.sockets.emit('messages', messageResult);
                    console.log(messages, messageResult)
                };
                if (responseService.status === "error") {
                    response.error = responseService.error;
                };
            };
            console.log(response);
            return response
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({
                error: "Error al crear el mensaje: " + error.message
            });
        }
    }

    // Traer todos los mensajes - Controller: 
    async getAllMessageController(req, res) {
        let response = {};
        try {
            const responseService = await this.messageService.getAllMessageService();
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
                response.hasNextPage = responseService.hasNextPage;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({
                error: "Error al obtener los mensajes: " + error.message
            });
        }
    };

    // Borrar un mensaje - Controller: 
    async deleteMessageController(req, res) {
        let response = {};
        try {
            const mid = req.params.mid;
            if (!mid) {
                response.status = "error";
                response.message = `No se proporcionó ningún ID de mensaje.`;
                response.statusCode = 400;
            } else if (!mongoose.Types.ObjectId.isValid(mid)) {
                response.status = "error";
                response.message = `El ID proporcionado no es válido.`;
                response.statusCode = 400;
            } else {
                const responseService = await this.messageService.deleteMessageService(mid);
                response.status = responseService.status;
                response.message = responseService.message;
                response.statusCode = responseService.statusCode;
                if (responseService.status === "success") {
                    response.result = responseService.result;
                    // Actualización Real Time:
                    const messages = await this.messageService.getAllMessageService();
                    const messageResult = messages.result;
                    req.socketServer.sockets.emit('messages', messageResult);
                };
                if (responseService.status === "error") {
                    response.error = responseService.error;
                };
            };
            console.log(response);
            return response
        } catch (error) {
            console.error('Error: ', error.message);
            res.status(500).json({
                error: "Error al eliminar el mensaje: " + error.message
            });
        };
    };

}