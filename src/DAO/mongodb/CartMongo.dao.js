// Import mongoose para el mongoose.connect:
import mongoose from "mongoose";

// Import del modelo de carritos:
import {
    cartModel
} from "./models/carts.model.js";

import {
    ticketModel
} from "./models/ticket.model.js";
// Import de variables de entorno:
import {
    envMongoURL
} from "../../config.js";

// Clase para el DAO de carritos:
export default class CartsDAO {

    // Conexión Mongoose:
    connection = mongoose.connect(envMongoURL);

    // Crear un carrito - DAO:
    async createCart() {
        try {
            const result = await cartModel.create({
                products: [],
                tickets: []
            });
            return result;
        } catch (error) {
            throw new Error("Error al crear el carrito - DAO. Error original: " + error.message);
        };
    };

    // Traer un carrito por su ID - DAO:
    async getCartById(cid) {
        try {
            const result = await cartModel.findOne({
                _id: cid
            }).populate(['products.product', 'tickets.ticketsRef']);
            return result;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID - DAO. Error original: " + error.message);
        };
    };

    // Traer todos los carritos - DAO: 
    async getAllCarts() {
        try {
            const result = await cartModel.find();
            return result;
        } catch (error) {
            throw new Error("Error al obtener todos los carritos - DAO. Error original: " + error.message);
        };
    };

    // Agregar un producto a un carrito:
    async addProductToCart(cid, product, quantity) {
        try {
            const cart = await this.getCartById(cid);
            const productID = product._id.toString();
            const existingProductIndex = cart.products.findIndex(p => p.product._id.toString() === productID);
            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, se suma la cantidad proporcionada al quantity existente.
                cart.products[existingProductIndex].quantity += parseInt(quantity, 10);
            } else {
                // Si el producto no está en el carrito, se lo agregar con el quantity proporcionado.
                cart.products.push({
                    product: product,
                    quantity: quantity
                });
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito - DAO. Original error: " + error.message);
        }
    }

    // Agregar un ticket a un carrito - DAO:
    async addTicketToCart(cid, ticketID) {
        try {
            const cart = await this.getCartById(cid);
            const existingTicketIndex = cart.tickets.findIndex(t => t.ticketsRef.toString() === ticketID);
            if (existingTicketIndex === -1) {
                // Si el ticket no está en el carrito, se agrega la referencia del ticket.
                cart.tickets.push({
                    ticketsRef: ticketID
                });
                await cart.save();
            }
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el ticket al carrito - DAO. Original error: " + error.message);
        }
    }

    // Borrar un producto de un carrito: 
    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            const product = cart.products.find((p) => p._id.toString() === pid);
            if (!product) {
                return {
                    status: 'error',
                };
            } else {
                cart.products.pull(pid);
                await cart.save();
                return {
                    status: 'success',
                };
            }
        } catch (error) {
            throw new Error("Error al borrar el producto en carrito - DAO. Original error: " + error.message);
        }
    }

    // Actualizar la cantidad de un produco en carrito - DAO: 
    async updateProductInCart(cid, pid, updatedProdInCart) {
        try {
            const cart = await this.getCartById(cid);
            const product = cart.products.find((p) => p._id.toString() === pid);
            if (!product) {
                throw new Error(`No se encontró ningún producto con el ID ${pid} en el carrito.`);
            }
            product.quantity = updatedProdInCart.quantity;
            await cart.save();
            return {
                cart
            };
        } catch (error) {
            throw new Error("Error al actualizar producto en carrito - DAO. Original error: " + error.message);
        }
    }

    // Eliminar todos los productos de un carrito: 
    async deleteAllProductsFromCart(cid) {
        try {
            const cart = await this.getCartById(cid);
            if (cart) {
                cart.products = [];
                await cart.save();
                return {
                    status: 'success'
                };
            } else {
                return {
                    status: 'error',
                };
            }
        } catch (error) {
            throw new Error("Error al borrar todos los productos en carrito - DAO. Original error: " + error.message);
        }
    }

    // Actualizar un carrito - DAO:
    async updateCart(cid, updatedCartFields) {
        try {
            let result = await cartModel.updateOne({
                _id: cid
            }, {
                $set: updatedCartFields
            });
            return result;
        } catch (error) {
            throw new Error("Error al actualizar el carrito - DAO. Original error: " + error.message);
        }
    }

}