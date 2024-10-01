import ApiService from "../ApiService.mjs";
import jwt from "jsonwebtoken"; //; Importamos jsonwebtoken
import { StatusCodes } from "http-status-codes";
import Logger from "../../../../../../backend/src/utils/logger";

//*MARK: FUNTIONS

//
//
//
//

//;MARK:*
//^ Función auxiliar para crear un usuario temporal

async function createTemporaryUser() {
  let newUser = {
    fullName: "Usuario Temporal Tests", //; Este formato es necesario para separar el nombre
    username: "userTemp",
    password: "Password123.",
    role: "admin",
    email: "userTemp@example.com",
    telephone: "987654321",
    dni: "98765432L",
    address: "Calle Real 456",
    postal_code: "08002",
  };

  const [name, firstname, ...lastnameArray] = newUser.fullName.split(" ");
  const lastname = lastnameArray.join(" ");

  const body = {
    username: newUser.username,
    password: newUser.password,
    role: newUser.role.toLowerCase(),
    name,
    firstname,
    lastname,
    email: newUser.email,
    telephone: newUser.telephone,
    dni: newUser.dni,
    address: newUser.address,
    postal_code: newUser.postal_code,
  };

  const registerResponse = await ApiService.post(
    ApiService.urls.auth.register,
    body
  );

  // Logger.information("registerResponse: ", registerResponse);
  expect(registerResponse.status).toBe(StatusCodes.CREATED);
  return registerResponse.data.id; //; Devolvemos el ID del usuario creado
}

async function deleteUserTemporal(userId) {
  //; Eliminamos el usuario después de ejecutar todas las pruebas
  const deleteUserResponse = await ApiService.delete(
    ApiService.urls.users.delete(userId)
  );

  // Logger.information("deleteUserResponse: ", deleteUserResponse);
  expect(deleteUserResponse.status).toBe(StatusCodes.OK); //; Código de éxito para eliminación
}

//*MARK: USER
describe("ApiService - Registro, Login, Verificación y Gestión de usuarios (conexión real)", () => {
  let newUser = {
    fullName: "Juan Perez Lopez", //; Este formato es necesario para separar el nombre
    username: "juanperez",
    password: "Password123.",
    role: "admin",
    email: "juanperez@example.com",
    telephone: "123456789",
    dni: "12345678L",
    address: "Calle Falsa 123",
    postal_code: "08001",
  };

  let userId; //; Variable para almacenar el ID del nuevo usuario

  let token;

  it("registrar un nuevo usuario correctamente", async () => {
    const [name, firstname, ...lastnameArray] = newUser.fullName.split(" ");
    const lastname = lastnameArray.join(" ");

    const body = {
      username: newUser.username,
      password: newUser.password,
      role: newUser.role.toLowerCase(),
      name,
      firstname,
      lastname,
      email: newUser.email,
      telephone: newUser.telephone,
      dni: newUser.dni,
      address: newUser.address,
      postal_code: newUser.postal_code,
    };

    const registerResponse = await ApiService.post(
      ApiService.urls.auth.register,
      body
    );

    // Logger.information("registerResponse: ", registerResponse);
    expect(registerResponse.status).toBe(StatusCodes.CREATED);
    expect(registerResponse).toEqual(
      expect.objectContaining({
        status: expect.any(Number),
        data: expect.any(Object),
        message: expect.any(String),
      })
    );

    // Logger.information("registerResponse: ", registerResponse);
    //; Guardamos el ID del usuario registrado
    userId = registerResponse.data.id;
  });

  it("iniciar sesión y obtener un token JWT válido", async () => {
    const loginResponse = await ApiService.post(ApiService.urls.auth.login, {
      username: newUser.username,
      password: newUser.password,
    });

    // Logger.information("loginResponse: ", loginResponse);
    expect(loginResponse.status).toBe(StatusCodes.OK);
    expect(loginResponse.message).toBe("Login successful");
    expect(loginResponse.data).toHaveProperty("token");

    token = loginResponse.data.token;

    const decodedToken = jwt.decode(token);

    expect(decodedToken).not.toBeNull();
    expect(decodedToken).toHaveProperty("user");
    expect(decodedToken).toHaveProperty("exp");
    expect(decodedToken.user).toHaveProperty("username", newUser.username);
  });

  it("verificar el token JWT correctamente", async () => {
    const verifyResponse = await ApiService.get(
      ApiService.urls.auth.verify,
      token
    );

    // Logger.information("verifyResponse: ", verifyResponse);
    expect(verifyResponse.status).toBe(StatusCodes.OK);
  });

  it("obtener todos los usuarios correctamente", async () => {
    const getAllUsersResponse = await ApiService.get(
      ApiService.urls.users.getAll
    );

    // Logger.information("getAllUsersResponse: ", getAllUsersResponse);
    expect(getAllUsersResponse.status).toBe(StatusCodes.OK);
    expect(Array.isArray(getAllUsersResponse.data)).toBe(true);
    expect(getAllUsersResponse.data.length).toBeGreaterThan(0);
  });

  it("obtener el perfil del usuario recién registrado por id", async () => {
    const getUserResponse = await ApiService.get(
      ApiService.urls.users.getById(userId)
    );

    // Logger.information("getUserResponse: ", getUserResponse);
    expect(getUserResponse.status).toBe(StatusCodes.OK);
    expect(getUserResponse.data).toEqual(
      expect.objectContaining({
        id: userId,
        username: newUser.username,
        email: newUser.email,
      })
    );
  });

  it("eliminar el usuario recién registrado", async () => {
    const deleteResponse = await ApiService.delete(
      ApiService.urls.users.delete(userId)
    );

    // Logger.information("deleteResponse: ", deleteResponse);
    expect(deleteResponse.status).toBe(StatusCodes.OK); //; Código de éxito para eliminación
  });
});

//*MARK: TASK
describe("ApiService - Creación, Actualización, Eliminación y Gestión de tareas (conexión real)", () => {
  let userId; //; Variable para almacenar el ID del nuevo usuario
  let taskId; //; Variable para almacenar el ID de la tarea creada

  beforeAll(async () => {
    //; Creamos el usuario antes de ejecutar las pruebas
    userId = await createTemporaryUser();
  });

  afterAll(async () => {
    await deleteUserTemporal(userId);
  });

  it("crear una nueva tarea correctamente", async () => {
    const newTask = {
      title: "Limpieza del piso 1",
      description: "Revisar limpieza del piso 1",
      is_done: false,
      user_id: userId, //; Usamos el user_id del nuevo usuario
    };

    const createTaskResponse = await ApiService.post(
      ApiService.urls.tasks.create,
      newTask
    );

    // Logger.information("createTaskResponse: ", createTaskResponse);
    expect(createTaskResponse.status).toBe(StatusCodes.CREATED);
    taskId = createTaskResponse.data.id;
  });

  it("actualizar la tarea correctamente", async () => {
    const updatedTask = {
      title: "Limpieza del piso 1 Actualizada",
      description: "Revisar nuevamente la limpieza del piso 1",
      is_done: true,
      user_id: userId, //; Mantener el mismo usuario
    };

    const updateTaskResponse = await ApiService.put(
      ApiService.urls.tasks.update(taskId),
      updatedTask
    );

    // Logger.information("updateTaskResponse: ", updateTaskResponse);
    expect(updateTaskResponse.status).toBe(StatusCodes.OK);
  });

  it("obtener todas las tareas correctamente", async () => {
    const getAllTasksResponse = await ApiService.get(
      ApiService.urls.tasks.getAll
    );

    // Logger.information("getAllTasksResponse: ", getAllTasksResponse);
    expect(getAllTasksResponse.status).toBe(StatusCodes.OK);
    expect(Array.isArray(getAllTasksResponse.data)).toBe(true);
    expect(getAllTasksResponse.data.length).toBeGreaterThan(0);
  });

  it("obtener todas las tareas completadas del usuario", async () => {
    const getCompletedTasksResponse = await ApiService.get(
      ApiService.urls.tasks.getCompleted(userId)
    );

    // Logger.information(
    //   "getCompletedTasksResponse: ",
    //   getCompletedTasksResponse
    // );
    expect(getCompletedTasksResponse.status).toBe(StatusCodes.OK);
    expect(Array.isArray(getCompletedTasksResponse.data)).toBe(true);
    expect(getCompletedTasksResponse.data.length).toBeGreaterThan(0);
    expect(getCompletedTasksResponse.data[0].is_done).toBe(true);
  });

  it("eliminar la tarea recién creada", async () => {
    const deleteTaskResponse = await ApiService.delete(
      ApiService.urls.tasks.delete(taskId)
    );

    // Logger.information("deleteTaskResponse: ", deleteTaskResponse);
    expect(deleteTaskResponse.status).toBe(StatusCodes.OK); //; Código de éxito para eliminación
  });
});

//*MARK: NOTE
describe("ApiService - Creación, Actualización, Eliminación y Gestión de notas (conexión real)", () => {
  let userId; //; Variable para almacenar el ID del nuevo usuario
  let noteId; //; Variable para almacenar el ID de la nota creada

  beforeAll(async () => {
    //; Creamos el usuario antes de ejecutar las pruebas
    userId = await createTemporaryUser();
  });

  afterAll(async () => {
    await deleteUserTemporal(userId);
  });

  it("crear una nueva nota correctamente", async () => {
    const newNote = {
      title: "Revisión de seguridad",
      description: "Revisar todos los sistemas de seguridad en la planta baja.",
      user_id: userId, //; Usamos el user_id del nuevo usuario
    };

    const createNoteResponse = await ApiService.post(
      ApiService.urls.notes.create,
      newNote
    );

    // Logger.information("createNoteResponse: ", createNoteResponse);
    expect(createNoteResponse.status).toBe(StatusCodes.CREATED);
    noteId = createNoteResponse.data.id;
  });

  it("actualizar la nota correctamente", async () => {
    const updatedNote = {
      title: "Revisión de seguridad Actualizada",
      description: "Revisar de nuevo los sistemas de seguridad.",
      user_id: userId, //; Mantener el mismo usuario
    };

    const updateNoteResponse = await ApiService.put(
      ApiService.urls.notes.update(noteId),
      updatedNote
    );

    // Logger.information("updateNoteResponse: ", updateNoteResponse);
    expect(updateNoteResponse.status).toBe(StatusCodes.OK);
  });

  it("obtener todas las notas correctamente", async () => {
    const getAllNotesResponse = await ApiService.get(
      ApiService.urls.notes.getAll
    );

    // Logger.information("getAllNotesResponse: ", getAllNotesResponse);
    expect(getAllNotesResponse.status).toBe(StatusCodes.OK);
    expect(Array.isArray(getAllNotesResponse.data)).toBe(true);
    expect(getAllNotesResponse.data.length).toBeGreaterThan(0);
  });

  it("obtener una nota por su ID", async () => {
    const getNoteByIdResponse = await ApiService.get(
      ApiService.urls.notes.getById(noteId)
    );

    // Logger.information("getNoteByIdResponse: ", getNoteByIdResponse);
    expect(getNoteByIdResponse.status).toBe(StatusCodes.OK);
    expect(getNoteByIdResponse.data.id).toBe(noteId);
  });

  it("eliminar la nota recién creada", async () => {
    const deleteNoteResponse = await ApiService.delete(
      ApiService.urls.notes.delete(noteId)
    );

    // Logger.information("deleteNoteResponse: ", deleteNoteResponse);
    expect(deleteNoteResponse.status).toBe(StatusCodes.OK); //; Código de éxito para eliminación
  });
});
