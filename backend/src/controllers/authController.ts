import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { registerUserService, loginUserService } from '../services/authService';
import { User } from '../types/user';
import Logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
  const userData: User = req.body;  // Extraer los datos del cuerpo de la solicitud

  try {
    const requiredFields: Array<keyof User> = [
      'role', 'username', 'name', 'firstname', 'lastname', 'dni',
      'email', 'telephone', 'address', 'cp', 'password'
    ];

    // Verificar que todos los campos requeridos están presentes
    for (const field of requiredFields) {
      if (!userData[field]) {
        Logger.warning(`Registro fallido. Falta campo: ${field}`);
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: `Field ${field} is required`,
          data: null,
        });
      }
    }

    // Llamar al servicio para registrar al usuario en la base de datos
    const newUser = await registerUserService(userData);
    Logger.success(`Usuario registrado exitosamente: ${userData.username}`);
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: 'User registered successfully',
      data: newUser,
    });

  } catch (error: any) {
    Logger.finalError('Error en el registro de usuario:', error.message || error);
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
    Logger.warning('Intento de inicio de sesión sin credenciales');
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: 'Username and password are required',
      data: null,
    });
  }

  try {
    const result = await loginUserService(username, password);
    if (!result) {
      Logger.warning(`Credenciales inválidas para usuario: ${username}`);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        data: null,
      });
    }

    const { token, user }: { token: string; user: User } = result;
    Logger.success(`Inicio de sesión exitoso: ${username}`);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Login successful',
      data: { token: token, user: user },
    });
  } catch (error: any) {
    Logger.finalError('Error durante el inicio de sesión:', error.message || error);
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
    Logger.warning('Token no proporcionado o malformado');
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: 'Token not provided or malformed',
      data: null,
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      Logger.error('Token inválido o expirado');
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or expired token',
        data: null,
      });
    }

    Logger.success('Token verificado correctamente');
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Token verified successfully',
      data: decoded,
    });
  });
};

//TODO: potenciar logoutUser, agregar validación de token vacío y después el statusOk, convertir en post
export const logoutUser = (req: Request, res: Response) => {
  // En este caso, simplemente respondemos con un éxito
  return res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: 'Logout successful',
    data: null,
  });
};
