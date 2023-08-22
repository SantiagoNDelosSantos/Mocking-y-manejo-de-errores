// Import Router:
import {
    Router
} from "express";

// Import CartController:
import CartController from '../controllers/cartController.js'

// Passport:
import passport from "passport";

// Import Middleware User:
import {
    rolesMiddlewareUser
} from "./Middlewares/roles.middleware.js";

// Import verificación carrito: 
import {
    verificarPertenenciaCarrito
} from "./Middlewares/carts.middleware.js";

// Errores:
import  ErrorEnums from './errors/error.enums.js'
import { generateQuantityErrorInfo }from "./errors/error.info.js";
import CustomError from "./errors/customError.class.js";

// Instancia de Router:
const cartRouter = Router();

// Instancia de CartController: 
let cartController = new CartController();

// Crear un carrito - Router:
cartRouter.post("/", async (req, res) => {
    const result = await cartController.createCartController(req, res);
    res.status(result.statusCode).send(result);
});

// Traer un carrito por su ID - Router:
cartRouter.get("/:cid", async (req, res) => {
    const result = await cartController.getCartByIdController(req, res);
    res.status(result.statusCode).send(result);
});

// Traer todos los carritos - Router: 
cartRouter.get('/', async (req, res) => {
    const result = await cartController.getAllCartsController(req, res);
    res.status(result.statusCode).send(result);
});

// Agregar un producto a un carrito - Router:
cartRouter.post('/:cid/products/:pid/quantity/:quantity' ,/*passport.authenticate('jwt', {
    session: false
}), rolesMiddlewareUser, verificarPertenenciaCarrito, */async (req, res) => {

    const quantity = req.params.quantity;

        if (isNaN(quantity) || quantity <= 0) {
        CustomError.createError({
            name: "Add product in cart error",
            cause: generateQuantityErrorInfo(quantity),
            message: "Quantity must be a valid number",
            code: ErrorEnums.QUANTITY_INVALID_ERROR
        });
    }
    

    const result = await cartController.addProductInCartController(req, res);
    res.status(result.statusCode).send(result);
});

// Procesamiento de la compra del usuario: 
cartRouter.post('/:cid/purchase', async (req, res) => {

    const result = await cartController.purchaseProductsInCartController(req, res);
    res.status(result.statusCode).send(result);
})

// Eliminar un producto de un carrito - Router:
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const result = await cartController.deleteProductFromCartController(req, res);
    res.status(result.statusCode).send(result);
})

// Eliminar todos los productos de un carrito - Router:
cartRouter.delete('/:cid', async (req, res) => {
    const result = await cartController.deleteAllProductsFromCartController(req, res);
    res.status(result.statusCode).send(result);
})

// Actualizar un carrito - Router:
cartRouter.put('/:cid', passport.authenticate('jwt', {
    session: false
}), rolesMiddlewareUser, verificarPertenenciaCarrito, async (req, res) => {
    const result = await cartController.updateCartController(req, res);
    res.status(result.statusCode).send(result);
});

// Actualizar un producto en carrito - Router:
cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const result = await cartController.updateProductInCartController(req, res);
    res.status(result.statusCode).send(result);
});

export default cartRouter;