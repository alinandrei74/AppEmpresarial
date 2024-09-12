import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserInDB, getUserByEmailFromDB } from '../data_access/userDataAccess';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

export const registerUserService = async (userData: {
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
}) => {
  // Hashea la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await createUserInDB({ 
    ...userData, 
    password: hashedPassword 
  });
};

export const loginUserService = async (email: string, password: string) => {
  const user = await getUserByEmailFromDB(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  return jwt.sign({ 
    id: user.id, 
    email: user.email, 
    role: user.role 
  }, 
  SECRET_KEY, { expiresIn: '1h' });
};

export const getUserByEmailService = async (email: string) => {
  return await getUserByEmailFromDB(email);
};
