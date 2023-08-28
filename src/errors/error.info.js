// Una función por cada tipo de error que queramos tener...
export default class ErrorGenerator {

    // Carrito: 

    static generateCidErrorInfo(cid) {
        return `La propiedad de ID de carrito no tiene un formato válido, se recibió ${cid}.`;
    }

    static generateCidOrPidErrorInfo(cid, pid) {
        return `La propiedad de ID del carrito o del producto no tiene un formato válido, se recibieron cid: ${cid}, pid: ${pid}.`;
    }

    static generateQuantityErrorInfo(quantity) {
        return `La cantidad proporcionada (${quantity}) no es un número válido o es cero.`;
    }

    static generatePurchaseErrorInfo(purchaseInfo) {
        return `Una o más propiedades en la información de compra están incompletas o no son válidas. Por favor, proporciona información de compra válida. Se recibió ${purchaseInfo}`;
    }

    static generateProductsPurchaseErrorInfo(databaseProductID, cartProductID) {
        return `Uno o más productos tienen un formato inválido. Como ID de producto se recibió ${databaseProductID} y como ID del  producto en el carrito se recibio ${cartProductID}.`;
    }

    static generateEmailUserErrorInfo(userEmail) {
        return `La dirección de correo electrónico proporcionada "${userEmail}" no es válida. Por favor, proporciona una dirección de correo electrónico válida.`;
    }

    static generateUpdatedCartFieldsErrorInfo(updateCartFields) {
        return `No se proporcionó ningún cuerpo products[{product}] para actualizar el carrito. Se recibió ${updateCartFields}`
    }

    static generateUpdatesProdInCartErrorInfo(updatedProdInCart) {
        return `No se proporcionó ningún cuerpo para actualizar el producto en carrito. Se recibió ${updatedProdInCart}`
    }

    // Productos:

    static generateProductDataErrorInfo(productData) {
        return `Una o más propiedades en los datos del producto están faltando o no son válidas.
    Propiedades requeridas:
    * title: Debe ser un string, se recibió ${productData.title}.
    * description: Debe ser un string, se recibió (${productData.description}).
    * code: Debe ser un string, se recibió ${productData.code}.
    * price: Debe ser un número positivo mayor que 0, se recibió ${productData.price}.
    * stock: Debe ser un número positivo mayor que 0, se recibió ${productData.stock}.
    * category: Debe ser un string, se recibió ${productData.category}.
    * thumbnails: Debe ser un arreglo no vacío de URLs de imágenes, se recibió ${productData.thumbnails}.
    `;
    }

    static generatePidErrorInfo(pid) {
        return `La propiedad de ID del producto no tiene un formato válido, se recibió ${pid}.`;
    }

    static generateEmptyUpdateFieldsErrorInfo(updatedFields) {
        return `La información del producto es incompleta o incorrecta. Se recibió: ${updatedFields}.`;
    }

    // Mensajes: 

    static generateMessageDataErrorInfo(messageData) {
        return `La información del mensaje es incompleta o incorrecta. Como usuario se recibió ${messageData.user} y como mensaje se recibio ${messageData.message}.`;
    }

    static generateMidErrorInfo(mid) {
        return `La propiedad de ID del mensaje no tiene un formato válido, se recibió ${mid}.`;
    }

    // Ticket:

    static generateTicketDataErrorInfo(ticketInfo) {
        return `Una o más propiedades en los datos del producto están faltando o no son válidas.
        Propiedades requeridas: ${ticketInfo}`;
    }

    static generateTidErrorInfo(tid) {
        return `La propiedad de ID del ticket no tiene un formato válido, se recibió ${tid}.`;
    }









    static generateUserErrorInfo(user) {
        return `Una o más propiedades estaban incompletas o no son válidas.

        Propiedades requeridas:
        * first_name: Debe ser una cadena, recibido ${user.first_name}.
        * last_name: Debe ser una cadena, recibido ${user.last_name}.`;
    }

}