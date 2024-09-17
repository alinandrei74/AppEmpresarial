// authRole.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from '../../types/role'; // Ensure path is correct

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
export const authorizeRole = (entity: 'tasks' | 'users' | 'notes' , action: 'create' | 'read' | 'update' | 'delete' | 'send') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Asumiendo que el rol del usuario está en req.user
    if (!user || !user.role) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
    }

    const { role } = user;

    // Verificar si el rol es válido
    if (!isValidRole(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid role' });
    }

    // Verificar si el rol tiene permiso para la acción solicitada en la entidad
    if (rolePermissions[role] && rolePermissions[role][entity]?.includes(action)) {
      next(); // El rol tiene acceso, continuar con la siguiente función
    } else {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
  };
};

// Función para verificar si el rol es válido
function isValidRole(role: string): role is Role {
  return ['admin', 'maintenance', 'cleaning', 'delivery'].includes(role);
}
