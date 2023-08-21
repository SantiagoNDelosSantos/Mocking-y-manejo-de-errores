// Import Router:
import { Router } from "express";

// Import TicketController: 
import TicketController from '../controllers/ticketsController.js'

// Instancia de Router:
const mockRouter = Router();

// Instancia de CartController: 
let ticketController = new TicketController();

// Traer un 100 productos - Router:
ticketRouter.get("/", async (req, res) => {
    const result = await ticketController.getTicketsByIdController(req, res);
    res.status(result.statusCode).send(result);
});

export default mockRouter;