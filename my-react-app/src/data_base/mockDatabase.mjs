//;todo---MARK:# Imports

import { v4 as uuidv4 } from "uuid";
import {
  Users,
  UserPersonalData,
  UserContactData,
  UserAdditionalData,
  Tasks,
  saveAllTablesToLocalStorage, //; Importa la función para guardar todas las tablas en localStorage
  resetAllTablesToDefaults, //; Importa la función para guardar todas las tablas en localStorage
} from "./mockTables.mjs";

export { resetAllTablesToDefaults };

//;todo---MARK:# Global Variables

//; Constantes de tiempo y códigos de estado HTTP
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; //; 1 hora en milisegundos
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export { TOKEN_EXPIRATION_TIME, HTTP_STATUS };

//;todo---MARK:# Functions

//
//
//

//;MARK:*
//^---------------- Auxiliary ----------------^\\

/**
 * Función auxiliar para crear una respuesta de error estándar.
 * @param {number} status - El código de estado HTTP.
 * @param {string} message - El mensaje de error.
 * @returns {Object} Un objeto con `status` y `message`.
 */
const createErrorResponse = (status, message) => ({
  status,
  message,
  data: null,
});

/**
 * Función auxiliar para validar la entrada de datos según campos requeridos y un esquema de validación.
 * @param {Object} data - Objeto con los datos a validar.
 * @param {Array<string>} requiredFields - Lista de nombres de campos que son obligatorios.
 * @param {Object} [schema={}] - Esquema opcional que define validaciones adicionales como regex y mensajes de error para cada campo.
 * @returns {Object|null} Un objeto con `status` y `message` si hay un error de validación, o `null` si todos los campos son válidos.
 */
const validateInput = (data, requiredFields, schema = {}) => {
  const errors = [];

  //; Validar si todos los campos requeridos están presentes
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Faltan los siguientes campos requeridos: ${field}`);
    }
  }

  //; Validar los formatos de los campos con el esquema proporcionado
  for (const field of requiredFields) {
    const value = data[field];
    const fieldSchema = schema[field];

    if (
      value &&
      fieldSchema &&
      fieldSchema.regex &&
      !fieldSchema.regex.test(value)
    ) {
      errors.push(fieldSchema.errorMessage);
    }
  }

  if (errors.length > 0) {
    return createErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      errors.join(" | ") //; Combinar todos los errores en un solo mensaje
    );
  }

  return null; //; No hay errores
};

//;todo---MARK:# Auth Service

//
//
//

//;MARK:*
//^----- Tokens -----^\\

/**
 * Función para generar un token simulado (base64) para autenticación.
 * @param {string} userId - El ID del usuario.
 * @returns {string} Un token simulado.
 */
const generateToken = (userId) => {
  const expirationTime = new Date().getTime() + TOKEN_EXPIRATION_TIME; //; Hora actual + 1 hora
  return btoa(`${userId}:${expirationTime}`);
};

/**
 * Función para verificar un token de autenticación.
 * @param {string} token - El token de autenticación.
 * @returns {Object} Un objeto con `status`, `message` y `data` (si es exitoso).
 */
const verifyToken = (token) => {
  try {
    if (!token) {
      return createErrorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Token no proporcionado. Por favor, inicie sesión."
      );
    }

    const decoded = atob(token).split(":");
    const userId = decoded[0];
    const expirationTime = parseInt(decoded[1], 10);

    //; Verificar si el token ha caducado
    if (new Date().getTime() > expirationTime) {
      return createErrorResponse(
        HTTP_STATUS.FORBIDDEN,
        "El token ha caducado. Por favor, inicie sesión de nuevo."
      );
    }

    const userResult = getUserById(userId); //; Obtiene datos del usuario
    const user = userResult.data;

    //; Verificar si el usuario existe
    if (!user) {
      return createErrorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Token no válido. Por favor, inicie sesión de nuevo."
      );
    }

    //; Obtener datos adicionales del usuario
    const personalData = UserPersonalData.find(
      (data) => data.user_id === userId
    );
    const contactData = UserContactData.find((data) => data.user_id === userId);
    const additionalData = UserAdditionalData.find(
      (data) => data.user_id === userId
    );
    const tasks = Tasks.filter((task) => task.user_id === userId);

    //; Combina todos los datos del usuario
    const fullUserData = {
      ...user,
      personalData: personalData || {},
      contactData: contactData || {},
      additionalData: additionalData || {},
      tasks: tasks || [],
    };

    return {
      status: HTTP_STATUS.OK,
      message: "Token verificado exitosamente.",
      data: fullUserData,
    };
  } catch (e) {
    return createErrorResponse(
      HTTP_STATUS.UNAUTHORIZED,
      "Token no válido. Error al decodificar el token."
    );
  }
};

export { generateToken, verifyToken };

//;todo---MARK:# Controladores

//
//
//

//;MARK:Users
//^---------------- Usuarios (Users) ----------------^\\

/**
 * Función para manejar el inicio de sesión de un usuario por su nombre de usuario (username) y contraseña.
 * @param {string} username - Nombre de usuario del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Object} Un objeto con `status`, `message` y `data` (usuario autenticado o error si no se encontró o la contraseña no coincide).
 */
const loginUser = (username, password) => {
  try {
    const user = Users.find((user) => user.username === username) || null;
    if (!user) {
      return createErrorResponse(
        HTTP_STATUS.NOT_FOUND,
        "Usuario no encontrado."
      );
    }

    //; Verifica si la contraseña proporcionada coincide
    if (user.password !== password) {
      return createErrorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Contraseña incorrecta."
      );
    }

    return {
      status: HTTP_STATUS.OK,
      message: "Usuario autenticado exitosamente.",
      data: user,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al autenticar el usuario."
    );
  }
};

/**
 * Función para obtener todos los usuarios.
 * @returns {Object} Un objeto con `status`, `message` y `data` (lista de usuarios).
 */
const getAllUsers = () => {
  try {
    return {
      status: HTTP_STATUS.OK,
      message: "Usuarios obtenidos exitosamente.",
      data: Users,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener usuarios."
    );
  }
};

/**
 * Función para obtener un usuario por su ID.
 * @param {string} userId - ID del usuario a obtener.
 * @returns {Object} Un objeto con `status`, `message` y `data` (usuario o null si no se encontró).
 */
const getUserById = (userId) => {
  try {
    const user = Users.find((user) => user.user_id === userId) || null;
    return user
      ? {
          status: HTTP_STATUS.OK,
          message: "Usuario encontrado.",
          data: user,
        }
      : createErrorResponse(HTTP_STATUS.NOT_FOUND, "Usuario no encontrado.");
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener el usuario."
    );
  }
};

const userSchema = {
  username: {
    type: "string",
    regex: /^(?![-_])[A-Za-z0-9Ñ_-]{1,18}[A-Za-z0-9Ñ](?<![-_])$/,
    errorMessage:
      "El nombre de usuario debe tener entre 3 y 20 caracteres. No debe comenzar ni terminar con '-' o '_', y puede contener letras, números, '-' y '_'.",
  },
  password: {
    type: "string",
    regex:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,30}$/,
    errorMessage:
      "La contraseña debe tener entre 8 y 30 caracteres. Debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@, $, !, %, *, ?, &, #, .).",
  },
  role_name: {
    type: "string",
    regex: /^(admin|cleaning|delivery|maintenance)$/i,
    errorMessage:
      "El rol de usuario debe ser uno de los siguientes valores permitidos: 'admin', 'cleaning', 'delivery', 'maintenance'.",
  },
  personalData: {
    first_name: {
      type: "string",
      regex: /^[A-Za-zÀ-ÿ\s]+$/,
      errorMessage: "El nombre debe contener solo letras y espacios.",
    },
    last_name: {
      type: "string",
      regex: /^[A-Za-zÀ-ÿ\s]+$/,
      errorMessage: "El apellido debe contener solo letras y espacios.",
    },
    middle_name: {
      type: "string",
      regex: /^[A-Za-zÀ-ÿ\s]*$/,
      errorMessage: "El segundo nombre debe contener solo letras y espacios.",
    },
  },
  contactData: {
    email: {
      type: "string",
      regex: /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,}(?:\.[A-Z]{2,})*$/i,
      errorMessage: "El correo electrónico debe ser válido.",
    },
    phone_number: {
      type: "string",
      regex: /^\d{9,15}$/,
      errorMessage: "El número de teléfono debe tener entre 9 y 15 dígitos.",
    },
  },
  additionalData: {
    dni: {
      type: "string",
      regex: /^[A-Za-z0-9]+$/,
      errorMessage: "El DNI o NIE sólo puede contener números y letras.",
    },
    address: {
      type: "string",
      regex: /^[A-Za-zÀ-ÿ\d\s,]+$/,
      errorMessage:
        "La dirección solo debe contener letras, números, espacios y comas.",
    },
    postal_code: {
      type: "string",
      regex: /^\d{4,10}$/,
      errorMessage: "El código postal debe ser un número entre 4 y 10 dígitos.",
    },
  },
};

/**
 * Función para crear un nuevo usuario (simulación de POST).
 * @param {Object} newUser - Objeto que representa el nuevo usuario a crear.
 * @returns {Object} Un objeto con `status`, `message` y `data` (nuevo usuario creado).
 */
const createUser = (newUser) => {
  try {
    //; Validar campos principales del usuario
    const userError = validateInput(
      newUser,
      ["username", "password", "role_name"],
      userSchema
    );
    if (userError) return userError;

    //; Verificar si el username ya existe
    const existingUser = Users.find(
      (user) => user.username === newUser.username
    );
    if (existingUser) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "El nombre de usuario ya está en uso."
      );
    }

    //; Generar un nuevo user_id
    const newUserId = uuidv4();

    //; Crear el objeto usuario básico
    const user = {
      user_id: newUserId,
      username: newUser.username,
      password: newUser.password,
      role_name: newUser.role_name,
    };
    Users.push(user); //; Añadir el usuario a la tabla de Usuarios

    //; Validar y Crear datos personales
    const personalDataError = validateInput(
      newUser.personalData || {},
      ["first_name", "last_name"],
      userSchema.personalData
    );
    if (personalDataError) return personalDataError;

    const personalData = {
      user_id: newUserId, //; Asignar user_id generado
      first_name: newUser.personalData?.first_name || "",
      last_name: newUser.personalData?.last_name || "",
      middle_name: newUser.personalData?.middle_name || "",
    };
    UserPersonalData.push(personalData);

    //; Validar y Crear datos de contacto
    const contactDataError = validateInput(
      newUser.contactData || {},
      ["email", "phone_number"],
      userSchema.contactData
    );
    if (contactDataError) return contactDataError;

    const contactData = {
      user_id: newUserId, //; Asignar user_id generado
      email: newUser.contactData?.email || "",
      phone_number: newUser.contactData?.phone_number || "",
    };
    UserContactData.push(contactData);

    //; Validar y Crear datos adicionales
    const additionalDataError = validateInput(
      newUser.additionalData || {},
      ["dni", "address", "postal_code"],
      userSchema.additionalData
    );
    if (additionalDataError) return additionalDataError;

    const additionalData = {
      user_id: newUserId, //; Asignar user_id generado
      dni: newUser.additionalData?.dni || "",
      address: newUser.additionalData?.address || "",
      postal_code: newUser.additionalData?.postal_code || "",
    };
    UserAdditionalData.push(additionalData);

    //; Guardar los cambios en localStorage
    saveAllTablesToLocalStorage();

    //; Devolver la información del usuario con datos relacionados
    return {
      status: HTTP_STATUS.CREATED,
      message: "Usuario creado exitosamente.",
      data: {
        ...user,
        personalData,
        contactData,
        additionalData,
        tasks: [], //; Inicialmente, no hay tareas asignadas
      },
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al crear el usuario."
    );
  }
};

/**
 * Función para actualizar un usuario existente (simulación de PUT).
 * @param {string} userId - ID del usuario que se va a actualizar.
 * @param {Object} updatedUser - Objeto que contiene los campos a actualizar del usuario.
 * @returns {Object} Un objeto con `status`, `message` y `data` (usuario actualizado o null si no se encontró).
 */
const updateUser = (userId, updatedUser) => {
  try {
    const userIndex = Users.findIndex((user) => user.user_id === userId);
    if (userIndex !== -1) {
      Users[userIndex] = { ...Users[userIndex], ...updatedUser };

      //; Guardar los cambios en localStorage
      saveAllTablesToLocalStorage();

      return {
        status: HTTP_STATUS.OK,
        message: "Usuario actualizado exitosamente.",
        data: Users[userIndex],
      };
    }
    return createErrorResponse(HTTP_STATUS.NOT_FOUND, "Usuario no encontrado.");
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al actualizar el usuario."
    );
  }
};

/**
 * Función para eliminar un usuario (simulación de DELETE).
 * @param {string} userId - ID del usuario que se va a eliminar.
 * @returns {Object} Un objeto con `status`, `message` y `data` (usuario eliminado o null si no se encontró).
 */
const deleteUser = (userId) => {
  try {
    const userIndex = Users.findIndex((user) => user.user_id === userId);
    if (userIndex !== -1) {
      const deletedUser = Users.splice(userIndex, 1)[0];

      //; Guardar los cambios en localStorage
      saveAllTablesToLocalStorage();

      return {
        status: HTTP_STATUS.OK,
        message: "Usuario eliminado exitosamente.",
        data: deletedUser,
      };
    }
    return createErrorResponse(HTTP_STATUS.NOT_FOUND, "Usuario no encontrado.");
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al eliminar el usuario."
    );
  }
};

export {
  loginUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

//;MARK:UserPersonalData
//^---------------- Información Personal de Usuarios (UserPersonalData) ----------------^\\

/**
 * Función para obtener toda la información personal de usuarios.
 * @returns {Object} Un objeto con `status`, `message` y `data` (lista de información personal).
 */
const getAllUserPersonalData = () => {
  try {
    return {
      status: HTTP_STATUS.OK,
      message: "Datos personales de usuarios obtenidos exitosamente.",
      data: UserPersonalData,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener datos personales de usuarios."
    );
  }
};

/**
 * Función para obtener la información personal de un usuario por su ID.
 * @param {string} userId - ID del usuario a obtener.
 * @returns {Object} Un objeto con `status`, `message` y `data` (información personal del usuario o null si no se encontró).
 */
const getUserPersonalDataById = (userId) => {
  try {
    const personalData = UserPersonalData.find(
      (data) => data.user_id === userId
    );
    return personalData
      ? {
          status: HTTP_STATUS.OK,
          message: "Datos personales obtenidos exitosamente.",
          data: personalData,
        }
      : createErrorResponse(
          HTTP_STATUS.NOT_FOUND,
          "Datos personales no encontrados."
        );
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener datos personales del usuario."
    );
  }
};

/**
 * Función para actualizar la información personal de un usuario (simulación de PUT).
 * @param {string} userId - ID del usuario cuya información personal se va a actualizar.
 * @param {Object} updatedData - Objeto que contiene los campos a actualizar de la información personal.
 * @returns {Object} Un objeto con `status`, `message` y `data` (información personal actualizada o null si no se encontró).
 */
const updateUserPersonalData = (userId, updatedData) => {
  try {
    //; Verificar si se proporciona algún dato para actualizar
    if (Object.keys(updatedData).length === 0) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "No se proporcionó información para actualizar."
      );
    }

    const dataIndex = UserPersonalData.findIndex(
      (data) => data.user_id === userId
    );

    if (dataIndex !== -1) {
      //; Realizar la actualización
      UserPersonalData[dataIndex] = {
        ...UserPersonalData[dataIndex],
        ...updatedData,
      };

      //; Guardar los cambios en localStorage
      saveAllTablesToLocalStorage();

      return {
        status: HTTP_STATUS.OK,
        message: "Datos personales actualizados exitosamente.",
        data: UserPersonalData[dataIndex],
      };
    }

    return createErrorResponse(
      HTTP_STATUS.NOT_FOUND,
      "Datos personales no encontrados."
    );
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al actualizar datos personales del usuario."
    );
  }
};

export {
  getAllUserPersonalData,
  getUserPersonalDataById,
  updateUserPersonalData,
};

//;MARK:UserContactData
//^---------------- Información de Contacto de Usuarios (UserContactData) ----------------^\\

/**
 * Función para obtener toda la información de contacto de usuarios.
 * @returns {Object} Un objeto con `status`, `message` y `data` (lista de información de contacto).
 */
const getAllUserContactData = () => {
  try {
    return {
      status: HTTP_STATUS.OK,
      message: "Datos de contacto de usuarios obtenidos exitosamente.",
      data: UserContactData,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener datos de contacto de usuarios."
    );
  }
};

/**
 * Función para obtener la información de contacto de un usuario por su ID.
 * @param {string} userId - ID del usuario a obtener.
 * @returns {Object} Un objeto con `status`, `message` y `data` (información de contacto del usuario o null si no se encontró).
 */
const getUserContactDataById = (userId) => {
  try {
    const contactData = UserContactData.find((data) => data.user_id === userId);
    return contactData
      ? {
          status: HTTP_STATUS.OK,
          message: "Datos de contacto obtenidos exitosamente.",
          data: contactData,
        }
      : createErrorResponse(
          HTTP_STATUS.NOT_FOUND,
          "Datos de contacto no encontrados."
        );
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener datos de contacto del usuario."
    );
  }
};

/**
 * Función para actualizar la información de contacto de un usuario (simulación de PUT).
 * @param {string} userId - ID del usuario cuya información de contacto se va a actualizar.
 * @param {Object} updatedData - Objeto que contiene los campos a actualizar de la información de contacto.
 * @returns {Object} Un objeto con `status`, `message` y `data` (información de contacto actualizada o null si no se encontró).
 */
const updateUserContactData = (userId, updatedData) => {
  try {
    //; Verificar si se proporciona algún dato para actualizar
    if (Object.keys(updatedData).length === 0) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "No se proporcionó información para actualizar."
      );
    }

    const dataIndex = UserContactData.findIndex(
      (data) => data.user_id === userId
    );

    if (dataIndex !== -1) {
      //; Realizar la actualización
      UserContactData[dataIndex] = {
        ...UserContactData[dataIndex],
        ...updatedData,
      };

      //; Guardar los cambios en localStorage
      saveAllTablesToLocalStorage();

      return {
        status: HTTP_STATUS.OK,
        message: "Datos de contacto actualizados exitosamente.",
        data: UserContactData[dataIndex],
      };
    }

    return createErrorResponse(
      HTTP_STATUS.NOT_FOUND,
      "Datos de contacto no encontrados."
    );
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al actualizar datos de contacto del usuario."
    );
  }
};

export { getAllUserContactData, getUserContactDataById, updateUserContactData };

//;MARK:UserAdditionalData
//^---------------- Información Adicional de Usuarios (UserAdditionalData) ----------------^\\

/**
 * Función para obtener toda la información adicional de usuarios.
 * @returns {Object} Un objeto con `status`, `message` y `data` (lista de información adicional).
 */
const getAllUserAdditionalData = () => {
  try {
    return {
      status: HTTP_STATUS.OK,
      message: "Datos adicionales de usuarios obtenidos exitosamente.",
      data: UserAdditionalData,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener datos adicionales de usuarios."
    );
  }
};

/**
 * Función para obtener la información adicional de un usuario por su ID.
 * @param {string} userId - ID del usuario a obtener.
 * @returns {Object} Un objeto con `status`, `message` y `data` (información adicional del usuario o null si no se encontró).
 */
const getUserAdditionalDataById = (userId) => {
  try {
    const additionalData = UserAdditionalData.find(
      (data) => data.user_id === userId
    );
    return additionalData
      ? {
          status: HTTP_STATUS.OK,
          message: "Datos adicionales obtenidos exitosamente.",
          data: additionalData,
        }
      : createErrorResponse(
          HTTP_STATUS.NOT_FOUND,
          "Datos adicionales no encontrados."
        );
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener datos adicionales del usuario."
    );
  }
};

/**
 * Función para actualizar la información adicional de un usuario (simulación de PUT).
 * @param {string} userId - ID del usuario cuya información adicional se va a actualizar.
 * @param {Object} updatedData - Objeto que contiene los campos a actualizar de la información adicional.
 * @returns {Object} Un objeto con `status`, `message` y `data` (información adicional actualizada o null si no se encontró).
 */
const updateUserAdditionalData = (userId, updatedData) => {
  try {
    //; Verificar si se proporciona algún dato para actualizar
    if (Object.keys(updatedData).length === 0) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "No se proporcionó información para actualizar."
      );
    }

    const dataIndex = UserAdditionalData.findIndex(
      (data) => data.user_id === userId
    );

    if (dataIndex !== -1) {
      //; Realizar la actualización
      UserAdditionalData[dataIndex] = {
        ...UserAdditionalData[dataIndex],
        ...updatedData,
      };

      //; Guardar los cambios en localStorage
      saveAllTablesToLocalStorage();

      return {
        status: HTTP_STATUS.OK,
        message: "Datos adicionales actualizados exitosamente.",
        data: UserAdditionalData[dataIndex],
      };
    }

    return createErrorResponse(
      HTTP_STATUS.NOT_FOUND,
      "Datos adicionales no encontrados."
    );
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al actualizar datos adicionales del usuario."
    );
  }
};

export {
  getAllUserAdditionalData,
  getUserAdditionalDataById,
  updateUserAdditionalData,
};

//;MARK:Tasks
//^---------------- Tareas (Tasks) ----------------^\\

/**
 * Función para obtener todas las Tareas .
 * @returns {Object} Un objeto con `status`, `message` y `data` (lista de todas las Tareas ).
 */
const getAllTasks = () => {
  try {
    return {
      status: HTTP_STATUS.OK,
      message: "Tareas obtenidas exitosamente.",
      data: Tasks,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener tareas."
    );
  }
};

/**
 * Función para obtener una tarea general por su ID.
 * @param {number} taskId - ID de la tarea a obtener.
 * @returns {Object} Un objeto con `status`, `message` y `data` (tarea o null si no se encontró).
 */
const getTaskById = (taskId) => {
  try {
    const task = Tasks.find((task) => task.task_id === taskId);
    return task
      ? {
          status: HTTP_STATUS.OK,
          message: "Tarea encontrada.",
          data: task,
        }
      : createErrorResponse(HTTP_STATUS.NOT_FOUND, "Tarea no encontrada.");
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al obtener la tarea."
    );
  }
};

/**
 * Función para crear una nueva tarea (simulación de POST).
 * @param {Object} newTask - Objeto que representa la nueva tarea a crear.
 * @returns {Object} Un objeto con `status`, `message` y `data` (nueva tarea creada).
 */
const createTask = (newTask) => {
  console.log("lo que sea, da igual")
  try {
    //; Validar datos de entrada
    const error = validateInput(newTask, [
      "description",
      "status",
      "user_id",
      "entry_date",
    ]);
    if (error) return error;

    const newTaskId = Tasks.length + 1; //; Genera un nuevo ID para la tarea
    const task = { task_id: newTaskId, ...newTask };
    Tasks.push(task);

    //; Guardar los cambios en localStorage
    saveAllTablesToLocalStorage();

    return {
      status: HTTP_STATUS.CREATED,
      message: "Tarea creada exitosamente.",
      data: task,
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al crear la tarea."
    );
  }
};

/**
 * Función para actualizar una tarea existente (simulación de PUT).
 * @param {number} taskId - ID de la tarea que se va a actualizar.
 * @param {Object} updatedTask - Objeto que contiene los campos a actualizar de la tarea.
 * @returns {Object} Un objeto con `status`, `message` y `data` (tarea actualizada o null si no se encontró).
 */
const updateTask = (taskId, updatedTask) => {
  try {
    if (Object.keys(updatedTask).length === 0) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "No se proporcionó información para actualizar."
      );
    }

    const taskIndex = Tasks.findIndex((task) => task.task_id === taskId);

    if (taskIndex === -1) {
      return createErrorResponse(HTTP_STATUS.NOT_FOUND, "Tarea no encontrada.");
    }

    //; Validar solo los campos proporcionados en la actualización
    for (const field in updatedTask) {
      const error = validateInput(updatedTask, [field]);
      if (error) return error;
    }

    //; Realizar la actualización
    Tasks[taskIndex] = { ...Tasks[taskIndex], ...updatedTask };

    //; Guardar los cambios en localStorage
    saveAllTablesToLocalStorage();

    return {
      status: HTTP_STATUS.OK,
      message: "Tarea actualizada exitosamente.",
      data: Tasks[taskIndex],
    };
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al actualizar la tarea."
    );
  }
};

/**
 * Función para eliminar una tarea (simulación de DELETE).
 * @param {number} taskId - ID de la tarea que se va a eliminar.
 * @returns {Object} Un objeto con `status`, `message` y `data` (tarea eliminada o null si no se encontró).
 */
const deleteTask = (taskId) => {
  try {
    if (typeof taskId !== "number" || taskId <= 0) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        "ID de tarea inválido."
      );
    }

    const taskIndex = Tasks.findIndex((task) => task.task_id === taskId);
    if (taskIndex !== -1) {
      const deletedTask = Tasks.splice(taskIndex, 1)[0];

      //; Guardar los cambios en localStorage
      saveAllTablesToLocalStorage();

      return {
        status: HTTP_STATUS.OK,
        message: "Tarea eliminada exitosamente.",
        data: deletedTask,
      };
    }
    return createErrorResponse(HTTP_STATUS.NOT_FOUND, "Tarea no encontrada.");
  } catch (error) {
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Error al eliminar la tarea."
    );
  }
};

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
