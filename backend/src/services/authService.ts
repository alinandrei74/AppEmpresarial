import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserInDB, getUserByUsernameFromDB, getUserByEmailFromDB } from '../data_access/userDataAccess';
import { StatusCodes } from 'http-status-codes';
import { User } from '../types/user';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Define los campos obligatorios
const requiredFields: (keyof User)[] = [
  'role', 'username', 'name', 'firstname', 'lastname',
  'dni', 'email', 'telephone', 'address', 'cp', 'password'
];

// Función para lanzar errores, mejorando el tipado
const throwError = (status: number, message: string): never => {
  throw { status, message };
};

// Servicio para registrar un nuevo usuario
export const registerUserService = async (userData: User) => {
  try {
    const existingUser = await getUserByEmailFromDB(userData.email);
    if (existingUser) {
      throw { status: StatusCodes.BAD_REQUEST, message: 'User with this email already exists' };
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear el usuario en la base de datos
    const newUser = await createUserInDB({
      ...userData,
      password: hashedPassword
    });


    return {
      status: StatusCodes.CREATED,
      message: 'User registered successfully',
      data: newUser,
    };

  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred during registration';
    console.error('Registration error:', errorMessage);

    if (error.status) {
      throw error;
    }

    throwError(StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred during registration');
  }
};

// Servicio para iniciar sesión de un usuario
export const loginUserService = async (username: string, password: string): Promise<{ token: string, user: User }> => {
  try {
    const user = await getUserByUsernameFromDB(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { user: user },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return { token, user };
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Servicio genérico para obtener un usuario por un identificador (username o email)
const getUserService = async (identifier: string, getUserFn: (id: string) => Promise<any>, fieldName: string) => {
  try {
    if (!identifier) {
      throwError(StatusCodes.BAD_REQUEST, `${fieldName} is required`);
    }

    const user = await getUserFn(identifier);
    if (!user) {
      throwError(StatusCodes.NOT_FOUND, `User with ${fieldName} not found`);
    }

    return {
      status: StatusCodes.OK,
      message: `User with ${fieldName} found`,
      data: user,
    };
  } catch (error: any) {
    const errorMessage = error.message || `An unexpected error occurred while fetching user by ${fieldName}`;
    console.error(`Error fetching user by ${fieldName}:`, errorMessage);

    throwError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
  }
};

// Servicios para obtener usuario por username o email, reutilizando la lógica de `getUserService`
export const getUserByUsernameService = (username: string) => getUserService(username, getUserByUsernameFromDB, 'username');
export const getUserByEmailService = (email: string) => getUserService(email, getUserByEmailFromDB, 'email');

