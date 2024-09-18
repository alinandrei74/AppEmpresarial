// authRole.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from './../types/role'; // Adjust path as needed

// Definir permisos por rol
const rolePermissions: Record<Role, { tasks: string[], users: string[], notes: string[] }> = {
  admin: {
    tasks: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    notes: ['create', 'read', 'update', 'delete'],
  },
  maintenance: {
    tasks: ['read', 'update'],
    users: [], // No tiene acceso
    notes: ['create', 'read', 'update', 'delete'],
  },
  cleaning: {
    tasks: ['read', 'update'],
    users: [], // No tiene acceso
    notes: ['create', 'read', 'update', 'delete'],
  },
  delivery: {
    tasks: ['read', 'update'],
    users: [], // No tiene acceso
    notes: ['create', 'read', 'update', 'delete'],
  },
};

// Middleware para autorizar según el rol del usuario
export const authorizeRole = (entity: 'tasks' | 'users' | 'notes', action: 'create' | 'read' | 'update' | 'delete' | 'send') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // console.log(`[authorizeRole] Start: entity=${entity}, action=${action}`); // Debug: Start of the function

    const user = req.user; // Asumiendo que el rol del usuario está en req.user
    // console.log(`[authorizeRole] User from request:`, user); // Debug: Check user from request

    if (!user || !user.role) {
      console.error('[authorizeRole] User not authenticated or role not present');
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
    }

    const { role } = user;
    // console.log(`[authorizeRole] User role: ${role}`); // Debug: Display user role

    // Verificar si el rol es válido
    if (!isValidRole(role)) {
      console.error(`[authorizeRole] Invalid role: ${role}`);
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid role' });
    }

    // Verificar si el rol tiene permiso para la acción solicitada en la entidad
    if (rolePermissions[role] && rolePermissions[role][entity]?.includes(action)) {
      // console.log(`[authorizeRole] Role "${role}" has permission for action "${action}" on "${entity}"`); // Debug: Permission granted
      next(); // El rol tiene acceso, continuar con la siguiente función
    } else {
      console.error(`[authorizeRole] Access denied for role "${role}" on action "${action}" for entity "${entity}"`);
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
  };
};

// Función para verificar si el rol es válido
function isValidRole(role: string): role is Role {
  const validRoles = ['admin', 'maintenance', 'cleaning', 'delivery'];
  const isValid = validRoles.includes(role);
  // console.log(`[isValidRole] Checking if role "${role}" is valid: ${isValid}`); // Debug: Check if role is valid
  return isValid;
}
