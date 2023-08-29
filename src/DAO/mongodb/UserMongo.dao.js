// Import mongoose para el mongoose.connect:
import mongoose from "mongoose";

// Import del modelo de productos:
import {
    userModel
} from './models/users.model.js'

// Importación de variables de entorno: 
import {
    envMongoURL
} from "../../config.js";

// Clase para el DAO de usuarios:
export default class UserDAO {

    // Conexión Mongoose:
    connection = mongoose.connect(envMongoURL);

    // Crear usuario - DAO: 
    async createUser(info) {
        try {
            console.log(info)
            const result = await userModel.create(info);
            console.log(result)
            return result;
        } catch (error) {
            throw new Error("Error al registrar el usurio - DAO. Error original: " + error.message);
        }
    }

    // Buscar usuario por email, nombre de usuario o id - DAO:
    async getUserByEmailOrNameOrId(identifier) {
        try {

            console.log(identifier)
            const conditions = [{
                    email: identifier
                },
                {
                    first_name: identifier
                }
            ];
            if (mongoose.Types.ObjectId.isValid(identifier)) {
                conditions.push({
                    _id: identifier
                });
            }

            const result = await userModel.findOne({
                $or: conditions
            });

            console.log(result)
            return result;
        } catch (error) {
            throw new Error("Error al obtener el usuario por Email, Nombre o ID - DAO. Error original: " + error.message);
        }
    }

    // Actualizar usuario - DAO:
    async updateUser(uid, updateUser) {
        try {
            let result = await userModel.updateOne({
                _id: uid
            }, {
                $set: updateUser
            });

            let userUpdate = await userModel.findOne({
                _id: uid
            });
            return userUpdate;
        } catch (error) {
            throw new Error("Error al actualizar el usuario. Error original: " + error.message);
        }
    }

}