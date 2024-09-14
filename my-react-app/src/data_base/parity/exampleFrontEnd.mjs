//;todo---MARK:# Tables
import "./tables.mjs";

const { StatusCodes, getReasonPhrase } = require("http-status-codes"); // Importar `http-status-codes`

//;todo---MARK:# Global Variables

// Ahora no necesitas definir los códigos de estado HTTP manualmente, usamos `StatusCodes` de `http-status-codes`.

//;todo---MARK:# Functions

//
//
//

//;MARK:*
//^---------------- Auxiliary ----------------^\\

// Función auxiliar para crear una respuesta de error estándar
/**
 * Crea un objeto de respuesta de error estándar.
 * @param {number} status - El código de estado HTTP.
 * @param {string} message - El mensaje de error.
 * @returns {Object} Un objeto con `status`, `message` y `data` como `null`.
 */
const createErrorResponse = (status, message) => ({
  status,
  message,
  data: null,
});

//;todo---MARK:# Controladores

//
//
//

//;MARK:Users
//^---------------- Usuarios (Users) ----------------^\\

/**
 * Crea un nuevo usuario.
 * @param {Object} newUser - Objeto que contiene los datos del nuevo usuario.
 * @returns {Object} Objeto de respuesta con `status`, `message` y `data`.
 */
function createUser(newUser) {
  try {
    // Validar que todos los campos requeridos están presentes
    if (!newUser.name || !newUser.email || !newUser.password) {
      return createErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Faltan campos requeridos: 'name', 'email', 'password'."
      );
    }

    // Verificar si el email ya existe
    const existingUser = users.find((user) => user.email === newUser.email);
    if (existingUser) {
      return createErrorResponse(
        StatusCodes.BAD_REQUEST,
        "El correo electrónico ya está en uso."
      );
    }

    // Crear un nuevo ID para el usuario
    const newUserId = users.length ? users[users.length - 1].id + 1 : 1;
    const user = { id: newUserId, ...newUser };

    // Agregar el usuario a la lista de usuarios
    users.push(user);

    return {
      status: StatusCodes.CREATED,
      message: "Usuario creado exitosamente.",
      data: user,
    };
  } catch (error) {
    return createErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error al crear el usuario."
    );
  }
}

/**
 * Obtiene un usuario por su ID.
 * @param {number} userId - ID del usuario a obtener.
 * @returns {Object} Objeto de respuesta con `status`, `message` y `data`.
 */
function getUserById(userId) {
  try {
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return createErrorResponse(
        StatusCodes.NOT_FOUND,
        "Usuario no encontrado."
      );
    }

    return {
      status: StatusCodes.OK,
      message: "Usuario encontrado.",
      data: user,
    };
  } catch (error) {
    return createErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error al obtener el usuario."
    );
  }
}

/**
 * Obtiene todos los usuarios.
 * @returns {Object} Objeto de respuesta con `status`, `message` y `data`.
 */
function getAllUsers() {
  try {
    return {
      status: StatusCodes.OK,
      message: "Usuarios obtenidos exitosamente.",
      data: users,
    };
  } catch (error) {
    return createErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error al obtener los usuarios."
    );
  }
}

/**
 * Actualiza un usuario por su ID.
 * @param {number} userId - ID del usuario a actualizar.
 * @param {Object} updatedData - Objeto con los datos actualizados del usuario.
 * @returns {Object} Objeto de respuesta con `status`, `message` y `data`.
 */
function updateUser(userId, updatedData) {
  try {
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return createErrorResponse(
        StatusCodes.NOT_FOUND,
        "Usuario no encontrado."
      );
    }

    // Actualizar los datos del usuario
    users[userIndex] = { ...users[userIndex], ...updatedData };

    return {
      status: StatusCodes.OK,
      message: "Usuario actualizado exitosamente.",
      data: users[userIndex],
    };
  } catch (error) {
    return createErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error al actualizar el usuario."
    );
  }
}

/**
 * Elimina un usuario por su ID.
 * @param {number} userId - ID del usuario a eliminar.
 * @returns {Object} Objeto de respuesta con `status`, `message` y `data`.
 */
function deleteUser(userId) {
  try {
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return createErrorResponse(
        StatusCodes.NOT_FOUND,
        "Usuario no encontrado."
      );
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return {
      status: StatusCodes.OK,
      message: "Usuario eliminado exitosamente.",
      data: deletedUser,
    };
  } catch (error) {
    return createErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error al eliminar el usuario."
    );
  }
}
