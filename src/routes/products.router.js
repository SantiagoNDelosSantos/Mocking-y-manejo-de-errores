// Imoprt Router:
import {
    Router
} from "express";

// Import ProductController:
import ProductController from "../controllers/productsController.js";

// Passport:
import passport from "passport";

// Import Middleware Admin:
import {
    rolesMiddlewareAdmin
} from "./Middlewares/roles.middleware.js";

// Import mongoose para validación de IDs:
import mongoose from 'mongoose';

// Errores:
import ErrorEnums from "./errors/error.enums.js";
import CustomError from "./errors/customError.class.js";
import ErrorGenerator from "./errors/error.info.js";

// Instancia de Router:
const productsRouter = Router();

// Instancia de ProductController: 
let productController = new ProductController();

// Crear un producto - Router:
productsRouter.post('/', passport.authenticate('jwt', {
    session: false
}), rolesMiddlewareAdmin, async (req, res, next) => {
    try {
        const productData = req.body;
        if (!productData.title || !productData.description || !productData.code || !productData.price || productData.price <= 0 || !productData.stock || productData.stock <= 0 || !productData.category || !productData.thumbnails || Object.keys(productData).length === 0) {
            CustomError.createError({
                name: "Error al crear el nuevo producto.",
                cause: ErrorGenerator.generateProductDataErrorInfo(productData),
                message: "La información para crear el producto está incompleta o no es válida.",
                code: ErrorEnums.INVALID_PRODUCT_DATA
            });
        }
    } catch (error) {
        return next(error)
    }
    const result = await productController.createProductController(req, res);
    res.status(result.statusCode).send(result);
});

// Traer un producto por su ID - Router: 
productsRouter.get('/:pid', async (req, res, next) => {
    try {
        const pid = req.params.pid;
        if(!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: "Error al obtener el producto por ID.",
                cause: ErrorGenerator.generatePidErrorInfo(pid),
                message: "El ID de producto proporcionado no es válido",
                code: ErrorEnums.INVALID_ID_PRODUCT_ERROR
            });
        }
    } catch (error) {
        return next(error)
    }
    const result = await productController.getProductByIDController(req, res);
    res.status(result.statusCode).send(result);
});

// Traer todos los productos - Router: 
productsRouter.get('/', async (req, res) => {
    const result = await productController.getAllProductsController(req, res);
    res.status(result.statusCode).send(result);
});

// Eliminar un producto por su ID - Router:
productsRouter.delete('/:pid', passport.authenticate('jwt', {
    session: false
}), rolesMiddlewareAdmin, async (req, res, next) => {
    try {
        const pid = req.params.pid;
        if(!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: "Error al eliminar el producto por ID.",
                cause: ErrorGenerator.generatePidErrorInfo(pid),
                message: "El ID de producto proporcionado no es válido",
                code: ErrorEnums.INVALID_ID_PRODUCT_ERROR
            });
        }
    } catch (error) {
        return next(error)
    }
    const result = await productController.deleteProductController(req, res);
    res.status(result.statusCode).send(result);
});

// Actualizar un producto - Router:
productsRouter.put('/:pid', passport.authenticate('jwt', {
    session: false
}), rolesMiddlewareAdmin, async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const updatedFields = req.body;
        if(!pid || !mongoose.Types.ObjectId.isValid(pid)) {
            CustomError.createError({
                name: "Error al intentar actualizar el producto.",
                cause: ErrorGenerator.generatePidErrorInfo(pid),
                message: "El ID de producto proporcionado no es válido",
                code: ErrorEnums.INVALID_ID_PRODUCT_ERROR
            });
        }
        if(!updatedFields || Object.keys(updatedFields).length === 0){
            CustomError.createError({
                name: "Error al intentar actualizar el producto.",
                cause: ErrorGenerator.generateEmptyUpdateFieldsErrorInfo(updatedFields),
                message: "No se proporcionaron campos válidos para la actualización del producto.",
                code: ErrorEnums.INVALID_UPDATED_PRODUCT_FIELDS
            });
        };
    } catch (error) {
        return next(error)
    }
    const result = await productController.updatedProductController(req, res);
    res.status(result.statusCode).send(result);
});

// Export productsRouter:
export default productsRouter;