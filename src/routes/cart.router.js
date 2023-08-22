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

// Mongoose para validación de IDs:
import mongoose from "mongoose";

// Errores:
import ErrorEnums from "./errors/error.enums.js";
import CustomError from "./errors/customError.class.js";
import ErrorGenerator from "./errors/error.info.js";


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
cartRouter.get("/:cid", async (req, res, next) => {

    const cid = req.params.cid;

    // Middleware para validación del ID del carrito: 

    try {
        if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: "Invalid ID",
                cause: ErrorGenerator.generateCidErrorInfo(cid),
                message: "The provided cart ID is not valid.",
                code: ErrorEnums.INVALID_ID_CART_ERROR
            });
        }
    } catch (error) {
        return next(error)
    }

    const result = await cartController.getCartByIdController(req, res);
    res.status(result.statusCode).send(result);
});

// Traer todos los carritos - Router: 
cartRouter.get('/', async (req, res) => {
    const result = await cartController.getAllCartsController(req, res);
    res.status(result.statusCode).send(result);
});





// Agregar un producto a un carrito - Router:
cartRouter.post('/:cid/products/:pid/quantity/:quantity',
    /*passport.authenticate('jwt', {
        session: false
    }), rolesMiddlewareUser, verificarPertenenciaCarrito, */
    async (req, res, next) => {

        const quantity = req.params.quantity;

        try {
            if (isNaN(quantity) || quantity <= 0) {
                CustomError.createError({
                    name: "Add product in cart error",
                    cause: ErrorGenerator.generateQuantityErrorInfo(quantity),
                    message: "Quantity must be a valid number",
                    code: ErrorEnums.QUANTITY_INVALID_ERROR
                });
            }
        } catch (error) {
            return next(error)
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