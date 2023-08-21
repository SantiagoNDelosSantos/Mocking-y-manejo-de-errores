// Import Router:
import { Router } from "express";

// Import TicketController: 
import TicketController from '../controllers/ticketsController.js'

// Instancia de Router:
const ticketRouter = Router();

// Instancia de CartController: 
let ticketController = new TicketController();

// Traer un ticket por su ID - Router:
ticketRouter.get("/:tid", async (req, res) => {
    const result = await ticketController.getTicketsByIdController(req, res);
    res.status(result.statusCode).send(result);
});

export default ticketRouter;