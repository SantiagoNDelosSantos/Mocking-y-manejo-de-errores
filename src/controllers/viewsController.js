// Import ProductService: 
import ProductService from "../services/products.service.js";

// Import MessageService:
import MessageService from "../services/message.service.js";

// Import CartService:
import CartService from "../services/carts.service.js";

// Clase para el Controller de vistas: 
export default class ViewsController {

    constructor() {
        // Instancias de ViewsService:
        this.productService = new ProductService();
        this.messageService = new MessageService();
        this.cartService = new CartService();
    }

    // PRODUCTOS - VISTAS:

    // Traer todos los productos - Controller: 
    async getAllProductsControllerV(limit, page, sort, filtro, filtroVal) {
        let response = {};
        let limitV = limit;
        let pageV = page;
        let sortV = sort;
        let filtroV = filtro;
        let filtroValV = filtroVal;
        try {

            const limit = limitV || 10;
            const page = pageV || 1;
            let sort = sortV || 1;
            let filtro = filtroV || null;
            let filtroVal = filtroValV || null;

            const responseService = await this.productService.getAllProductsService(limit, page, sort, filtro, filtroVal)
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
            return response;
        } catch (error) {
            console.error('Error: ', error.message);
            response.status = "error";
            response.message = "Error al obtener los productos." + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // CHAT - VISTA: 

    // Traer todos los mensajes en tiempo real:
    async getAllMessageControllerV() {
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
            return response;
        } catch {
            console.error('Error:', error.message);
            res.status(500).json({
                error: "Error al obtener los mensajes: " + error.message
            });
        }
    }

};