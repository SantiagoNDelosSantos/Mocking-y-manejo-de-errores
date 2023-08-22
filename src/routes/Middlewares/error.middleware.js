import ErrorEnums from "../errors/error.enums.js";

export const errorMiddleware = (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {

        case ErrorEnums.INVALID_ID_CART_ERROR:
            res.send({
                status: "error",
                error: error.name,
                cause: error.cause,
            });
            break;

        case ErrorEnums.QUANTITY_INVALID_ERROR:
            res.send({
                status: "error",
                error: error.name,
                cause: error.cause,
            });
            break;

        default:
            res.send({
                status: "error",
                error: "Unhandled error"
            })
    }
}

