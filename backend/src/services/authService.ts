import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserInDB, getUserByUsernameFromDB, getUserByEmailFromDB } from '../data_access/userDataAccess';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Define el tipo UserData
type UserData = {
  role_id: string;
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  telephone: string;
  address: string;
  cp: string;
  password: string;
};

// Define los campos obligatorios
const requiredFields: (keyof UserData)[] = [
  'role_id', 'username', 'name', 'firstName', 'lastName',
  'dni', 'email', 'telephone', 'address', 'cp', 'password'
];

// Función para lanzar errores, mejorando el tipado
const throwError = (status: number, message: string): never => {
  throw { status, message };
};

// Servicio para registrar un nuevo usuario
export const registerUserService = async (userData: UserData) => {
  try {
    // Verifica que todos los campos estén presentes
    requiredFields.forEach(field => {
      if (!userData[field]) {
        throwError(400, `Field ${field} is required`);
      }
    });

    // Verifica si el usuario ya existe por email
    const existingUser = await getUserByEmailFromDB(userData.email);
    if (existingUser) {
      throwError(400, 'User with this email already exists');
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Guarda el nuevo usuario en la base de datos
    return await createUserInDB({
      ...userData,
      password: hashedPassword
    });

  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred during registration';
    console.error('Registration error:', errorMessage);

    if (error.status) {
      throw error; // Si ya tiene un status, lo propagamos
    }

    throwError(500, 'An unexpected error occurred during registration');
  }
};

// Servicio para iniciar sesión de un usuario
export const loginUserService = async (username: string, password: string) => {
  try {
    // Verifica si los parámetros están presentes
    if (!username || !password) {
      throwError(400, 'Username and password are required');
    }

    // Obtiene el usuario de la base de datos
    const user = await getUserByUsernameFromDB(username);
    if (!user) {
      throwError(401, 'Invalid credentials');
    }

    // Verifica si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throwError(401, 'Invalid credentials');
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return { token, user };

  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred during login';
    console.error('Login error:', errorMessage);

    if (error.status) {
      throw error; // Si ya tiene un status, lo propagamos
    }

    throwError(500, 'An unexpected error occurred during login');
  }
};

// Servicio genérico para obtener un usuario por un identificador (username o email)
const getUserService = async (identifier: string, getUserFn: (id: string) => Promise<any>, fieldName: string) => {
  try {
    if (!identifier) {
      throwError(400, `${fieldName} is required`);
    }

    const user = await getUserFn(identifier);
    if (!user) {
      throwError(404, `User with ${fieldName} not found`);
    }

    return user;
  } catch (error: any) {
    const errorMessage = error.message || `An unexpected error occurred while fetching user by ${fieldName}`;
    console.error(`Error fetching user by ${fieldName}:`, errorMessage);

    throwError(500, errorMessage);
  }
};

// Servicios para obtener usuario por username o email, reutilizando la lógica de `getUserService`
export const getUserByUsernameService = (username: string) => getUserService(username, getUserByUsernameFromDB, 'username');
export const getUserByEmailService = (email: string) => getUserService(email, getUserByEmailFromDB, 'email');
