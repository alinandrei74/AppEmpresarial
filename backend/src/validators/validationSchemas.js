"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.workScheduleIdSchema = exports.updateWorkScheduleSchema = exports.createWorkScheduleSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.userIdParamSchema = exports.idParamSchema = exports.updateNoteSchema = exports.createNoteSchema = exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validaciones:
// Para el registro
exports.userRegistrationSchema = joi_1.default.object({
    role: joi_1.default.string()
        .valid("admin", "maintenance", "cleaning", "delivery")
        .max(50)
        .required()
        .label("role") // Añadir un label para personalizar el mensaje de error
        .messages({
        "any.only": "{{#label}} inválido", // Usa {{#label}} para mostrar el nombre del campo
        "any.required": "{{#label}} es requerido",
    }),
    username: joi_1.default.string()
        .min(3)
        .max(20)
        .pattern(/^(?![-_])[A-Za-z0-9Ññ_-]{1,18}[A-Za-z0-9Ññ](?<![-_])$/)
        .required()
        .label("username") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.min": "{{#label}} debe tener mínimo 3 caracteres",
        "string.max": "{{#label}} debe tener máximo 20 caracteres",
        "string.pattern.base": '{{#label}} puede contener números, mayúsculas, minúsculas, "-" y "_". No puede empezar ni terminar con "-" o "_"',
        "any.required": "{{#label}} es requerido",
    }),
    name: joi_1.default.string()
        .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
        .max(100)
        .required()
        .label("name") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": "{{#label}} solo puede contener letras y espacios",
        "string.max": "{{#label}} debe tener máximo 100 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    firstname: joi_1.default.string()
        .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
        .max(100)
        .required()
        .label("firstname") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": "{{#label}} solo puede contener letras y espacios",
        "string.max": "{{#label}} debe tener máximo 100 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    lastname: joi_1.default.string()
        .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
        .max(100)
        .required()
        .label("lastname") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": "{{#label}} solo puede contener letras y espacios",
        "string.max": "{{#label}} debe tener máximo 100 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    dni: joi_1.default.string()
        .pattern(/^[A-Za-z0-9]+$/)
        .max(16)
        .required()
        .label("dni") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": "{{#label}} solo puede contener números y letras",
        "string.max": "{{#label}} debe tener máximo 16 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    email: joi_1.default.string().email().max(100).required().label("email").messages({
        "string.email": "{{#label}} tiene un formato inválido",
        "any.required": "{{#label}} es requerido",
    }),
    telephone: joi_1.default.string()
        .pattern(/^\d{9,15}$/)
        .max(20)
        .required()
        .label("telephone") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": "{{#label}} solo puede contener entre 9 y 15 números",
        "string.max": "{{#label}} debe tener máximo 20 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    address: joi_1.default.string()
        .pattern(/^[A-Za-zÀ-ÿ\d\s,]+$/)
        .required()
        .label("address") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": '{{#label}} solo admite letras, números, "," y espacios',
        "any.required": "{{#label}} es requerida",
    }),
    postal_code: joi_1.default.string()
        .pattern(/^\d{4,10}$/)
        .max(10)
        .required()
        .label("postal_code") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.pattern.base": "{{#label}} debe ser un número entre 4 y 10 dígitos.",
        "any.required": "{{#label}} es requerido",
    }),
    password: joi_1.default.string()
        .min(8)
        .max(30)
        .pattern(/[A-Z]/, "uppercase")
        .pattern(/[a-z]/, "lowercase")
        .pattern(/\d/, "number")
        .pattern(/[@$!%*?&.#]/, "special")
        .required()
        .label("password") // Añadir un label para personalizar el mensaje de error
        .messages({
        "string.min": "{{#label}} debe tener mínimo 8 caracteres",
        "string.max": "{{#label}} debe tener máximo 30 caracteres",
        "string.pattern.uppercase": "{{#label}} debe contener al menos una letra mayúscula",
        "string.pattern.lowercase": "{{#label}} debe contener al menos una letra minúscula",
        "string.pattern.number": "{{#label}} debe contener al menos un número",
        "string.pattern.special": "{{#label}} debe contener al menos un símbolo especial (@$!%*?&.#)",
        "any.required": "{{#label}} es requerida",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
// Para el login
exports.userLoginSchema = joi_1.default.object({
    username: joi_1.default.string().required().label("username").messages({
        "any.required": "{{#label}} es requerido",
    }),
    password: joi_1.default.string().required().label("password").messages({
        "any.required": "{{#label}} es requerida",
    }),
});
// Para la creación de notas
exports.createNoteSchema = joi_1.default.object({
    title: joi_1.default.string().max(100).required().label("title").messages({
        "string.max": "{{#label}} no puede exceder los 100 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    description: joi_1.default.string().max(800).required().label("description").messages({
        "any.required": "{{#label}} es requerida",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
// Para la actualización de notas
exports.updateNoteSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required().positive().label("id").messages({
        "number.base": "{{#label}} debe ser un número entero",
        "any.required": "{{#label}} es requerido",
        "number.positive": "{{#label}} debe ser un número positivo",
    }),
    title: joi_1.default.string().max(100).required().label("title").messages({
        "string.max": "{{#label}} no puede exceder los 100 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    description: joi_1.default.string().max(800).required().label("description").messages({
        "any.required": "{{#label}} es requerida",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
exports.idParamSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required().label("id").messages({
        "number.base": "{{#label}} debe ser un número.",
        "number.integer": "{{#label}} debe ser un número entero.",
        "number.positive": "{{#label}} debe ser un número positivo.",
        "any.required": "{{#label}} es obligatorio.",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
exports.userIdParamSchema = joi_1.default.object({
    user_id: joi_1.default.number()
        .integer()
        .positive()
        .required()
        .label("user_id")
        .messages({
        "number.base": "{{#label}} debe ser un número.",
        "number.integer": "{{#label}} debe ser un número entero.",
        "number.positive": "{{#label}} debe ser un número positivo.",
        "any.required": "{{#label}} es obligatorio.",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
// Esquema de validación para la creación de tareas
exports.createTaskSchema = joi_1.default.object({
    user_id: joi_1.default.number()
        .integer()
        .positive()
        .required()
        .label("user_id")
        .messages({
        "number.base": "{{#label}} debe ser un número.",
        "number.integer": "{{#label}} debe ser un número entero.",
        "number.positive": "{{#label}} debe ser un número positivo.",
        "any.required": "{{#label}} es obligatorio.",
    }),
    title: joi_1.default.string().max(100).required().label("title").messages({
        "string.max": "{{#label}} no puede exceder los 100 caracteres", // Ajustar mensaje para reflejar la longitud máxima correcta
        "any.required": "{{#label}} es requerido",
    }),
    description: joi_1.default.string().max(200).required().label("description").messages({
        "string.max": "{{#label}} no puede exceder los 200 caracteres", // Añadir mensaje para el límite de descripción
        "any.required": "{{#label}} es requerida",
    }),
    is_done: joi_1.default.boolean()
        .valid(true, false)
        .required()
        .label("is_done")
        .messages({
        "any.only": "{{#label}} debe ser true o false.",
        "any.required": "{{#label}} es requerido.",
    }),
    completed_at: joi_1.default.date().allow(null).label("completed_at"),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
// Para la actualización de tareas
exports.updateTaskSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required().label("id").messages({
        "number.base": "{{#label}} debe ser un número.",
        "number.integer": "{{#label}} debe ser un número entero.",
        "number.positive": "{{#label}} debe ser un número positivo.",
        "any.required": "{{#label}} es obligatorio.",
    }),
    title: joi_1.default.string().max(100).required().label("title").messages({
        "string.max": "{{#label}} no puede exceder los 100 caracteres",
        "any.required": "{{#label}} es requerido",
    }),
    description: joi_1.default.string().max(200).required().label("description").messages({
        "any.required": "{{#label}} es requerida",
    }),
    is_done: joi_1.default.boolean()
        .valid(true, false)
        .required()
        .label("is_done")
        .messages({
        "any.only": "{{#label}} debe ser true o false.",
        "any.required": "{{#label}} es requerido.",
    }),
    completed_at: joi_1.default.date().allow(null).label("completed_at"),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
exports.createWorkScheduleSchema = joi_1.default.object({
    start_time: joi_1.default.date().iso().required().label("start_time").messages({
        "date.base": "{{#label}} debe ser válida",
        "any.required": "{{#label}} es requerida",
        "date.format": "{{#label}} debe estar en formato ISO 8601",
    }),
    end_time: joi_1.default.date()
        .iso()
        .required()
        .greater(joi_1.default.ref("start_time"))
        .label("end_time")
        .messages({
        "date.format": "{{#label}} debe estar en formato ISO 8601",
        "any.required": "{{#label}} es requerida",
        "date.greater": "{{#label}} debe ser posterior a la hora de inicio",
    }),
    description: joi_1.default.string().required().label("description").messages({
        "string.empty": "{{#label}} no puede estar vacía",
    }),
    day_of_week: joi_1.default.string()
        .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
        .required()
        .label("day_of_week")
        .messages({
        "any.only": "{{#label}} debe ser uno de: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
        "any.required": "{{#label}} es requerido",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
// Esquema de validación para la actualización de horarios laborales
exports.updateWorkScheduleSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required().label("id").messages({
        "number.base": "{{#label}} debe ser un número.",
        "number.integer": "{{#label}} debe ser un número entero.",
        "number.positive": "{{#label}} debe ser un número positivo.",
        "any.required": "{{#label}} es obligatorio.",
    }),
    start_time: joi_1.default.date().iso().required().label("start_time").messages({
        "date.base": "{{#label}} debe ser válida",
        "date.format": "{{#label}} debe estar en formato ISO 8601",
        "any.required": "{{#label}} es requerida",
    }),
    end_time: joi_1.default.date().iso().required().label("end_time").messages({
        "date.base": "{{#label}} debe ser válida",
        "date.format": "{{#label}} debe estar en formato ISO 8601",
        "any.required": "{{#label}} es requerida",
    }),
    description: joi_1.default.string().required().label("description").messages({
        "string.empty": "{{#label}} no puede estar vacía",
    }),
    day_of_week: joi_1.default.string()
        .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
        .required()
        .label("day_of_week")
        .messages({
        "any.only": "{{#label}} debe ser uno de: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
        "any.required": "{{#label}} es requerido",
    }),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
exports.workScheduleIdSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().label("id"),
    created_at: joi_1.default.date().timestamp().optional().allow(null).label("created_at"),
    updated_at: joi_1.default.date().timestamp().optional().allow(null).label("updated_at"),
});
exports.deleteUserSchema = exports.idParamSchema;
