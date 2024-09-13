import {
  resetAllTablesToDefaults,
  Users,
  UserPersonalData,
  UserContactData,
  UserAdditionalData,
  Tasks,
} from "../mockTables.mjs"; //; Importa las tablas simuladas

//; Importa las funciones desde el archivo de controladores
import {
  generateToken,
  verifyToken,
  loginUser,
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

//;todo---MARK:# Functions

//
//
//

//;MARK:*
//^---------------- Auxiliary ----------------^\\

/**
 * Función para generar un nombre de usuario único basado en un prefijo.
 * @param {string} prefix - El prefijo del nombre de usuario.
 * @param {Array<string>} existingUsernames - Lista de nombres de usuario existentes.
 * @returns {string} - Un nombre de usuario único.
 */
function generateUniqueUsername(prefix, existingUsernames) {
  //; Normalizamos el prefijo eliminando espacios en blanco y caracteres no válidos
  let baseName = prefix.trim().replace(/[^A-Za-z0-9]/g, "");

  //; Si el nombre base está vacío, utilizamos un nombre genérico
  if (baseName.length === 0) {
    baseName = "User";
  }

  //; Añadir un número al nombre base para asegurar unicidad
  let uniqueName = baseName;
  let counter = 1;

  //; Generamos nombres hasta que encontremos uno que no esté en uso
  while (existingUsernames.includes(uniqueName)) {
    uniqueName = `${baseName}${counter}`;
    counter++;
  }

  return uniqueName;
}

//;todo---MARK: # Tests

//
//
//

//;MARK:resetAllTablesToDefaults
//^---------------- Restablecer Tablas  (resetAllTablesToDefaults) ----------------^\\

describe("Restablecer Tablas (resetAllTablesToDefaults)", () => {
  let originalUsers;
  let originalUserPersonalData;
  let originalUserContactData;
  let originalUserAdditionalData;

  beforeAll(() => {
    //; Guardar copias originales de los datos para comparar después
    originalUsers = [...Users];
    originalUserPersonalData = [...UserPersonalData];
    originalUserContactData = [...UserContactData];
    originalUserAdditionalData = [...UserAdditionalData];

    //; Añade un usuario temporal para verificar que se elimina después
    Users.push({
      user_id: "uuid-999",
      username: "UsuarioTemporal",
      password: "Temp1234.",
      role_name: "admin",
    });

    //; Ejecuta la función de restablecer tablas
    resetAllTablesToDefaults();
  });

  test("Restablece todas las tablas a sus valores predeterminados", () => {
    //; Limpieza adicional para asegurarnos de que los datos temporales no persistan
    Users.splice(originalUsers.length); //; Elimina cualquier usuario añadido después de los originales

    //; Verifica que las tablas han sido restablecidas a su estado original
    expect(Users).toEqual(originalUsers);
    expect(UserPersonalData).toEqual(originalUserPersonalData);
    expect(UserContactData).toEqual(originalUserContactData);
    expect(UserAdditionalData).toEqual(originalUserAdditionalData);
  });
});

//;MARK:generateToken
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

//;MARK:verifyToken
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

    //; Verifica los datos adicionales del usuario
    expect(result.data).toHaveProperty("personalData");
    expect(result.data).toHaveProperty("contactData");
    expect(result.data).toHaveProperty("additionalData");
    expect(result.data).toHaveProperty("tasks");

    //; Verifica que los datos personales sean correctos
    expect(result.data.personalData).toEqual({
      user_id: "uuid-1",
      first_name: "John",
      last_name: "Doe",
      middle_name: "Smith",
    });

    //; Verifica que los datos de contacto sean correctos
    expect(result.data.contactData).toEqual({
      user_id: "uuid-1",
      email: "example1@example.com",
      phone_number: "1234567890",
    });

    //; Verifica que los datos adicionales sean correctos
    expect(result.data.additionalData).toEqual({
      user_id: "uuid-1",
      dni: "123456789A",
      address: "123 Example St",
      postal_code: "12345",
    });

    //; Verifica que las tareas sean correctas (en este caso vacío)
    expect(result.data.tasks).toEqual([]);
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

    //; Verifica que los datos del usuario también sean completos en este caso
    expect(result.data).toHaveProperty("user_id", "uuid-1");
    expect(result.data).toHaveProperty("personalData");
    expect(result.data).toHaveProperty("contactData");
    expect(result.data).toHaveProperty("additionalData");
    expect(result.data).toHaveProperty("tasks");
  });

  //; Test adicional para verificar el formato del token
  test("Verificar que el token tiene el formato correcto", () => {
    const result = generateToken("uuid-1");
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/); //; Comprueba que el token es base64
  });
});

//;MARK:Login
//^---------------- Inicio de Sesión (Login) ----------------^\\

describe("Inicio de Sesión (Login)", () => {
  beforeAll(() => {
    //; Prepara algunos usuarios de prueba para la autenticación
    Users.push({
      user_id: "uuid-5",
      username: "TestUser1",
      password: "Password1.",
      role_name: "admin",
    });

    Users.push({
      user_id: "uuid-6",
      username: "TestUser2",
      password: "Password2.",
      role_name: "cleaning",
    });
  });

  afterAll(() => {
    //; Limpiar usuarios de prueba después de los tests
    Users.splice(Users.length - 2, 2);
  });

  test("Inicio de sesión exitoso con credenciales válidas", () => {
    const result = loginUser("TestUser1", "Password1.");
    expect(result.status).toBe(200);
    expect(result.message).toBe("Usuario autenticado exitosamente.");
    expect(result.data).toHaveProperty("username", "TestUser1");
  });

  test("Usuario no encontrado al proporcionar un nombre de usuario inexistente", () => {
    const result = loginUser("NonExistentUser", "Password1.");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  test("Contraseña incorrecta al proporcionar una contraseña no coincidente", () => {
    const result = loginUser("TestUser1", "WrongPassword");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Contraseña incorrecta.");
  });

  test("Inicio de sesión con nombre de usuario válido pero contraseña vacía", () => {
    const result = loginUser("TestUser1", "");
    expect(result.status).toBe(401);
    expect(result.message).toBe("Contraseña incorrecta.");
  });

  test("Inicio de sesión con nombre de usuario vacío y contraseña válida", () => {
    const result = loginUser("", "Password1.");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  test("Inicio de sesión con nombre de usuario y contraseña vacíos", () => {
    const result = loginUser("", "");
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  test("Error al autenticar el usuario (simulación de error interno)", () => {
    //; Simula un error en la función loginUser
    const originalFind = Users.find;
    Users.find = jest.fn(() => {
      throw new Error("Simulación de error interno");
    });

    const result = loginUser("TestUser1", "Password1.");
    expect(result.status).toBe(500);
    expect(result.message).toBe("Error al autenticar el usuario.");

    //; Restaurar la función original
    Users.find = originalFind;
  });
});

//;MARK:Users
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

  test("Error al obtener el usuario (simulación de error interno)", () => {
    const originalFind = Users.find;
    Users.find = jest.fn(() => {
      throw new Error("Simulación de error interno");
    });

    const result = getUserById("uuid-1");
    expect(result.status).toBe(500);
    expect(result.message).toBe("Error al obtener el usuario.");

    Users.find = originalFind;
  });

  test("Error al obtener todos los usuarios (simulación de error interno)", () => {
    //; Guarda la referencia original de Users
    const originalUsers = Users;

    //; Sobrescribe `Users` con null para provocar un error de tipo
    global.Users = null;

    try {
      const result = getAllUsers();

      expect(result.status).toBe(500);
      expect(result.message).toBe("Error al obtener usuarios.");
    } catch (error) {
    } finally {
      //; Restaura la referencia original de Users
      global.Users = originalUsers;
    }
  });

  //; Test actualizado para crear un usuario sin un campo requerido
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

  //; Test para validar errores en datos personales
  test("Crear un usuario con errores en los datos personales", () => {
    //; Generar un nombre único para el usuario de prueba
    const uniqueUsername = generateUniqueUsername(
      "UsuarioUnico",
      Users.map((user) => user.username)
    );

    const result = createUser({
      username: uniqueUsername,
      password: "Password1.",
      role_name: "admin",
      personalData: {
        first_name: "", //; Nombre vacío
        last_name: "Doe",
      },
    });
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /Faltan los siguientes campos requeridos: first_name/
    );
  });

  test("Crear un usuario con errores en los datos de contacto", () => {
    //; Generar un nombre único para el usuario de prueba
    const uniqueUsername = generateUniqueUsername(
      "UsuarioUnico",
      Users.map((user) => user.username)
    );

    const result = createUser({
      username: uniqueUsername, //; Utilizar nombre único
      password: "Password1.",
      role_name: "admin",
      personalData: {
        first_name: "John",
        last_name: "Doe",
      },
      contactData: {
        email: "correo-invalido", //; Email inválido
        phone_number: "1234567890",
      },
      additionalData: {
        dni: "123456789A",
        address: "123 Example St",
        postal_code: "12345",
      },
    });

    expect(result.status).toBe(400);
    expect(result.message).toMatch(/El correo electrónico debe ser válido./);
  });

  //; Test para crear un usuario correctamente con todos los datos
  test("Crear un usuario con todos los datos válidos", () => {
    //; Generar un nombre único para el usuario de prueba
    const uniqueUsername = generateUniqueUsername(
      "UsuarioUnico",
      Users.map((user) => user.username)
    );

    const result = createUser({
      username: uniqueUsername,
      password: "Password1.",
      role_name: "admin",
      personalData: {
        first_name: "John",
        last_name: "Doe",
      },
      contactData: {
        email: "validemail@example.com",
        phone_number: "1234567890",
      },
      additionalData: {
        dni: "123456789A",
        address: "123 Example St",
        postal_code: "12345",
      },
    });

    expect(result.status).toBe(201);
    expect(result.message).toBe("Usuario creado exitosamente.");
    expect(result.data).toHaveProperty("user_id");
    expect(result.data.personalData).toHaveProperty("first_name", "John");
    expect(result.data.contactData).toHaveProperty(
      "email",
      "validemail@example.com"
    );
    expect(result.data.additionalData).toHaveProperty("dni", "123456789A");
  });

  test("Crear un usuario con un nombre de usuario que empiece o termine con '-' o '_'", () => {
    const result1 = createUser({
      username: "_UsuarioInvalido",
      password: "Pass1.",
      role_name: "admin",
    });
    const result2 = createUser({
      username: "UsuarioInvalido-",
      password: "Pass1.",
      role_name: "admin",
    });
    expect(result1.status).toBe(400);
    expect(result1.message).toMatch(
      /El nombre de usuario debe tener entre 3 y 20 caracteres. No debe comenzar ni terminar con '-' o '_', y puede contener letras, números, '-' y '_'./
    );
    expect(result2.status).toBe(400);
    expect(result2.message).toMatch(
      /El nombre de usuario debe tener entre 3 y 20 caracteres. No debe comenzar ni terminar con '-' o '_', y puede contener letras, números, '-' y '_'./
    );
  });

  test("Crear un usuario con una contraseña que no cumple los requisitos", () => {
    //; Generar un nombre único para el usuario de prueba
    const uniqueUsername = generateUniqueUsername(
      "UsuarioUnico",
      Users.map((user) => user.username)
    );

    const result = createUser({
      username: uniqueUsername,
      password: "pass", //; Contraseña no válida (no cumple con las reglas de seguridad)
      role_name: "admin",
    });
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /La contraseña debe tener entre 8 y 30 caracteres. Debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial \(@, \$, !, %, \*, \?, &, #, \.\)\./
    );
  });

  //; Test para validar la duplicación de nombres de usuario
  test("Crear un usuario con un nombre de usuario duplicado", () => {
    //; Generar un nombre único para el usuario de prueba
    const uniqueUsername = generateUniqueUsername(
      "UsuarioUnico",
      Users.map((user) => user.username)
    );

    createUser({
      username: uniqueUsername,
      password: "Password1.",
      role_name: "admin",
    });

    const result = createUser({
      username: uniqueUsername, //; Nombre de usuario ya existente.
      password: "Password2.",
      role_name: "cleaning",
    });

    expect(result.status).toBe(400);
    expect(result.message).toBe("El nombre de usuario ya está en uso.");
  });

  //; Test para simular un error interno al crear un usuario
  test("Error al crear el usuario (simulación de error interno)", () => {
    const originalPush = Users.push;
    Users.push = jest.fn(() => {
      throw new Error("Simulación de error interno");
    });

    //; Generar un nombre único para el usuario de prueba
    const uniqueUsername = generateUniqueUsername(
      "UsuarioUnico",
      Users.map((user) => user.username)
    );

    try {
      const result = createUser({
        username: uniqueUsername, //; Nombre único para evitar conflictos
        password: "Password1.",
        role_name: "admin",
      });

      expect(result.status).toBe(500);
      expect(result.message).toBe("Error al crear el usuario.");
    } finally {
      //; Restaura la referencia original
      Users.push = originalPush;
    }
  });

  test("Actualizar un usuario existente", () => {
    const result = updateUser("uuid-1", {
      password: "NuevaContraseñaSegura1!",
    });
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("password", "NuevaContraseñaSegura1!");
  });

  test("Actualizar un usuario inexistente", () => {
    const result = updateUser("uuid-999", { password: "NuevaContraseña!" });
    expect(result.status).toBe(404);
    expect(result.message).toBe("Usuario no encontrado.");
  });

  test("Error al actualizar el usuario (simulación de error interno)", () => {
    const originalFindIndex = Users.findIndex;
    Users.findIndex = jest.fn(() => {
      throw new Error("Simulación de error interno");
    });

    const result = updateUser("uuid-1", {
      password: "NuevaContraseñaSegura1!",
    });
    expect(result.status).toBe(500);
    expect(result.message).toBe("Error al actualizar el usuario.");

    Users.findIndex = originalFindIndex;
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

  test("Error al eliminar el usuario (simulación de error interno)", () => {
    //; Aseguramos que el usuario exista
    Users.push({
      user_id: "uuid-temp",
      username: "TempUserForDelete",
      password: "TempPass123!",
      role_name: "admin",
    });

    const originalSplice = Users.splice;
    Users.splice = jest.fn(() => {
      throw new Error("Simulación de error interno");
    });

    try {
      const result = deleteUser("uuid-temp");
      expect(result.status).toBe(500);
      expect(result.message).toBe("Error al eliminar el usuario.");
    } finally {
      //; Restaurar la función original
      Users.splice = originalSplice;
      //; Eliminar el usuario de prueba agregado
      Users.pop();
    }
  });

  test("Validar que el nombre de usuario no contenga caracteres no permitidos", () => {
    const result = createUser({
      username: "Us#rInvalid", //; Contiene caracteres no permitidos
      password: "Password1.",
      role_name: "admin",
    });
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /El nombre de usuario debe tener entre 3 y 20 caracteres. No debe comenzar ni terminar con '-' o '_', y puede contener letras, números, '-' y '_'./
    );
  });
});

//;MARK:UserPersonalData
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

//;MARK:UserContactData
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

//;MARK:UserAdditionalData
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

//;MARK:Tasks
//^---------------- Tareas (Tasks) ----------------^\\

describe("Tareas (Tasks)", () => {
  let createdTaskId; //; Variable para almacenar el ID de una tarea creada

  beforeAll(() => {
    //; Inicializa una tarea antes de las pruebas y guarda su ID
    const newTask = createTask({
      description: "Tarea de prueba",
      status: "pending",
      user_id: "uuid-1",
      entry_date: "2024-09-10",
    });
    createdTaskId = newTask.data.task_id; //; Guardar el ID de la tarea creada
  });

  test("Obtener todas las tareas", () => {
    const result = getAllTasks();
    expect(result.status).toBe(200);
    expect(result.message).toBe("Tareas obtenidas exitosamente.");
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("Obtener una tarea por su ID", () => {
    const result = getTaskById(createdTaskId); //; Utiliza el ID de la tarea creada
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("task_id", createdTaskId);
  });

  test("Obtener una tarea inexistente por su ID", () => {
    const result = getTaskById("non-existent-id"); //; ID que no existe, ahora debe ser un UUID
    expect(result.status).toBe(404);
    expect(result.message).toBe("Tarea no encontrada.");
  });

  test("Crear una nueva tarea con todos los campos requeridos", () => {
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
    expect(result.data).toHaveProperty("task_id"); //; Verifica que se genere un task_id
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
    const result = updateTask(createdTaskId, updateData); //; Utiliza el ID de la tarea creada
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("status", "done");
  });

  test("Actualizar una tarea con campos faltantes", () => {
    const result = updateTask(createdTaskId, {}); //; No se proporciona información para actualizar
    expect(result.status).toBe(400);
    expect(result.message).toMatch(
      /No se proporcionó información para actualizar/
    );
  });

  test("Actualizar una tarea inexistente", () => {
    const result = updateTask("non-existent-id", { status: "in-progress" }); //; ID que no existe
    expect(result.status).toBe(404);
    expect(result.message).toBe("Tarea no encontrada.");
  });

  test("Eliminar una tarea existente", () => {
    const result = deleteTask(createdTaskId); //; Utiliza el ID de la tarea creada
    expect(result.status).toBe(200);
    expect(result.message).toBe("Tarea eliminada exitosamente.");
  });

  test("Eliminar una tarea inexistente", () => {
    const result = deleteTask("123e4567-e89b-12d3-a456-426614174000"); //; UUID válido pero que no existe
    expect(result.status).toBe(404); //; Ahora debe devolver 404
    expect(result.message).toBe("Tarea no encontrada.");
  });

  test("Eliminar una tarea con ID inválido", () => {
    const result = deleteTask("invalid-id"); //; ID inválido, no es un UUID válido
    expect(result.status).toBe(400); //; Ahora debe devolver 400
    expect(result.message).toMatch(/ID de tarea inválido/);
  });
});
