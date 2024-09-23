import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Role } from './../types/role';
import Logger from '../utils/logger';

// Definir permisos por rol
const rolePermissions: Record<Role, { tasks: string[], users: string[], notes: string[], work_schedules: string[] }> = {
  admin: {
    tasks: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    notes: ['create', 'read', 'update', 'delete'],
    work_schedules: ['create', 'read', 'update', 'delete'],
  },
  maintenance: {
    tasks: ['read', 'update'],
    users: [], // No tiene acceso
    notes: ['create', 'read', 'update', 'delete'],
    work_schedules: ['create', 'read'], // Puede leer y crear sus propios horarios
  },
  cleaning: {
    tasks: ['read', 'update'],
    users: [], // No tiene acceso
    notes: ['create', 'read', 'update', 'delete'],
    work_schedules: ['create', 'read'], // Puede leer y crear sus propios horarios
  },
  delivery: {
    tasks: ['read', 'update'],
    users: [], // No tiene acceso
    notes: ['create', 'read', 'update', 'delete'],
    work_schedules: ['create', 'read'], // Puede leer y crear sus propios horarios
  },
};

// Middleware para autorizar según el rol del usuario
export const authorizeRole = (entity: 'tasks' | 'users' | 'notes' | 'work_schedules', action: 'create' | 'read' | 'update' | 'delete') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Asumiendo que el rol del usuario está en req.user

    if (!user || !user.role) {
      Logger.warning("User not authenticated");
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
    }

    const { role, id } = user; // Asumiendo que el id del usuario también está en req.user

    // Verificar si el rol es válido
    if (!isValidRole(role)) {
      Logger.error(`Invalid role: ${role}`);
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid role' });
    }

    // Verificar si el rol tiene permiso para la acción solicitada en la entidad
    if (rolePermissions[role] && rolePermissions[role][entity]?.includes(action)) {
      // Restricción para creación de horarios
      if (entity === 'work_schedules') {
        const scheduleUserId = req.params.workerId || req.body.workerId;

        // Validación para creación de horarios
        if (action === 'create' && role !== 'admin' && scheduleUserId && scheduleUserId !== id) {
          Logger.warning("User attempting to create schedule for another user");
          return res.status(StatusCodes.FORBIDDEN).json({ message: 'Cannot create schedule for another user' });
        }
        // Validación para lectura de horarios
        if (action === 'read' && role !== 'admin' && scheduleUserId && scheduleUserId !== id) {
          // No pueden leer horarios de otros usuarios, excepto el admin
          return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied to this schedule' });
        }
      }
      Logger.success(`User ${role} authorized for action: ${action} on entity: ${entity}`);
      next();
    } else {
      Logger.error(`Access denied: Role ${role} does not have permission for ${action} on ${entity}`);
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
  };
};

// Función para verificar si el rol es válido
function isValidRole(role: string): role is Role {
  const validRoles = ['admin', 'maintenance', 'cleaning', 'delivery'];
  return validRoles.includes(role);
}
