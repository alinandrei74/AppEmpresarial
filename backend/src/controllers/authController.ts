import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUserService, loginUserService, getUserByEmailService } from '../services/authService';


//! authController.ts:

//! Propósito: Manejar la autenticación y los tokens.
//! Funciones:
// registerUser: Registro de usuario (esto puede estar aquí si estás manejando el registro y la autenticación en un mismo flujo).
// loginUser: Inicio de sesión.
// verifyToken: Verificación de tokens.
// logoutUser: Cierre de sesión.

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const registerUser = async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    // Verifica si el usuario ya existe
    const existingUser = await getUserByEmailService(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hashea la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const user = await registerUserService(userData);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user' });
  }
};

// Controlador para el inicio de sesión de usuarios
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Usa el servicio para iniciar sesión
    const token = await loginUserService(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Controlador para verificar el token
export const verifyToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido o expirado' });

    res.status(200).json(decoded);
  });
};

// Controlador para cerrar sesión
export const logoutUser = (req: Request, res: Response) => {
  // La invalidación del token en el cliente generalmente se maneja allí
  // Aquí simplemente devolvemos una respuesta de éxito
  res.json({ message: 'Logout successful' });
};