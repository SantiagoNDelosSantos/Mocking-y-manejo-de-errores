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
    try {
        const cid = req.params.cid;
        if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: "Error al Obtener Carrito por ID.",
                cause: ErrorGenerator.generateCidErrorInfo(cid),
                message: "El ID de Carrito Proporcionado no es Válido.",
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
cartRouter.post('/:cid/products/:pid/quantity/:quantity', passport.authenticate('jwt', {
        session: false
    }), rolesMiddlewareUser, verificarPertenenciaCarrito,
    async (req, res, next) => {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.params.quantity;
            if (!cid || !mongoose.Types.ObjectId.isValid(cid) || !pid || !mongoose.Types.ObjectId.isValid(pid)) {
                CustomError.createError({
                    name: "Error al intentar agregar un producto al carrito.",
                    cause: ErrorGenerator.generateCidOrPidErrorInfo(cid, pid),
                    message: "El ID de carrito o de producto no tiene un formato válido.",
                    code: ErrorEnums.INVALID_ID_CART_OR_PRODUCT_ERROR
                });
            }
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                CustomError.createError({
                    name: "Error al intentar agregar un producto al carrito.",
                    cause: ErrorGenerator.generateQuantityErrorInfo(quantity),
                    message: "La cantidad debe ser un número válido y mayor que cero.",
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
cartRouter.post('/:cid/purchase', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const purchaseInfo = req.body;
        const products = purchaseInfo.products;
        const userEmail = purchaseInfo.userEmailAddress;
        if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: "Error al Procesar la Compra de Productos en el Carrito.",
                cause: ErrorGenerator.generateCidErrorInfo(cid),
                message: "El ID de carrito proporcionado no es válido.",
                code: ErrorEnums.INVALID_ID_CART_ERROR
            });
        }
        if (!purchaseInfo || !Array.isArray(products) || products.length === 0) {
            CustomError.createError({
                name: "Error al Procesar la Compra de Productos en el Carrito.",
                cause: ErrorGenerator.generatePurchaseErrorInfo(purchaseInfo),
                message: "Información de productos inválida o faltante.",
                code: ErrorEnums.PRODUCTS_MISSING_OR_INVALID,
            });
        }
        for (const productInfo of products) {
            if (!productInfo.databaseProductID || !mongoose.Types.ObjectId.isValid(productInfo.databaseProductID)) {
                const error = CustomError.createError({
                    name: "Error al Procesar la Compra de Productos en el Carrito.",
                    cause: ErrorGenerator.generateProductsPurchaseErrorInfo(productInfo.databaseProductID),
                    message: "Uno o más productos tienen un formato inválido.",
                    code: ErrorEnums.INVALID_PRODUCT,
                });
                return next(error);
            }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userEmail || !emailRegex.test(userEmail)) {
            CustomError.createError({
                name: "Error al Procesar la Compra de Productos en el Carrito.",
                cause: ErrorGenerator.generateEmailUserErrorInfo(userEmail),
                message: "Correo electrónico inválido.",
                code: ErrorEnums.INVALID_EMAIL,
            })
        }
    } catch (error) {
        return next(error)
    }
    const result = await cartController.purchaseProductsInCartController(req, res);
    res.status(result.statusCode).send(result);
})

// Eliminar un producto de un carrito - Router:
cartRouter.delete('/:cid/products/:pid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        if (!cid || !mongoose.Types.ObjectId.isValid(cid) || !pid || !mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: "Error al intentar eliminar el producto del carrito.",
                cause: ErrorGenerator.generateCidOrPidErrorInfo(cid, pid),
                message: "El ID de carrito o de producto no tiene un formato válido.",
                code: ErrorEnums.INVALID_ID_CART_OR_PRODUCT_ERROR,
            });
        }
    } catch (error) {
        return next(error)
    }
    const result = await cartController.deleteProductFromCartController(req, res);
    res.status(result.statusCode).send(result);
})

// Eliminar todos los productos de un carrito - Router:
cartRouter.delete('/:cid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: "Error al intentar eliminar todos los productos del carrito.",
                cause: ErrorGenerator.generateCidErrorInfo(cid),
                message: "El ID de Carrito Proporcionado no es Válido.",
                code: ErrorEnums.INVALID_ID_CART_ERROR
            });
        }
    } catch (error) {
        return next(error)
    }
    const result = await cartController.deleteAllProductsFromCartController(req, res);
    res.status(result.statusCode).send(result);
})

// Actualizar un carrito - Router:
cartRouter.put('/:cid', /*passport.authenticate('jwt', {
    session: false
}), rolesMiddlewareUser, verificarPertenenciaCarrito, */async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const updatedCartFields = req.body;
        if (!cid || !mongoose.Types.ObjectId.isValid(cid)) {
            CustomError.createError({
                name: "Error al intentar actualizar el carrito.",
                cause: ErrorGenerator.generateCidErrorInfo(cid),
                message: "El ID de carrito proporcionado no es válido.",
                code: ErrorEnums.INVALID_ID_CART_ERROR
            });
        }
        if (!updatedCartFields.products || Object.keys(updatedCartFields).length === 0) {
            CustomError.createError({
                name: "Error al intentar actualizar el carrito.",
                cause: ErrorGenerator.generateUpdatedCartFieldsErrorInfo(updatedCartFields),
                message: "No se proporcionó ningún cuerpo para el carrito.",
                code: ErrorEnums.INVALID_UPDATED_CART_FIELDS
            })
        }
    } catch (error) {
        return next(error)
    }
    const result = await cartController.updateCartController(req, res);
    res.status(result.statusCode).send(result);
});

// Actualizar la cantidad de un produco en carrito - Router:
cartRouter.put('/:cid/products/:pid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updatedProdInCart = req.body.quantity;
        console.log(updatedProdInCart)
        if (!cid || !mongoose.Types.ObjectId.isValid(cid) || !pid || !mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: "Error al intentar actualizar el producto en carrito",
                cause: ErrorGenerator.generateCidOrPidErrorInfo(cid, pid),
                message: "El ID de carrito o de producto no tiene un formato válido.",
                code: ErrorEnums.INVALID_ID_CART_OR_PRODUCT_ERROR
            });
        }
        if(!updatedProdInCart || !Number.isFinite(updatedProdInCart.quantity) || updatedProdInCart.quantity <= 0) {
            CustomError.createError({
                name: "Error al intentar actualizar el producto en carrito",
                cause: ErrorGenerator.generateUpdatesProdInCartErrorInfo(updatedProdInCart),
                message: "No se proporcionó ningún quantity para el producto en carrito.",
                code: ErrorEnums.INVALID_UPTATED_PROD_IN_CART
            })
        }
    } catch (error) {
        return next(error)
    }
    const result = await cartController.updateProductInCartController(req, res);
    res.status(result.statusCode).send(result);
});

export default cartRouter;