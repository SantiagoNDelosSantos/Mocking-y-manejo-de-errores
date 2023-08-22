// Import de CartService:
import CartService from '../services/carts.service.js'

// Clase para el Controller de carritos:
export default class CartController {

    constructor() {
        // Instancia de CartsService:
        this.cartService = new CartService();
    }

    // Métodos de CartController:

    // Crear un carrito - Controller:
    async createCartController(req, res) {
        let response = {};
        try {
            const responseService = await this.cartService.createCartService();
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = "Error al crear el carrito - Controller: " + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // Traer un carrito por su ID - Controller:
    async getCartByIdController(req, res) {
        let response = {};
        try {
            const cid = req.params.cid;
            const responseService = await this.cartService.getCartByIdService(cid);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = 'Error al consultar el carrito - Controller: ' + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // Traer todos los carritos - Controller: 
    async getAllCartsController(req, res) {
        let response = {};
        try {
            const responseService = await this.cartService.getAllCartsService();
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = 'Error al consultar todos los carritos - Controller: ' + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // Agregar un producto a un carrito - Controller:
    async addProductInCartController(req, res) {
        let response = {};
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.params.quantity;
            const responseService = await this.cartService.addProductToCartService(cid, pid, quantity);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = 'Error al agregar el producto al carrito - Controller: ' + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // Procesamiento de la compra del usuario:
    async purchaseProductsInCartController(req, res) {
        let response = {};
        try {
            const cartID = req.params.cid;
            const purchaseInfo = req.body;
            const userEmail = purchaseInfo.userEmailAddress;
            const responseService = await this.cartService.purchaseProductsInCartService(cartID, purchaseInfo, userEmail);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.status;
            };
            console.log(response.message);
            return response
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = "Error al procesar la compra - Controller: " + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return res.status(response.statusCode).json(response);
        }
    }

    // Eliminar un producto de un carrito - Controller:
    async deleteProductFromCartController(req, res) {
        let response = {};
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const responseService = await this.cartService.deleteProductFromCartService(cid, pid);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = "Error al eliminar producto del carrito - Controller: " + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // Eliminar todos los productos de un carrito - Controller:
    async deleteAllProductsFromCartController(req, res) {
        let response = {};
        try {
            const cid = req.params.cid;
            const responseService = await this.cartService.deleteAllProductFromCartService(cid);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = "Error al eliminar todos los productos del carrito - Controller: " + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    //  Actualizar un carrito - Controler:
    async updateCartController(req, res) {
        let response = {};
        try {
            const cid = req.params.cid;
            const updatedCartFields = req.body;
            const responseService = await this.cartService.updateCartService(cid, updatedCartFields);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            };
            if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response.message);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = "Error al actualizar el carrito - Controller: " + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        };
    };

    // Actualizar la cantidad de un produco en carrito - Controller:
    async updateProductInCartController(req, res) {
        let response = {};
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const updatedProdInCart = req.body;
            const responseService = await this.cartService.updateProductInCartService(cid, pid, updatedProdInCart);
            response.status = responseService.status;
            response.message = responseService.message;
            response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            }
            if (responseService.status === "error") {
                response.error = responseService.error;
            }
            console.log(response);
            console.log(updatedProdInCart)
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            response.status = "error";
            response.message = "Error al actualizar el producto en el carrito - Controller:" + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        }
    }

}