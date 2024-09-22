import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserInDB, getUserByUsernameFromDB, getUserByEmailFromDB } from '../data_access/userDataAccess';
import { StatusCodes } from 'http-status-codes';
import { User } from '../types/user';
import Logger from '../utils/logger';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Define los campos obligatorios
const requiredFields: (keyof User)[] = [
  'role', 'username', 'name', 'firstname', 'lastname',
  'dni', 'email', 'telephone', 'address', 'cp', 'password'
];

// Función para lanzar errores
const throwError = (status: number, message: string): never => {
  throw { status, message };
};

// Servicio para registrar un nuevo usuario
export const registerUserService = async (userData: User) => {
  try {
    Logger.information(`Intentando registrar usuario: ${userData.email}`);
    const existingUser = await getUserByEmailFromDB(userData.email);
    if (existingUser) {
      Logger.warning('Usuario con este correo ya existe');
      throw { status: StatusCodes.BAD_REQUEST, message: 'User with this email already exists' };
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear el usuario en la base de datos
    const newUser = await createUserInDB({
      ...userData,
      password: hashedPassword
    });

    Logger.success(`Usuario registrado exitosamente: ${newUser.email}`);
    return {
      status: StatusCodes.CREATED,
      message: 'User registered successfully',
      data: newUser,
    };

  } catch (error: any) {
    Logger.error(`Error al registrar usuario: ${error.message || 'Error inesperado'}`);
    if (error.status) {
      throw error;
    }
    throwError(StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred during registration');
  }
};

// Servicio para iniciar sesión de un usuario
export const loginUserService = async (username: string, password: string): Promise<{ token: string, user: User }> => {
  try {
    Logger.information(`Intentando iniciar sesión con el usuario: ${username}`);
    const user = await getUserByUsernameFromDB(username);
    if (!user) {
      Logger.warning('Credenciales inválidas');
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      Logger.warning('Credenciales inválidas');
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '1h' });
    Logger.success(`Usuario ${username} ha iniciado sesión exitosamente`);
    return { token, user };
  } catch (error) {
    Logger.error('Error durante el inicio de sesión');
    throw new Error('Login failed');
  }
};

// Servicios para obtener usuario por username o email
export const getUserByUsernameService = (username: string) => {
  Logger.information(`Buscando usuario por username: ${username}`);
  return getUserService(username, getUserByUsernameFromDB, 'username');
};

export const getUserByEmailService = (email: string) => {
  Logger.information(`Buscando usuario por email: ${email}`);
  return getUserService(email, getUserByEmailFromDB, 'email');
};

// Servicio genérico reutilizado para obtener usuario
const getUserService = async (identifier: string, getUserFn: (id: string) => Promise<any>, fieldName: string) => {
  try {
    if (!identifier) {
      Logger.warning(`El campo ${fieldName} es requerido`);
      throwError(StatusCodes.BAD_REQUEST, `${fieldName} is required`);
    }

    const user = await getUserFn(identifier);
    if (!user) {
      Logger.warning(`Usuario con ${fieldName} no encontrado`);
      throwError(StatusCodes.NOT_FOUND, `User with ${fieldName} not found`);
    }

    Logger.success(`Usuario con ${fieldName} encontrado`);
    return {
      status: StatusCodes.OK,
      message: `User with ${fieldName} found`,
      data: user,
    };
  } catch (error: any) {
    Logger.error(`Error al buscar usuario por ${fieldName}: ${error.message}`);
    throwError(StatusCodes.INTERNAL_SERVER_ERROR, `Error fetching user by ${fieldName}`);
  }
};
