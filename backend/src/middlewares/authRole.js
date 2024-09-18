"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const http_status_codes_1 = require("http-status-codes");
// Definir permisos por rol
const rolePermissions = {
    admin: {
        tasks: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update', 'delete'],
        notes: ['create', 'read', 'update', 'delete'],
        schedules: ['create', 'read'], // Admin puede leer todos los horarios, pero crear solo los suyos
    },
    maintenance: {
        tasks: ['read', 'update'],
        users: [], // No tiene acceso
        notes: ['create', 'read', 'update', 'delete'],
        schedules: ['create', 'read'], // Puede leer y crear sus propios horarios
    },
    cleaning: {
        tasks: ['read', 'update'],
        users: [], // No tiene acceso
        notes: ['create', 'read', 'update', 'delete'],
        schedules: ['create', 'read'], // Puede leer y crear sus propios horarios
    },
    delivery: {
        tasks: ['read', 'update'],
        users: [], // No tiene acceso
        notes: ['create', 'read', 'update', 'delete'],
        schedules: ['create', 'read'], // Puede leer y crear sus propios horarios
    },
};
// Middleware para autorizar según el rol del usuario
const authorizeRole = (entity, action) => {
    return (req, res, next) => {
        var _a;
        const user = req.user; // Asumiendo que el rol del usuario está en req.user
        if (!user || !user.role) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
        }
        const { role, id } = user; // Asumiendo que el id del usuario también está en req.user
        // Verificar si el rol es válido
        if (!isValidRole(role)) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Invalid role' });
        }
        // Verificar si el rol tiene permiso para la acción solicitada en la entidad
        if (rolePermissions[role] && ((_a = rolePermissions[role][entity]) === null || _a === void 0 ? void 0 : _a.includes(action))) {
            // Restricción para creación de horarios: El admin solo puede crear su propio horario
            if (entity === 'schedules') {
                const scheduleUserId = req.params.workerId || req.body.workerId; // Asumiendo que el ID del usuario para el horario está en params o body
                // Validación para creación de horarios
                if (action === 'create') {
                    if (role === 'admin' && scheduleUserId && scheduleUserId !== id) {
                        // Admin no puede crear horarios para otros usuarios
                        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Admin cannot create schedule for another user' });
                    }
                    else if (role !== 'admin' && scheduleUserId && scheduleUserId !== id) {
                        // Otros roles no pueden crear horarios para otros usuarios
                        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Cannot create schedule for another user' });
                    }
                }
                // Validación para lectura de horarios
                if (action === 'read' && role !== 'admin' && scheduleUserId && scheduleUserId !== id) {
                    // No pueden leer horarios de otros usuarios, excepto el admin
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Access denied to this schedule' });
                }
            }
            next(); // El rol tiene acceso, continuar con la siguiente función
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
        }
    };
};
exports.authorizeRole = authorizeRole;
// Función para verificar si el rol es válido
function isValidRole(role) {
    const validRoles = ['admin', 'maintenance', 'cleaning', 'delivery'];
    return validRoles.includes(role);
}
