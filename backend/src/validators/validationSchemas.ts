import Joi from "joi";

// Validaciones:

// Para el registro
export const userRegistrationSchema = Joi.object({
  id: Joi.number().integer().positive(),
  role: Joi.string()
    .valid("admin", "maintenance", "cleaning", "delivery")
    .required()
    .messages({
      "any.only": "Rol inválido",
      "any.required": "El rol es requerido",
    }),
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^(?![-_])[A-Za-z0-9Ññ_-]{1,18}[A-Za-z0-9Ññ](?<![-_])$/)
    .required()
    .messages({
      "string.min": "El nombre de usuario debe tener mínimo 3 caracteres",
      "string.max": "El nombre de usuario debe tener máximo 20 caracteres",
      "string.pattern.base":
        'El nombre de usuario puede contener números, mayúsculas, minúsculas, "-" y "_". No puede empezar ni terminar con "-" o "_"',
      "any.required": "El nombre de usuario es requerido",
    }),
  name: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    .max(100)
    .required()
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "string.max": "El nombre debe tener máximo 100 caracteres",
      "any.required": "El nombre es requerido",
    }),
  firstname: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    .max(100)
    .required()
    .messages({
      "string.pattern.base":
        "El primer apellido solo puede contener letras y espacios",
      "string.max": "El primer apellido debe tener máximo 100 caracteres",
      "any.required": "El primer apellido es requerido",
    }),
  lastname: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\s]+$/)
    .max(100)
    .required()
    .messages({
      "string.pattern.base":
        "El segundo apellido solo puede contener letras y espacios",
      "string.max": "El segundo apellido debe tener máximo 100 caracteres",
      "any.required": "El segundo apellido es requerido",
    }),
  dni: Joi.string()
    .regex(/^[A-Za-z0-9]+$/)
    .max(16)
    .required()
    .messages({
      "string.pattern.base":
        "El DNI o NIE solo puede contener números y letras",
      "string.max": "El DNI o NIE debe tener máximo 16 caracteres",
      "any.required": "El DNI o NIE es requerido",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Formato de email inválido",
    "any.required": "El email es requerido",
  }),
  telephone: Joi.string()
    .pattern(/^\d{9,15}$/)
    .max(20)
    .required()
    .messages({
      "string.pattern.base":
        "El teléfono solo puede contener entre 9 y 15 números",
      "string.max": "El teléfono debe tener máximo 20 caracteres",
      "any.required": "El teléfono es requerido",
    }),
  address: Joi.string()
    .pattern(/^[A-Za-zÀ-ÿ\d\s,]+$/)
    .required()
    .messages({
      "string.pattern.base":
        'Dirección sólo admite letras, números, "," y espacios',
      "any.required": "La dirección es requerida",
    }),
  postal_code: Joi.string()
    .pattern(/^\d{4,10}$/) 
    .required()
    .messages({
      "string.pattern.base":
        "El código postal debe ser un número entre 4 y 10 dígitos.",
      "any.required": "El código postal es requerido",
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/[A-Z]/, "uppercase")
    .regex(/[a-z]/, "lowercase")
    .regex(/\d/, "number")
    .regex(/[@$!%*?&.#]/, "special")
    .required()
    .messages({
      "string.min": "La contraseña debe tener mínimo 8 caracteres",
      "string.max": "La contraseña debe tener máximo 30 caracteres",
      "string.pattern.uppercase":
        "La contraseña debe contener al menos una letra mayúscula",
      "string.pattern.lowercase":
        "La contraseña debe contener al menos una letra minúscula",
      "string.pattern.number": "La contraseña debe contener al menos un número",
      "string.pattern.special":
        "La contraseña debe contener al menos un símbolo especial (@$!%*?&.#)",
      "any.required": "La contraseña es requerida",
    }),

    created_at: Joi.string(),
    updated_at: Joi.string()
});

// Para el login
export const userLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "El nombre de usuario es requerido",
  }),
  password: Joi.string().required().messages({
    "any.required": "La contraseña es requerida",
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
});

// Para la creación de notas
export const createNoteSchema = Joi.object({
  user_id: Joi.number().integer().required().positive().messages({
    "number.base": "El ID de usuario debe ser un número entero",
    "any.required": "El ID de usuario es requerido",
    "number.positive": "El ID de usuario debe ser un número positivo",
  }),
  title: Joi.string().max(100).required().messages({
    "string.max": "El título no puede exceder los 100 caracteres",
    "any.required": "El título es requerido",
  }),
  description: Joi.string().max(800).required().messages({
    "any.required": "La descripción es requerida",
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
});

// Para la actualización de notas
export const updateNoteSchema = Joi.object({
  title: Joi.string().max(100).required().messages({
    "string.max": "El título no puede exceder los 100 caracteres",
    "any.required": "El título es requerido",
  }),
  description: Joi.string().max(800).required().messages({
    "any.required": "La descripción es requerida",
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID debe ser un número.',
    'number.integer': 'El ID debe ser un número entero.',
    'number.positive': 'El ID debe ser un número positivo.',
    'any.required': 'El ID es obligatorio.' 
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
});

export const userIdParamSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID de usuario debe ser un número.',
    'number.integer': 'El ID de usuario debe ser un número entero.',
    'number.positive': 'El ID de usuario debe ser un número positivo.',
    'any.required': 'El ID de usuario es obligatorio.'
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
});

// Esquema de validación para la creación de tareas
export const createTaskSchema = Joi.object({
  
  title: Joi.string().max(100).required().messages({
    "string.max": "El título no puede exceder los 100 caracteres", // Ajustar mensaje para reflejar la longitud máxima correcta
    "any.required": "El título es requerido",
  }),
  description: Joi.string().max(200).required().messages({
    "string.max": "La descripción no puede exceder los 200 caracteres", // Añadir mensaje para el límite de descripción
    "any.required": "La descripción es requerida",
  }),
  status: Joi.string()
    .valid("pending", "in_progress", "completed") // Corregir los valores válidos para status
    .required()
    .messages({
      "any.only": "El estado de la tarea debe ser uno de los siguientes: pending, in_progress, completed",
      "any.required": "El estado de la tarea es requerido",
    }),
  
  completed_at: Joi.date().optional().messages({
    "date.base": "La fecha de finalización debe ser válida",
  }),
  
  // Campos que deben ser prohibidos en la solicitud, ya que se manejan automáticamente en la base de datos
  created_at: Joi.forbidden().messages({
    "any.unknown": "El campo 'created_at' no está permitido",
  }),
  updated_at: Joi.forbidden().messages({
    "any.unknown": "El campo 'updated_at' no está permitido",
  }),
});

// Para la actualización de tareas
export const updateTaskSchema = Joi.object({
  
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID debe ser un número.',
    'number.integer': 'El ID debe ser un número entero.',
    'number.positive': 'El ID debe ser un número positivo.',
    'any.required': 'El ID es obligatorio.'
  }), 
  title: Joi.string().max(100).required().messages({
    "string.max": "El título no puede exceder los 100 caracteres",
    "any.required": "El título es requerido",
  }),
  description: Joi.string().max(200).required().messages({
    "any.required": "La descripción es requerida",
  }),
  status: Joi.string()
    .valid("pending", "in_progress", "completed")
    .required()
    .messages({
      "any.only":
        "El estado de la tarea debe ser uno de los siguientes: pending, in_progress, completed",
    }),
  completed_at: Joi.date().optional().messages({
    "date.base": "La fecha de finalización debe ser válida",
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
});


export const createWorkScheduleSchema = Joi.object({
  user_id: Joi.number().integer(),
  start_time: Joi.date().iso().required().messages({
    "date.base": "La fecha y hora de inicio debe ser válida",
    "any.required": "La fecha y hora de inicio es requerida",
    'date.format': 'La fecha de inicio debe estar en formato ISO 8601',
  }),
  end_time: Joi.date().iso().required().greater(Joi.ref('start_time')).messages({
    'date.format': 'La fecha de finalización debe estar en formato ISO 8601',
    'any.required': 'La hora de finalización es requerida',
    'date.greater': 'La hora de finalización debe ser posterior a la hora de inicio',
  }),
  description: Joi.string().required().messages({
    "string.empty": "La descripción no puede estar vacía",
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
    .messages({
      "any.only":
        "El día de la semana debe ser uno de: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      "any.required": "El día de la semana es requerido",
    }),
    created_at: Joi.string(),
    updated_at: Joi.string()
});

// Esquema de validación para la actualización de horarios laborales
export const updateWorkScheduleSchema = Joi.object({
  start_time: Joi.date().iso().required().messages({
    "date.base": "La fecha y hora de inicio debe ser válida",
    'date.format': 'La fecha de inicio debe estar en formato ISO 8601',
    "any.required": "La fecha y hora de inicio es requerida",
  }),
  end_time: Joi.date().iso().required().messages({
    "date.base": "La fecha y hora de fin debe ser válida",
    'date.format': 'La fecha de inicio debe estar en formato ISO 8601',
    "any.required": "La fecha y hora de fin es requerida",
  }),
  description: Joi.string().required().messages({
    "string.empty": "La descripción no puede estar vacía",
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
    .messages({
      "any.only":
        "El día de la semana debe ser uno de: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      "any.required": "El día de la semana es requerido",
    }),
    created_at: Joi.string(),
    updated_at: Joi.string()
});

export const workScheduleIdSchema = Joi.object({
  id: Joi.number().integer().positive(),
  created_at: Joi.string(),
  updated_at: Joi.string()
});

export const userProfileSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
    'string.max': 'El nombre de usuario no debe exceder los 20 caracteres',
    'any.required': 'El nombre de usuario es requerido',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Formato de email inválido',
    'any.required': 'El email es requerido',
  }),
  created_at: Joi.string(),
  updated_at: Joi.string()
 
});

export const deleteUserSchema = idParamSchema;