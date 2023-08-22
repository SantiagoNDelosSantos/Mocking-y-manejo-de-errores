// Una función por cada tipo de error que queramos tener...
export default class ErrorGenerator {

    static generateUserErrorInfo(user) {
        return `One or more properties were incomplete or not valid.

        Required properties:
        * first_name: Needs to be a String, received ${user.first_name}.
        * last_name: Needs to be a String, received ${user.last_name}.`;
    }


    // Carrito: 
    static generateCidErrorInfo(cid) {
        return `One property was incomplete or not valid. The cart ID property does not have a valid format, received ${cid}.`;
    }


    static generateQuantityErrorInfo(quantity) {
        return `The provided quantity (${quantity}) is not a valid number or it is zero.`;
    }
}