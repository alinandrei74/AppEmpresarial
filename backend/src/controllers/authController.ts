import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { registerUserService, loginUserService } from '../services/authService';
import { User } from '../types/user';


const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
  const userData: User = req.body;  // Extraer los datos del cuerpo de la solicitud

  try {
    const requiredFields: Array<keyof User> = [
      'role', 'username', 'name', 'firstName', 'lastName', 'dni', 
      'email', 'telephone', 'address', 'cp', 'password'
    ];

    // Verificar que todos los campos requeridos están presentes
    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: `Field ${field} is required`,
          data: null,
        });
      }
    }

    // Llamar al servicio para registrar al usuario en la base de datos
    const newUser = await registerUserService(userData);

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: 'User registered successfully',
      data: newUser,
    });

   
  } catch (error: any) {
    console.error('Error during user registration:', error.message || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'An unexpected error occurred during registration',
      data: null,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: 'Username and password are required',
      data: null,
    });
  }

  try {
    const result = await loginUserService(username, password);
    if (!result) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        data: null,
      });
    }

    const { token, user }: { token: string; user: User } = result;

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Login successful',
      data: { token, user_id: user.id, role: user.role },  // Tipos de `user` ahora claros
    });
  } catch (error: any) {
    console.error('Error during login:', error.message || error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'An unexpected error occurred during login',
      data: null,
    });
  }
};

export const verifyToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: 'Token not provided or malformed',
      data: null,
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or expired token',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Token verified successfully',
      data: decoded,
    });
  });
};

export const logoutUser = (req: Request, res: Response) => {
  // En este caso, simplemente respondemos con un éxito
  return res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: 'Logout successful',
    data: null,
  });
};
