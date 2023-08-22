// Una función por cada tipo de error que queramos tener...

export const generateUserErrorInfo = (user) => {
    return `One or more propieties were incomplete or not valid. 
    List of requires propesties:
    * firts_name  :  needs to be a String, recived ${user.first_name}.
    * last_name   :  needs to be a String, recived ${user.last_name}.`
}

// Carrito: 
export const generateQuantityErrorInfo = (quantity) => {
    return `The provided quantity (${quantity}) is not a valid number or it is zero.`;
};
