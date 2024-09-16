//todo---MARK:# Tables
import "./tables.mjs"; // Asegúrate de que esto importe correctamente los datos

const express = require("express");
const { StatusCodes, getReasonPhrase } = require("http-status-codes"); // `npm install http-status-codes`

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para parsear JSON

// Importar datos de usuarios (ajusta según sea necesario)
const { users } = require("./tables.mjs"); // Asegúrate de que `users` está siendo exportado en tables.mjs

//todo---MARK:# Global Variables

// Definición de códigos de estado HTTP usando http-status-codes
// Ya no necesitas definir los códigos de estado manualmente; puedes usar `StatusCodes`.

//todo---MARK:# Functions

//
//
//

//;MARK:Auxiliary
//^---------------- Auxiliary ----------------^\\

// Función auxiliar para crear una respuesta de error estándar
const createErrorResponse = (status, message) => ({
  status,
  message,
  data: null,
});

//todo---MARK:# CRUD

//
//
//

//;MARK:Users
//^---------------- Usuarios (Users) ----------------^\\

// Crear un nuevo usuario
app.post("/users", (req, res) => {
  const newUser = req.body;

  // Validar que todos los campos requeridos están presentes
  if (!newUser.name || !newUser.email || !newUser.password) {
    return res
      .status(StatusCodes.BAD_REQUEST) // Usar StatusCodes en lugar de números mágicos
      .json(
        createErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Faltan campos requeridos: 'name', 'email', 'password'."
        )
      );
  }

  // Verificar si el email ya existe
  const existingUser = users.find((user) => user.email === newUser.email);
  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        createErrorResponse(
          StatusCodes.BAD_REQUEST,
          "El correo electrónico ya está en uso."
        )
      );
  }

  // Crear un nuevo ID para el usuario
  const newUserId = users.length ? users[users.length - 1].id + 1 : 1;
  const user = { id: newUserId, ...newUser };

  // Agregar el usuario a la lista de usuarios
  users.push(user);

  return res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    message: "Usuario creado exitosamente.",
    data: user,
  });
});

// Obtener todos los usuarios
app.get("/users", (req, res) => {
  return res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Usuarios obtenidos exitosamente.",
    data: users,
  });
});

// Obtener un usuario por ID
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        createErrorResponse(StatusCodes.NOT_FOUND, "Usuario no encontrado.")
      );
  }

  return res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Usuario encontrado.",
    data: user,
  });
});

// Actualizar un usuario por ID
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedData = req.body;
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        createErrorResponse(StatusCodes.NOT_FOUND, "Usuario no encontrado.")
      );
  }

  // Actualizar los datos del usuario
  users[userIndex] = { ...users[userIndex], ...updatedData };

  return res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Usuario actualizado exitosamente.",
    data: users[userIndex],
  });
});

// Eliminar un usuario por ID
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        createErrorResponse(StatusCodes.NOT_FOUND, "Usuario no encontrado.")
      );
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  return res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Usuario eliminado exitosamente.",
    data: deletedUser,
  });
});

//todo---MARK:# Server Initialization

//
//
//

//;MARK:Servidor

//^---------------- Iniciar el Servidor ----------------^\\

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
