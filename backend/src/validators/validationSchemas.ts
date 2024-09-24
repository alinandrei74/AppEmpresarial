import Joi from "joi";


// Validaciones:

// Para el registro
export const userRegistrationSchema = Joi.object({
  role: Joi.string()
    .valid("admin", "maintenance", "cleaning", "delivery")
    .max(50)
    .required()
    .label("role - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "any.only": "{{#label}} inválido", // Usa {{#label}} para mostrar el nombre del campo
      "any.required": "{{#label}} es requerido",
    }),
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^(?![-_])[A-Za-z0-9Ññ_-]{1,18}[A-Za-z0-9Ññ](?<![-_])$/)
    .required()
    .label("username - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.min": "{{#label}} debe tener mínimo 3 caracteres",
      "string.max": "{{#label}} debe tener máximo 20 caracteres",
      "string.pattern.base":
        '{{#label}} puede contener números, mayúsculas, minúsculas, "-" y "_". No puede empezar ni terminar con "-" o "_"',
      "any.required": "{{#label}} es requerido",
    }),
  name: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    .max(100)
    .required()
    .label("name - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base": "{{#label}} solo puede contener letras y espacios",
      "string.max": "{{#label}} debe tener máximo 100 caracteres",
      "any.required": "{{#label}} es requerido",
    }),
  firstname: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    .max(100)
    .required()
    .label("firstname - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base": "{{#label}} solo puede contener letras y espacios",
      "string.max": "{{#label}} debe tener máximo 100 caracteres",
      "any.required": "{{#label}} es requerido",
    }),
  lastname: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    .max(100)
    .required()
    .label("lastname - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base": "{{#label}} solo puede contener letras y espacios",
      "string.max": "{{#label}} debe tener máximo 100 caracteres",
      "any.required": "{{#label}} es requerido",
    }),
  dni: Joi.string()
    .pattern(/^[A-Za-z0-9]+$/)
    .max(16)
    .required()
    .label("dni - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base": "{{#label}} solo puede contener números y letras",
      "string.max": "{{#label}} debe tener máximo 16 caracteres",
      "any.required": "{{#label}} es requerido",
    }),
  email: Joi.string().email().max(100).required().label("email - userRegistrationSchema").messages({
    "string.email": "{{#label}} tiene un formato inválido",
    "any.required": "{{#label}} es requerido",
  }),
  telephone: Joi.string()
    .pattern(/^\d{9,15}$/)
    .max(20)
    .required()
    .label("telephone - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base":
        "{{#label}} solo puede contener entre 9 y 15 números",
      "string.max": "{{#label}} debe tener máximo 20 caracteres",
      "any.required": "{{#label}} es requerido",
    }),
  address: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\d\s,]+$/)
    .required()
    .label("address - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base":
        '{{#label}} solo admite letras, números, "," y espacios',
      "any.required": "{{#label}} es requerida",
    }),
  postal_code: Joi.string()
    .pattern(/^\d{4,10}$/)
    .max(10)
    .required()
    .label("postal_code - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.pattern.base":
        "{{#label}} debe ser un número entre 4 y 10 dígitos.",
      "any.required": "{{#label}} es requerido",
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/\d/, "number")
    .pattern(/[@$!%*?&.#]/, "special")
    .required()
    .label("password - userRegistrationSchema") // Añadir un label para personalizar el mensaje de error
    .messages({
      "string.min": "{{#label}} debe tener mínimo 8 caracteres",
      "string.max": "{{#label}} debe tener máximo 30 caracteres",
      "string.pattern.uppercase":
        "{{#label}} debe contener al menos una letra mayúscula",
      "string.pattern.lowercase":
        "{{#label}} debe contener al menos una letra minúscula",
      "string.pattern.number": "{{#label}} debe contener al menos un número",
      "string.pattern.special":
        "{{#label}} debe contener al menos un símbolo especial (@$!%*?&.#)",
      "any.required": "{{#label}} es requerida",
    }),

  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - userRegistrationSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - userRegistrationSchema"),
});

// Para el login
export const userLoginSchema = Joi.object({
  username: Joi.string().required().label("username - userLoginSchema").messages({
    "any.required": "{{#label}} es requerido",
  }),
  password: Joi.string().required().label("password - userLoginSchema").messages({
    "any.required": "{{#label}} es requerida",
  }),
});

// Para la creación de notas
export const createNoteSchema = Joi.object({
  title: Joi.string().max(100).required().label("title - createNoteSchema").messages({
    "string.max": "{{#label}} no puede exceder los 100 caracteres",
    "any.required": "{{#label}} es requerido",
  }),
  description: Joi.string().max(800).required().label("description - createNoteSchema").messages({
    "any.required": "{{#label}} es requerida",
  }),
  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - createNoteSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - createNoteSchema"),
});

// Para la actualización de notas
export const updateNoteSchema = Joi.object({
  id: Joi.number().integer().required().positive().label("id - updateNoteSchema").messages({
    "number.base": "{{#label}} debe ser un número entero",
    "any.required": "{{#label}} es requerido",
    "number.positive": "{{#label}} debe ser un número positivo",
  }),
  title: Joi.string().max(100).required().label("title - updateNoteSchema").messages({
    "string.max": "{{#label}} no puede exceder los 100 caracteres",
    "any.required": "{{#label}} es requerido",
  }),
  description: Joi.string().max(800).required().label("description - updateNoteSchema").messages({
    "any.required": "{{#label}} es requerida",
  }),
  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - updateNoteSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - updateNoteSchema"),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().label("id -idParamSchema").messages({
    "number.base": "{{#label}} debe ser un número.",
    "number.integer": "{{#label}} debe ser un número entero.",
    "number.positive": "{{#label}} debe ser un número positivo.",
    "any.required": "{{#label}} es obligatorio.",
  }),
  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - idParamSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at -idParamSchema"),
});

export const userIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().allow().label("id - userIdParamSchema").messages({
    "error en id" : "Error en id - userIdParamSchema" 
  }),
  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - userIdParamSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - userIdParamSchema"),
});

// Esquema de validación para la creación de tareas
export const createTaskSchema = Joi.object({
  user_id: Joi.number()
    .integer()
    .positive()
    .required()
    .label("user_id - createTaskSchema")
    .messages({
      "number.base": "{{#label}} debe ser un número.",
      "number.integer": "{{#label}} debe ser un número entero.",
      "number.positive": "{{#label}} debe ser un número positivo.",
      "any.required": "{{#label}} es obligatorio.",
    }),
  title: Joi.string().max(100).required().label("title - createTaskSchema").messages({
    "string.max": "{{#label}} no puede exceder los 100 caracteres", // Ajustar mensaje para reflejar la longitud máxima correcta
    "any.required": "{{#label}} es requerido",
  }),
  description: Joi.string().max(200).required().label("description - createTaskSchema").messages({
    "string.max": "{{#label}} no puede exceder los 200 caracteres", // Añadir mensaje para el límite de descripción
    "any.required": "{{#label}} es requerida",
  }),

  is_done: Joi.boolean()
    .valid(false)
    .optional()
    .label("is_done - createTaskSchema")
    .messages({
      "any.only": "{{#label}} debe ser true o false.",
      "any.required": "{{#label}} es requerido.",
    }),

  completed_at: Joi.date().allow(null).label("completed_at - createTaskSchema"),
  created_at: Joi.date().allow(null).label("created_at - createTaskSchema"),
  updated_at: Joi.date().allow(null).label("updated_at - createTaskSchema"),
});

// Para la actualización de tareas
export const updateTaskSchema = Joi.object({
  id: Joi.number().integer().positive().allow().label("id - updateTaskSchema").messages({
    "error en id" : "Error en id - updateTaskSchema" 
  }),
  user_id: Joi.number().allow().label("user_id - updateTaskSchema"),
  title: Joi.string().max(100).optional().label("title - updateTaskSchema").messages({
    "string.max": "{{#label}} no puede exceder los 100 caracteres",
    "any.required": "{{#label}} es requerido",
  }),
  description: Joi.string().max(200).optional().label("description - updateTaskSchema").messages({
    "any.required": "{{#label}} es requerida",
  }),
  is_done: Joi.boolean()
    .valid(true, false)
    .optional()
    .label("is_done - updateTaskSchema")
    .messages({
      "any.only": "{{#label}} debe ser true o false.",
      "any.required": "{{#label}} es requerido.",
    }),
  completed_at: Joi.date().allow(null).label("completed_at -updateTaskSchema"),
  created_at: Joi.date().allow(null).label("created_at - updateTaskSchema"),
  updated_at: Joi.date().allow(null).label("updated_at - updateTaskSchema"),
});

export const createWorkScheduleSchema = Joi.object({
  start_time: Joi.date().iso().required().label("start_time - createWorkScheduleSchema").messages({
    "date.base": "{{#label}} debe ser válida",
    "any.required": "{{#label}} es requerida",
    "date.format": "{{#label}} debe estar en formato ISO 8601",
  }),
  end_time: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref("start_time - createWorkScheduleSchema"))
    .label("end_time - createWorkScheduleSchema")
    .messages({
      "date.format": "{{#label}} debe estar en formato ISO 8601",
      "any.required": "{{#label}} es requerida",
      "date.greater": "{{#label}} debe ser posterior a la hora de inicio",
    }),
  description: Joi.string().required().label("description - createWorkScheduleSchema").messages({
    "string.empty": "{{#label}} no puede estar vacía",
  }),
  day_of_week: Joi.string()
    .valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
    .required()
    .label("day_of_week - createWorkScheduleSchema")
    .messages({
      "any.only":
        "{{#label}} debe ser uno de: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      "any.required": "{{#label}} es requerido",
    }),

  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - createWorkScheduleSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - createWorkScheduleSchema"),
});

// Esquema de validación para la actualización de horarios laborales
export const updateWorkScheduleSchema = Joi.object({
  id: Joi.number().integer().positive().required().label("id - updateWorkScheduleSchema").messages({
    "number.base": "{{#label}} debe ser un número.",
    "number.integer": "{{#label}} debe ser un número entero.",
    "number.positive": "{{#label}} debe ser un número positivo.",
    "any.required": "{{#label}} es obligatorio.",
  }),
  start_time: Joi.date().iso().required().label("start_time - updateWorkScheduleSchema").messages({
    "date.base": "{{#label}} debe ser válida",
    "date.format": "{{#label}} debe estar en formato ISO 8601",
    "any.required": "{{#label}} es requerida",
  }),
  end_time: Joi.date().iso().required().label("end_time - updateWorkScheduleSchema").messages({
    "date.base": "{{#label}} debe ser válida",
    "date.format": "{{#label}} debe estar en formato ISO 8601",
    "any.required": "{{#label}} es requerida",
  }),
  description: Joi.string().required().label("description - updateWorkScheduleSchema").messages({
    "string.empty": "{{#label}} no puede estar vacía",
  }),
  day_of_week: Joi.string()
    .valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
    .required()
    .label("day_of_week - updateWorkScheduleSchema")
    .messages({
      "any.only":
        "{{#label}} debe ser uno de: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      "any.required": "{{#label}} es requerido",
    }),

  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - updateWorkScheduleSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - updateWorkScheduleSchema"),
});

export const workScheduleIdSchema = Joi.object({
  id: Joi.number().integer().positive().label("id - workScheduleIdSchema"),
  created_at: Joi.date().timestamp().optional().allow(null).label("created_at - workScheduleIdSchema"),
  updated_at: Joi.date().timestamp().optional().allow(null).label("updated_at - workScheduleIdSchema"),
});

export const userProfileSchema = Joi.object({
  user_id: Joi.number()
    .integer()
    .positive()
    .required()
    .label("user_id - userProfileSchema")
    .messages({
      "number.base": "{{#label}} debe ser un número.",
      "number.integer": "{{#label}} debe ser un número entero.",
      "number.positive": "{{#label}} debe ser un número positivo.",
      "any.required": "{{#label}} es obligatorio.",
    }),
    username: Joi.string()
    .min(3)
    .max(20)
    .required()
    .label('username - userProfileSchema') // Agrega el label aquí
    .messages({
      "string.min": "El campo '{#label}' debe tener al menos 3 caracteres",
      "string.max": "El campo '{#label}' no debe exceder los 20 caracteres",
      "any.required": "El campo '{#label}' es requerido",
    }),
  email: Joi.string()
    .email()
    .required()
    .label('email -userProfileSchema') // Agrega el label aquí
    .messages({
      "string.email": "Formato de '{#label}' inválido",
      "any.required": "El campo '{#label}' es requerido",
    }),
  created_at: Joi.date()
    .timestamp()
    .optional()
    .allow(null)
    .label('Fecha de creación - userProfileSchema'), // Agrega el label aquí
  updated_at: Joi.date()
    .timestamp()
    .optional()
    .allow(null)
    .label('Fecha de actualización - userProfileSchema'), // Agrega el label aquí
});

export const deleteUserSchema = idParamSchema;
