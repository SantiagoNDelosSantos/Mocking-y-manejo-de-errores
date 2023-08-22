// Import clase del DAO de carritos:
import CartDAO from "../DAO/mongodb/CartMongo.dao.js";

// Import de ProductService para acceder a productos desde los carritos:
import ProductService from "./products.service.js";

// Import TicketsService:
import TicketService from "./tickets.service.js";

// Clase para el Service de carrito:
export default class CartService {

    // Constructor de CartService:
    constructor() {
        this.cartDao = new CartDAO();
        this.productService = new ProductService();
        this.ticketService = new TicketService();
    }

    // Métodos de CartService:

    // Crear un carrito - Service:
    async createCartService() {
        let response = {};
        try {
            const result = await this.cartDao.createCart();
            response.status = "success";
            response.message = "Carrito creado exitosamente.";
            response.result = result;
            response.statusCode = 200;
        } catch (error) {
            response.status = "error";
            response.message = "No se pudo crear el carrito.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Traer un carrito por su ID - Service:
    async getCartByIdService(cid) {
        let response = {};
        try {
            const result = await this.cartDao.getCartById(cid);
            if (!result) {
                response.status = "error";
                response.message = `El carrito con ID ${cid}, no se ha encontrado.`;
                response.statusCode = 404;
            } else {
                response.status = "success";
                response.message = "Carrito obtenido exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "No se pudo obtener el carrito.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Traer todos los carritos - Service:
    async getAllCartsService() {
        let response = {};
        try {
            const result = await this.cartDao.getAllCarts();
            if (!result) {
                response.status = "error";
                response.message = "Carritos no encontrados.";
                response.statusCode = 404;
            } else {
                response.status = "success";
                response.message = "Carritos obtenidos exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "No se pudo obtener los carritos.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Agregar un producto a un carrito - Service:
    async addProductToCartService(cid, pid, quantity) {
        let response = {}
        try {
            const product = await this.productService.getProductByIdService(pid)
            if (!product) {
                response.status = "error";
                response.message = `No se pudo obtener el producto con ID ${pid}.`;
                response.statusCode = 404;
            } else {
                const soloProduct = product.result
                const result = await this.cartDao.addProductToCart(cid, soloProduct, quantity);
                if (!result) {
                    response.status = "error";
                    response.message = "No fue posible agregar el producto al carrito.";
                    response.statusCode = 400;
                } else {
                    response.status = "success";
                    response.message = "Producto agregado al carrito exitosamente.";
                    response.result = result;
                    response.statusCode = 200;
                }
            }
        } catch (error) {
            response.status = "error";
            response.message = "No se pudo agregar el producto al carrito.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Procesamiento de la compra del usuario:
    async purchaseProductsInCartService(cartID, purchaseInfo, userEmail) {
        let response = {};

        try {
            const successfulProducts = [];
            const failedProducts = [];
            let totalAmount = 0; 

            for (const productInfo of purchaseInfo.products) {

                const databaseProductID = productInfo.databaseProductID; // Obtener el _id del producto en la base de datos
                const quantityToPurchase = productInfo.quantity;

                // Obtener el producto por su ID en la base de datos
                const productFromDB = await this.productService.getProductByIdService(databaseProductID);

                // Agregar al array de productos fallidos (No encontrados):
                if (!productFromDB) {
                    failedProducts.push(productInfo);
                    continue;
                }

                // Agregar al array de productos fallidos (Stock menor al quantity):
                if (productFromDB.result.stock < quantityToPurchase) {
                    failedProducts.push(productInfo);
                    continue;
                }

                if (productFromDB.result.stock >= quantityToPurchase) {
                    successfulProducts.push(productInfo);
                    totalAmount += productFromDB.result.price * quantityToPurchase;
                    continue;
                }

            }

            for (const productInfo of successfulProducts) {
                const databaseProductID = productInfo.databaseProductID; // Obtener el _id del producto en la base de datos
                const quantityToPurchase = productInfo.quantity;

                // Obtener el producto por su ID en la base de datos
                const productFromDB = await this.productService.getProductByIdService(databaseProductID);

                // Actualizar el stock del producto
                const updatedProduct = {
                    stock: productFromDB.result.stock - quantityToPurchase
                };

                await this.productService.updateProductService(databaseProductID, updatedProduct);

                // Eliminar el producto del carrito usando el cartProductID
                await this.deleteProductFromCartService(cartID, productInfo.cartProductID);
            }



            // Crear el ticket con todos los productos de la compra después de verificar y actualizar el stock
            const ticketInfo = {
                successfulProducts: successfulProducts.map(productInfo => ({
                    product: productInfo.databaseProductID, 
                    quantity: productInfo.quantity, 
                    title: productInfo.title, 
                    price: productInfo.price,
                })),
                failedProducts: failedProducts.map(productInfo => ({
                    product: productInfo.databaseProductID,
                    quantity: productInfo.quantity,
                    title: productInfo.title, 
                    price: productInfo.price,
                })),
                purchase: userEmail,
                amount: totalAmount
            };

            const ticketServiceResponse = await this.ticketService.createTicketService(ticketInfo);

            if (ticketServiceResponse.status == "error") {
                response.status = 'error';
                response.message = 'Error al crear el ticket para la compra.';
                response.error = ticketServiceResponse.error;
                response.statusCode = 500;
                return response;
            }

            const ticketID = ticketServiceResponse.result._id; // Obtener el ID del ticket
            const addTicketResponse = await this.addTicketToCartService(cartID, ticketID);

            if (addTicketResponse.status === 'error') {
                response.status = 'error';
                response.message = `No se pudo agregar el ticket al carrito con el ID ${cartID}.`;
                response.statusCode = 500;
                return response;
            }
            if (addTicketResponse.status === 'success') {
                response.status = 'success';
                response.message = 'Compra procesada exitosamente.';
                response.result = ticketServiceResponse.result;
                response.statusCode = 200;
                return response;
            }

        } catch (error) {
            response.status = 'error';
            response.message = 'Error al procesar la compra - Service: ' + error.message;
            response.error = error.message;
            response.statusCode = 500;
            return response;
        }
    }

    // Agregar un ticket a un carrito - Service:

    async addTicketToCartService(cartID, ticketID) {
        let response = {};
        try {
            const cartUpdateResponse = await this.cartDao.addTicketToCart(cartID, ticketID);
            if (!cartUpdateResponse) {
                response.status = "error";
                response.message = `No se pudo actualizar el carrito con el ID ${cartID}.`;
                response.statusCode = 505;
            } else {
                response.status = "success";
                response.message = "Ticket agregado al carrito exitosamente.";
                response.result = cartUpdateResponse;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "Error al agregar el ticket al carrito.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response
    }

    // Eliminar un producto de un carrito: 
    async deleteProductFromCartService(cid, pid) {
        let response = {};
        try {
            const result = await this.cartDao.deleteProductFromCart(cid, pid);
            if (result.status === "error") {
                response.status = "error";
                response.message = `No se encontró ningún producto con el ID ${pid} en el carrito ${cid}`;
                response.statusCode = 404;
            } else {
                response.status = "success";
                response.message = "Producto eliminado exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "Error al eliminar el producto.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response
    }

    // Eliminar todos los productos de un carrito - Service: 
    async deleteAllProductFromCartService(cid) {
        let response = {};
        try {
            const result = await this.cartDao.deleteAllProductsFromCart(cid);
            if (result.status === "error") {
                response.status = "error";
                response.message = `No se encontró ningún carrito con el ID ${cid}.`;
                response.statusCode = 404;
            } else {
                response.status = "success";
                response.message = "Los productos del carrito se han eliminado exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "Error al eliminar todos los productos del carrito.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Actualizar un carrito - Service:
    async updateCartService(cid, updatedCartFields) {
        const response = {};
        try {
            const result = await this.cartDao.updateCart(cid, updatedCartFields)
            if (result.n === 0) {
                response.status = "error";
                response.message = `No se encontró ningún carrito con el ID ${cid}.`;
                response.statusCode = 404;
            } else {
                response.status = "success";
                response.message = "Carrito actualizado exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "Error al actualizar el carrito.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

    // Actualizar la cantidad de un producto en carrito - Service:
    async updateProductInCartService(cid, pid, updatedProdInCart) {
        let response = {};
        try {
            const result = await this.cartDao.updateProductInCart(cid, pid, updatedProdInCart)
            if (result.n === 0) {
                response.status = "error";
                response.message = "No se ha podido actualizar el producto.";
                response.statusCode = 400;
            } else {
                response.status = "success";
                response.message = "Producto actualizado exitosamente.";
                response.result = result;
                response.statusCode = 200;
            }
        } catch (error) {
            response.status = "error";
            response.message = "Error al actualizar el producto.";
            response.error = error.message;
            response.statusCode = 500;
        }
        return response;
    }

}