import ApiService from "../ApiService.mjs";
import jwt from "jsonwebtoken"; //; Importamos jsonwebtoken
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
    created_at: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString().split("T")[0],
  };

  const registerResponse = await ApiService.post(
    ApiService.urls.auth.register,
    body
  );

  expect(registerResponse.status).toBe(201);
  return registerResponse.data.data.id; //; Devolvemos el ID del usuario creado
}

async function deleteUserTemporal(userId) {
  //; Eliminamos el usuario después de ejecutar todas las pruebas
  const deleteUserResponse = await ApiService.delete(
    ApiService.urls.users.delete(userId)
  );
  expect(deleteUserResponse.status).toBe(200); //; Código de éxito para eliminación
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

  it("debería registrar un nuevo usuario correctamente", async () => {
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
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    const registerResponse = await ApiService.post(
      ApiService.urls.auth.register,
      body
    );

    expect(registerResponse.status).toBe(201);
    expect(registerResponse).toEqual(
      expect.objectContaining({
        status: expect.any(Number),
        data: expect.any(Object),
        message: expect.any(String),
      })
    );

    //; Guardamos el ID del usuario registrado
    userId = registerResponse.data.data.id; //TODO#code3: mantener `data.data` mientras que marisa soluciona el retorno del register
  });

  it("debería iniciar sesión y obtener un token JWT válido", async () => {
    const loginResponse = await ApiService.post(ApiService.urls.auth.login, {
      username: newUser.username,
      password: newUser.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.message).toBe("Login successful");
    expect(loginResponse.data).toHaveProperty("token");

    const token = loginResponse.data.token;

    const decodedToken = jwt.decode(token);

    expect(decodedToken).not.toBeNull();
    expect(decodedToken).toHaveProperty("user");
    expect(decodedToken).toHaveProperty("exp");
    expect(decodedToken.user).toHaveProperty("username", newUser.username);
  });

  it("debería verificar el token JWT correctamente", async () => {
    const loginResponse = await ApiService.post(ApiService.urls.auth.login, {
      username: newUser.username,
      password: newUser.password,
    });

    const token = loginResponse.data.token;

    const verifyResponse = await ApiService.get(ApiService.urls.auth.verify);

    expect(verifyResponse.status).toBe(200);
  });

  it("debería obtener todos los usuarios correctamente", async () => {
    const getAllUsersResponse = await ApiService.get(
      ApiService.urls.users.getAll
    );

    expect(getAllUsersResponse.status).toBe(200);
    expect(Array.isArray(getAllUsersResponse.data)).toBe(true);
    expect(getAllUsersResponse.data.length).toBeGreaterThan(0);
  });

  it("debería obtener el perfil del usuario recién registrado", async () => {
    const getUserResponse = await ApiService.get(
      ApiService.urls.users.getById(userId)
    );

    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.data).toEqual(
      expect.objectContaining({
        id: userId,
        username: newUser.username,
        email: newUser.email,
      })
    );
  });

  it("debería eliminar el usuario recién registrado", async () => {
    const deleteResponse = await ApiService.delete(
      ApiService.urls.users.delete(userId)
    );

    expect(deleteResponse.status).toBe(200); //; Código de éxito para eliminación
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

  it("debería crear una nueva tarea correctamente", async () => {
    const newTask = {
      title: "Limpieza del piso 1",
      description: "Revisar limpieza del piso 1",
      status: "pending",
      user_id: userId, //; Usamos el user_id del nuevo usuario
      created_at: "2024-08-25",
      updated_at: "2024-09-25",
    };

    const createTaskResponse = await ApiService.post(
      ApiService.urls.tasks.create,
      newTask
    );

    expect(createTaskResponse.status).toBe(201);
    taskId = createTaskResponse.data.id;
  });

  it("debería actualizar la tarea correctamente", async () => {
    const updatedTask = {
      title: "Limpieza del piso 1 Actualizada",
      description: "Revisar nuevamente la limpieza del piso 1",
      status: "done",
      user_id: userId, //; Mantener el mismo usuario
      created_at: "2024-08-25",
      updated_at: new Date().toISOString().split("T")[0],
      completed_at: new Date().toISOString().split("T")[0],
    };

    const updateTaskResponse = await ApiService.put(
      ApiService.urls.tasks.update(taskId),
      updatedTask
    );

    expect(updateTaskResponse.status).toBe(200);
  });

  it("debería obtener todas las tareas correctamente", async () => {
    const getAllTasksResponse = await ApiService.get(
      ApiService.urls.tasks.getAll
    );

    expect(getAllTasksResponse.status).toBe(200);
    expect(Array.isArray(getAllTasksResponse.data)).toBe(true);
    expect(getAllTasksResponse.data.length).toBeGreaterThan(0);
  });

  it("debería obtener todas las tareas completadas del usuario", async () => {
    const getCompletedTasksResponse = await ApiService.get(
      ApiService.urls.tasks.getCompleted(userId)
    );

    expect(getCompletedTasksResponse.status).toBe(200);
    expect(Array.isArray(getCompletedTasksResponse.data)).toBe(true);
    expect(getCompletedTasksResponse.data.length).toBeGreaterThan(0);
    expect(getCompletedTasksResponse.data[0].status).toBe("done");
  });

  it("debería eliminar la tarea recién creada", async () => {
    const deleteTaskResponse = await ApiService.delete(
      ApiService.urls.tasks.delete(taskId)
    );

    expect(deleteTaskResponse.status).toBe(200); //; Código de éxito para eliminación
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

  it("debería crear una nueva nota correctamente", async () => {
    const newNote = {
      title: "Revisión de seguridad",
      description: "Revisar todos los sistemas de seguridad en la planta baja.",
      user_id: userId, //; Usamos el user_id del nuevo usuario
    };

    const createNoteResponse = await ApiService.post(
      ApiService.urls.notes.create,
      newNote
    );

    expect(createNoteResponse.status).toBe(201);
    noteId = createNoteResponse.data.id;
  });

  it("debería actualizar la nota correctamente", async () => {
    const updatedNote = {
      title: "Revisión de seguridad Actualizada",
      description: "Revisar de nuevo los sistemas de seguridad.",
      user_id: userId, //; Mantener el mismo usuario
      created_at: "2024-09-01",
    };

    const updateNoteResponse = await ApiService.put(
      ApiService.urls.notes.update(noteId),
      updatedNote
    );

    expect(updateNoteResponse.status).toBe(200);
  });

  it("debería obtener todas las notas correctamente", async () => {
    const getAllNotesResponse = await ApiService.get(
      ApiService.urls.notes.getAll
    );

    expect(getAllNotesResponse.status).toBe(200);
    expect(Array.isArray(getAllNotesResponse.data)).toBe(true);
    expect(getAllNotesResponse.data.length).toBeGreaterThan(0);
  });

  it("debería obtener una nota por su ID", async () => {
    const getNoteByIdResponse = await ApiService.get(
      ApiService.urls.notes.getById(noteId)
    );

    expect(getNoteByIdResponse.status).toBe(200);
    expect(getNoteByIdResponse.data.id).toBe(noteId);
  });

  it("debería eliminar la nota recién creada", async () => {
    const deleteNoteResponse = await ApiService.delete(
      ApiService.urls.notes.delete(noteId)
    );

    expect(deleteNoteResponse.status).toBe(200); //; Código de éxito para eliminación
  });
});
