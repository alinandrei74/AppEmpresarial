import { v4 as uuidv4 } from "uuid"; // Importa la librería para generar UUIDs

// ;todo---MARK: Tablas de simulación de backend

//* Simulación de la tabla de Usuarios (users)
const Users = [
  {
    user_id: "uuid-1",
    username: "Admin",
    password: "Admin1.", // Nota: nunca almacenes contraseñas en texto plano en un entorno de producción.
    role_name: "admin",
  },
  {
    user_id: "uuid-2",
    username: "Limpieza",
    password: "Limpieza1.",
    role_name: "cleaning",
  },
  {
    user_id: "uuid-3",
    username: "Entrega",
    password: "Entrega1.",
    role_name: "delivery",
  },
  {
    user_id: "uuid-4",
    username: "Mantenimiento",
    password: "Mantenimiento1.",
    role_name: "maintenance",
  },
];

//* Simulación de la tabla de Información Personal de Usuarios (user_personal_data)
const UserPersonalData = [
  {
    user_id: "uuid-1",
    first_name: "John",
    last_name: "Doe",
    middle_name: "Smith",
  },
  {
    user_id: "uuid-2",
    first_name: "Jane",
    last_name: "Doe",
    middle_name: "Smith",
  },
  {
    user_id: "uuid-3",
    first_name: "Michael",
    last_name: "Johnson",
    middle_name: "Brown",
  },
  {
    user_id: "uuid-4",
    first_name: "Emily",
    last_name: "Taylor",
    middle_name: "Martinez",
  },
];

//* Simulación de la tabla de Información de Contacto de Usuarios (user_contact_data)
const UserContactData = [
  {
    user_id: "uuid-1",
    email: "example1@example.com",
    phone_number: "1234567890",
  },
  {
    user_id: "uuid-2",
    email: "example2@example.com",
    phone_number: "2345678901",
  },
  {
    user_id: "uuid-3",
    email: "example3@example.com",
    phone_number: "3456789012",
  },
  {
    user_id: "uuid-4",
    email: "example4@example.com",
    phone_number: "4567890123",
  },
];

//* Simulación de la tabla de Información Adicional de Usuarios (user_additional_data)
const UserAdditionalData = [
  {
    user_id: "uuid-1",
    dni: "123456789A",
    address: "123 Example St",
    postal_code: "12345",
  },
  {
    user_id: "uuid-2",
    dni: "234567890B",
    address: "456 Test Ave",
    postal_code: "23456",
  },
  {
    user_id: "uuid-3",
    dni: "345678901C",
    address: "789 Sample Rd",
    postal_code: "34567",
  },
  {
    user_id: "uuid-4",
    dni: "456789012D",
    address: "012 Mockingbird Ln",
    postal_code: "45678",
  },
];

//* Simulación de la tabla de Tareas Generales (general_tasks)
const GeneralTasks = [
  {
    task_id: 1,
    description: "Revisar limpieza del piso 1",
    status: "pending",
    user_id: "uuid-2",
    entry_date: "2024-08-25",
  },
  {
    task_id: 2,
    description: "Reparación de tuberías en el apartamento 2B",
    status: "done",
    user_id: "uuid-4",
    entry_date: "2024-08-26",
  },
  {
    task_id: 3,
    description: "Entrega de correo a la recepción",
    status: "canceled",
    user_id: "uuid-3",
    entry_date: "2024-08-27",
  },
];

// ;todo---MARK: Funciones de simulación de backend

const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora en milisegundos

/**
 * Función para generar un token simulado (base64) para autenticación.
 * @param {string} userId - El ID del usuario.
 * @returns {string} Un token simulado.
 */
const generateToken = (userId) => {
  const expirationTime = new Date().getTime() + TOKEN_EXPIRATION_TIME; // Hora actual + 1 hora
  return btoa(`${userId}:${expirationTime}`);
};

/**
 * Función para verificar un token de autenticación.
 * @param {string} token - El token de autenticación.
 * @returns {Object|number} Los datos del usuario si el token es válido, `-1` si el token ha caducado, `0` si el token es incorrecto.
 */
const verifyToken = (token) => {
  try {
    const decoded = atob(token).split(":");
    const userId = decoded[0];
    const expirationTime = parseInt(decoded[1], 10);

    // Verificar si el token ha caducado
    if (new Date().getTime() > expirationTime) {
      console.warn("El token ha caducado.");
      return -1; // Código de error para token caducado
    }

    const user = getUserData(userId);

    // Verificar si el usuario existe
    if (!user) {
      console.warn("El token es incorrecto o el usuario no existe.");
      return 0; // Código de error para token incorrecto
    }

    return user; // Retorna los datos del usuario si todo es válido
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return 0; // Código de error para token incorrecto
  }
};

/**
 * Función para registrar un nuevo usuario.
 * @param {Object} userData - Datos del usuario para registrar.
 * @returns {Object|null} El token de autenticación y los datos del usuario, o `null` si el registro falla.
 */
const registerUser = (userData) => {
  const { username, password, role_name } = userData;

  // Verifica si el nombre de usuario ya existe
  if (Users.some((user) => user.username === username)) {
    return null;
  }

  const newUserId = uuidv4(); // Genera un nuevo UUID para el usuario
  const newUser = { user_id: newUserId, username, password, role_name };
  Users.push(newUser);

  // Generar un token de autenticación
  const token = generateToken(newUserId);

  return { token, user: newUser };
};

/**
 * Función para autenticar un usuario.
 * @param {string} username - El nombre de usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Object|null} El token de autenticación y los datos del usuario, o `null` si la autenticación falla.
 */
const loginUser = (username, password) => {
  const user = Users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return null;

  // Generar un token de autenticación
  const token = generateToken(user.user_id);

  return { token, user };
};

/**
 * Función para obtener todos los datos relacionados con un usuario específico por su user_id.
 * Esta función recupera los datos de autenticación del usuario, sus datos personales,
 * datos de contacto, datos adicionales y las tareas asignadas a él.
 *
 * @param {string} userId - El ID del usuario para el cual se recuperarán los datos.
 * @returns {Object|null} Un objeto que contiene todos los datos del usuario, incluyendo:
 * - `user`: Datos de autenticación del usuario.
 * - `personalData`: Información personal del usuario.
 * - `contactData`: Información de contacto del usuario.
 * - `additionalData`: Información adicional del usuario.
 * - `tasks`: Lista de tareas asignadas al usuario.
 * Si el usuario no se encuentra, devuelve `null`.
 *
 * @example
 * const userData = getUserData("uuid-1");
 * console.log(userData);
 * // {
 * //   user_id: "uuid-1",
 * //   username: "Admin",
 * //   password: "Admin1.",
 * //   role_name: "admin",
 * //   personalData: { first_name: "John", last_name: "Doe", middle_name: "Smith" },
 * //   contactData: { email: "example1@example.com", phone_number: "1234567890" },
 * //   additionalData: { dni: "123456789A", address: "123 Example St", postal_code: "12345" },
 * //   tasks: [{ task_id: 1, description: "Revisar limpieza del piso 1", status: "pending", ... }]
 * // }
 */
const getUserData = (userId) => {
  const user = Users.find((u) => u.user_id === userId);
  if (!user) return null;

  const personalData = UserPersonalData.find((data) => data.user_id === userId);
  const contactData = UserContactData.find((data) => data.user_id === userId);
  const additionalData = UserAdditionalData.find(
    (data) => data.user_id === userId
  );
  const tasks = GeneralTasks.filter((task) => task.user_id === userId);

  return {
    ...user,
    personalData,
    contactData,
    additionalData,
    tasks,
  };
};

// ;todo---MARK: Funciones de simulación de tareas

/**
 * Función para obtener todas las tareas generales.
 * @returns {Array<Object>} Lista de todas las tareas generales.
 * @example
 * const tasks = getAllTasks();
 * console.log(tasks); // Muestra todas las tareas en la consola.
 */
const getAllTasks = () => {
  return GeneralTasks;
};

/**
 * Función para crear una nueva tarea (simulación de POST).
 * @param {Object} newTask - Objeto que representa la nueva tarea a crear.
 * @param {string} newTask.description - Descripción de la tarea.
 * @param {string} newTask.status - Estado de la tarea (ej. 'pending', 'done', 'canceled').
 * @param {string} newTask.user_id - ID del usuario al que se asigna la tarea.
 * @param {string} newTask.entry_date - Fecha de creación de la tarea en formato 'YYYY-MM-DD'.
 * @returns {Object} La nueva tarea creada con su `task_id`.
 * @example
 * const newTask = {
 *   description: "Nueva tarea de ejemplo",
 *   status: "pending",
 *   user_id: "uuid-3",
 *   entry_date: "2024-09-01"
 * };
 * const createdTask = createTask(newTask);
 * console.log(createdTask); // Muestra la nueva tarea creada con su task_id.
 */
const createTask = (newTask) => {
  const newTaskId = GeneralTasks.length + 1;
  const task = { task_id: newTaskId, ...newTask };
  GeneralTasks.push(task);
  return task;
};

/**
 * Función para actualizar una tarea existente (simulación de PUT).
 * @param {number} taskId - ID de la tarea que se va a actualizar.
 * @param {Object} updatedTask - Objeto que contiene los campos a actualizar de la tarea.
 * @returns {Object|null} La tarea actualizada o `null` si no se encontró la tarea.
 * @example
 * const updatedTask = updateTask(2, { status: "done" });
 * console.log(updatedTask); // Muestra la tarea actualizada o `null` si no se encontró.
 */
const updateTask = (taskId, updatedTask) => {
  const taskIndex = GeneralTasks.findIndex((task) => task.task_id === taskId);
  if (taskIndex !== -1) {
    GeneralTasks[taskIndex] = { ...GeneralTasks[taskIndex], ...updatedTask };
    return GeneralTasks[taskIndex];
  }
  return null;
};

/**
 * Función para eliminar una tarea (simulación de DELETE).
 * @param {number} taskId - ID de la tarea que se va a eliminar.
 * @returns {Object|null} La tarea eliminada o `null` si no se encontró la tarea.
 * @example
 * const deletedTask = deleteTask(3);
 * console.log(deletedTask); // Muestra la tarea eliminada o `null` si no se encontró.
 */
const deleteTask = (taskId) => {
  const taskIndex = GeneralTasks.findIndex((task) => task.task_id === taskId);
  if (taskIndex !== -1) {
    return GeneralTasks.splice(taskIndex, 1)[0];
  }
  return null;
};

//* Exportar las tablas y funciones simuladas
export {
  Users,
  UserPersonalData,
  UserContactData,
  UserAdditionalData,
  GeneralTasks,
  getUserData,
  registerUser,
  loginUser,
  verifyToken,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
