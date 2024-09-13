import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserInDB, getUserByEmailFromDB } from '../data_access/userDataAccess';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Define el tipo UserData
type UserData = {
  rol: string;
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
  'rol', 'username', 'name', 'firstName', 'lastName',
  'dni', 'email', 'telephone', 'address', 'cp', 'password'
];

// Servicio para registrar un nuevo usuario
export const registerUserService = async (userData: UserData) => {
  try {
    // Verifica que todos los campos estén presentes
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    // Verifica si el usuario ya existe
    const existingUser = await getUserByEmailFromDB(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hashea la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log('Original password:', userData.password);
    console.log('Hashed password during registration:', hashedPassword);

    // Guarda el nuevo usuario en la base de datos
    return await createUserInDB({
      ...userData,
      password: hashedPassword
    });

  } catch (error: any) {
  
    const errorMessage = error instanceof Error && error.message ? error.message : 'An unexpected error occurred';

  
    if (errorMessage === 'User with this email already exists') {
      console.error('Registration error:', errorMessage);
      throw {
        status: 400, 
        message: errorMessage,
      };
    }

    
    console.error('Unexpected error during registration:', errorMessage);
    throw {
      status: 500,
      message: 'An unexpected error occurred during registration',
    };
  }
};

// Servicio para iniciar sesión de un usuario
export const loginUserService = async (email: string, password: string) => {
  try {
    // Verifica si los parámetros están presentes
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Obtén el usuario de la base de datos
    const user = await getUserByEmailFromDB(email);

    if (!user) {
      throw new Error('User not found');
    }

    // Verifica si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison:', { password, hash: user.password, isMatch });
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    return { token, user };

  } catch (error) {

    const errorMessage = error instanceof Error && error.message ? error.message : 'An unexpected error occurred';

    // Manejar errores específicos de autenticación
    if (errorMessage === 'User not found' || errorMessage === 'Invalid credentials') {
      console.error('Authentication error:', errorMessage);
      throw {
        status: 401, 
        message: errorMessage,
      };
    }

    console.error('Unexpected error during login:', errorMessage);
    throw {
      status: 500, 
      message: 'An unexpected error occurred during login',
    };
  }
};

// Servicio para obtener un usuario por email
export const getUserByEmailService = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await getUserByEmailFromDB(email);
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw {
      status: 500,
      message: 'An unexpected error occurred while fetching user by email',
    };
  }
};
