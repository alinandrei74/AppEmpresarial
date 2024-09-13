import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerUserService, loginUserService } from '../services/authService';

// Clave secreta para JWT desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Controlador para el registro de usuarios
export const registerUser = async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    // Verifica que todos los campos necesarios estén presentes
    const requiredFields = ['rol', 'username', 'name', 'firstName', 'lastName', 'dni', 'email', 'telephone', 'address', 'cp', 'password'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(400).json({ message: `Field ${field} is required` });
      }
    }

    // Llama a `registerUserService` que manejará la verificación de si el usuario existe y la creación
    const user = await registerUserService(userData);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Field')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message.includes('Database')) {
        return res.status(500).json({ message: 'Database error' });
      }
      return res.status(500).json({ message: 'An unexpected error occurred during registration' });
    }
    res.status(500).json({ message: 'An unexpected error occurred during registration' });
  }
};

// Controlador para el inicio de sesión de usuarios
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const token = await loginUserService(email, password);

    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error); // Log del error para obtener más detalles
    res.status(500).json({ message: 'An unexpected error occurred during login' });
  }
};

// Controlador para verificar el token
export const verifyToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token not provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });

    res.status(200).json(decoded);
  });
};

// Controlador para cerrar sesión
export const logoutUser = (req: Request, res: Response) => {
  // La invalidación del token en el cliente generalmente se maneja allí
  // Aquí simplemente devolvemos una respuesta de éxito
  res.json({ message: 'Logout successful' });
};
