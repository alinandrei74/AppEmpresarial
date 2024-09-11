//; Importa las funciones desde el archivo de controladores
import {
  generateToken,
  verifyToken,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUserPersonalData,
  getUserPersonalDataById,
  updateUserPersonalData,
  getAllUserContactData,
  getUserContactDataById,
  updateUserContactData,
  getAllUserAdditionalData,
  getUserAdditionalDataById,
  updateUserAdditionalData,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../mockDatabase.mjs"; //; Importa los controladores desde el archivo relativo

//;MARK:*
//^---------------- Generar Token (generateToken) ----------------^\\

describe("Autenticación (Tokens)", () => {
  test("Generar un token válido", () => {
    const userId = "uuid-1";
    const token = generateToken(userId);
    expect(typeof token).toBe("string");
    expect(token).toMatch(/^[A-Za-z0-9+/=]+$/); //; Verifica que el token sea un string en base64
  });

  test("Generar token incluye userId y expiración", () => {
    const userId = "uuid-1";
    const token = generateToken(userId);
    const [decodedUserId, expirationTime] = atob(token).split(":");
    expect(decodedUserId).toBe(userId);
    expect(parseInt(expirationTime, 10)).toBeGreaterThan(new Date().getTime());
  });
});

//;MARK:*
//^---------------- Verificar Token (verifyToken) ----------------^\\

import { TOKEN_EXPIRATION_TIME, HTTP_STATUS } from "../mockDatabase.mjs"; //; Importa constantes necesarias

describe("Autenticación (Tokens)", () => {
  let validToken;
  let expiredToken;
  let invalidToken = "invalid.token.format";

  beforeAll(() => {
    const userId = "uuid-1";
    validToken = generateToken(userId);

    //; Genera un token caducado manipulando el tiempo de caducidad
    const pastTime = new Date().getTime() - TOKEN_EXPIRATION_TIME;
    expiredToken = btoa(`${userId}:${pastTime}`);
  });

  test("Generar un token válido", () => {
    const userId = "uuid-1";
    const token = generateToken(userId);
    expect(typeof token).toBe("string");
    expect(token).toMatch(/^[A-Za-z0-9+/=]+$/); //; Comprueba si el token es una cadena base64
  });

  test("Generar token incluye userId y expiración", () => {
    const userId = "uuid-1";
    const token = generateToken(userId);
    const [decodedUserId, expirationTime] = atob(token).split(":");
    expect(decodedUserId).toBe(userId);
    expect(parseInt(expirationTime, 10)).toBeGreaterThan(new Date().getTime());
  });

  test("Verificar un token válido", () => {
    const result = verifyToken(validToken);
    expect(result.status).toBe(HTTP_STATUS.OK);
    expect(result.message).toBe("Token verificado exitosamente.");
    expect(result.data).toHaveProperty("user_id", "uuid-1");
  });

  test("Verificar un token caducado", () => {
    const result = verifyToken(expiredToken);
    expect(result.status).toBe(HTTP_STATUS.FORBIDDEN);
    expect(result.message).toBe(
      "El token ha caducado. Por favor, inicie sesión de nuevo."
    );
  });

  test("Verificar un token con formato inválido", () => {
    const result = verifyToken(invalidToken);
    expect(result.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(result.message).toBe(
      "Token no válido. Error al decodificar el token."
    );
  });

  test("Verificar un token con un usuario inexistente", () => {
    //; Simula un token válido para un usuario inexistente
    const nonExistentUserToken = generateToken("non-existent-user");
    const result = verifyToken(nonExistentUserToken);
    expect(result.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(result.message).toBe(
      "Token no válido. Por favor, inicie sesión de nuevo."
    );
  });

  //; Test adicional para verificar un token nulo o vacío
  test("Verificar un token nulo o vacío", () => {
    const result = verifyToken(null);
    expect(result.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(result.message).toBe(
      "Token no proporcionado. Por favor, inicie sesión."
    );
  });

  //; Test adicional para verificar un token con expiración manipulada
  test("Verificar un token con expiración manipulada", () => {
    const manipulatedToken = btoa("uuid-1:9999999999999"); //; Fecha de expiración en el futuro lejano
    const result = verifyToken(manipulatedToken);
    expect(result.status).toBe(HTTP_STATUS.OK); //; Este test espera un estado OK porque el token es válido
    expect(result.message).toBe("Token verificado exitosamente.");
  });

  //; Test adicional para verificar el formato del token
  test("Verificar que el token tiene el formato correcto", () => {
    const result = generateToken("uuid-1");
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/); //; Comprueba que el token es base64
  });
});

//;MARK:*
//^---------------- Usuarios (Users) ----------------^\\

describe("Usuarios (Users)", () => {
  test("Obtener todos los usuarios", () => {
    const result = getAllUsers();
    expect(result.status).toBe(200);
    expect(result.message).toBe("Usuarios obtenidos exitosamente.");
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("Obtener un usuario por su ID", () => {
    const result = getUserById("uuid-1");
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("user_id", "uuid-1");
  });

  test("Obtener un usuario inexistente por su ID", () => {
    const result = getUserById("uuid-999");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  test("Crear un nuevo usuario", () => {
    const result = createUser({
      username: "NuevoUsuario",
      password: "NuevaPass1.",
      role_name: "user",
    });
    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty("username", "NuevoUsuario");
  });

  test("Crear un usuario sin un campo requerido", () => {
    const result = createUser({
      username: "UsuarioFaltante",
      password: "Pass1.",
      //; Falta 'role_name'
    });
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /Faltan los siguientes campos requeridos: role_name/
    );
  });

  test("Actualizar un usuario existente", () => {
    const result = updateUser("uuid-1", { password: "NuevaContraseñaSegura!" });
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("password", "NuevaContraseñaSegura!");
  });

  test("Actualizar un usuario inexistente", () => {
    const result = updateUser("uuid-999", { password: "NuevaContraseña!" });
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  test("Eliminar un usuario por su ID", () => {
    const result = deleteUser("uuid-1");
    expect(result.status).toBe(200);
    expect(result.message).toBe("Usuario eliminado exitosamente.");
  });

  test("Eliminar un usuario inexistente", () => {
    const result = deleteUser("uuid-999");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });
});

//;MARK:*
//^---------------- Información Personal de Usuarios (UserPersonalData) ----------------^\\

describe("Información Personal de Usuarios (UserPersonalData)", () => {
  test("Obtener toda la información personal de usuarios", () => {
    const result = getAllUserPersonalData();
    expect(result.status).toBe(200);
    expect(result.message).toBe(
      "Datos personales de usuarios obtenidos exitosamente."
    );
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("Obtener la información personal de un usuario por su ID", () => {
    const result = getUserPersonalDataById("uuid-1");
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("user_id", "uuid-1");
  });

  test("Obtener la información personal de un usuario inexistente", () => {
    const result = getUserPersonalDataById("uuid-999");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Datos personales no encontrados.");
  });

  test("Actualizar la información personal de un usuario", () => {
    const result = updateUserPersonalData("uuid-1", {
      first_name: "NuevoNombre",
    });
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("first_name", "NuevoNombre");
  });

  test("Actualizar la información personal de un usuario inexistente", () => {
    const result = updateUserPersonalData("uuid-999", { first_name: "Nombre" });
    expect(result.status).toBe(404);
    expect(result.message).toBe("Datos personales no encontrados.");
  });
});

//;MARK:*
//^---------------- Información de Contacto de Usuarios (UserContactData) ----------------^\\

describe("Información de Contacto de Usuarios (UserContactData)", () => {
  test("Obtener toda la información de contacto de usuarios", () => {
    const result = getAllUserContactData();
    expect(result.status).toBe(200);
    expect(result.message).toBe(
      "Datos de contacto de usuarios obtenidos exitosamente."
    );
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("Obtener la información de contacto de un usuario por su ID", () => {
    const result = getUserContactDataById("uuid-1");
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("user_id", "uuid-1");
  });

  test("Obtener la información de contacto de un usuario inexistente", () => {
    const result = getUserContactDataById("uuid-999");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Datos de contacto no encontrados.");
  });

  test("Actualizar la información de contacto de un usuario", () => {
    const result = updateUserContactData("uuid-1", {
      email: "nuevoemail@example.com",
    });
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("email", "nuevoemail@example.com");
  });

  test("Actualizar la información de contacto de un usuario inexistente", () => {
    const result = updateUserContactData("uuid-999", {
      email: "correo@example.com",
    });
    expect(result.status).toBe(404);
    expect(result.message).toBe("Datos de contacto no encontrados.");
  });
});

//;MARK:*
//^---------------- Información Adicional de Usuarios (UserAdditionalData) ----------------^\\

describe("Información Adicional de Usuarios (UserAdditionalData)", () => {
  test("Obtener toda la información adicional de usuarios", () => {
    const result = getAllUserAdditionalData();
    expect(result.status).toBe(200);
    expect(result.message).toBe(
      "Datos adicionales de usuarios obtenidos exitosamente."
    );
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("Obtener la información adicional de un usuario por su ID", () => {
    const result = getUserAdditionalDataById("uuid-1");
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("user_id", "uuid-1");
  });

  test("Obtener la información adicional de un usuario inexistente", () => {
    const result = getUserAdditionalDataById("uuid-999");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Datos adicionales no encontrados.");
  });

  test("Actualizar la información adicional de un usuario", () => {
    const result = updateUserAdditionalData("uuid-1", {
      address: "Nueva Dirección 123",
    });
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("address", "Nueva Dirección 123");
  });

  test("Actualizar la información adicional de un usuario inexistente", () => {
    const result = updateUserAdditionalData("uuid-999", {
      address: "Dirección desconocida",
    });
    expect(result.status).toBe(404);
    expect(result.message).toBe("Datos adicionales no encontrados.");
  });
});

describe("Tareas (Tasks)", () => {
  test("Obtener todas las tareas", () => {
    const result = getAllTasks();
    expect(result.status).toBe(200);
    expect(result.message).toBe("Tareas obtenidas exitosamente.");
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("Obtener una tarea por su ID", () => {
    const result = getTaskById(1);
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("task_id", 1);
  });

  test("Obtener una tarea inexistente por su ID", () => {
    const result = getTaskById(999);
    expect(result.status).toBe(404);
    expect(result.message).toBe("Tarea no encontrada.");
  });

  test("Crear una nueva tarea con todos los campos", () => {
    const newTask = {
      description: "Nueva tarea de ejemplo",
      status: "pending",
      user_id: "uuid-1",
      entry_date: "2024-09-10",
    };
    const result = createTask(newTask);
    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty("description", "Nueva tarea de ejemplo");
    expect(result.data).toMatchObject(newTask);
  });

  test("Crear una tarea con campos faltantes", () => {
    const incompleteTask = {
      description: "Tarea sin fecha",
      status: "pending",
      user_id: "uuid-1",
      //; Falta el campo 'entry_date'
    };
    const result = createTask(incompleteTask);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /Faltan los siguientes campos requeridos: entry_date/
    );
  });

  test("Actualizar una tarea existente", () => {
    const updateData = { status: "done" };
    const result = updateTask(1, updateData);
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("status", "done");
  });

  test("Actualizar una tarea existente con campos faltantes", () => {
    const result = updateTask(1, {}); //; No se proporciona información para actualizar
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /No se proporcionó información para actualizar/
    );
  });

  test("Actualizar una tarea inexistente", () => {
    const result = updateTask(999, { status: "in-progress" });
    expect(result.status).toBe(404);
    expect(result.message).toBe("Tarea no encontrada.");
  });

  test("Eliminar una tarea existente", () => {
    const result = deleteTask(1);
    expect(result.status).toBe(200);
    expect(result.message).toBe("Tarea eliminada exitosamente.");
  });

  test("Eliminar una tarea inexistente", () => {
    const result = deleteTask(999);
    expect(result.status).toBe(404);
    expect(result.message).toBe("Tarea no encontrada.");
  });

  test("Eliminar una tarea con ID inválido", () => {
    const result = deleteTask("invalid-id"); //; ID inválido
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/ID de tarea inválido/);
  });
});
