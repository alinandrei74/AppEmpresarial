//; Función genérica para cargar datos desde localStorage o usar valores predeterminados si no están disponibles
const loadFromLocalStorage = (key, defaultValue = []) => {
  const dataFromStorage = localStorage.getItem(key);
  return dataFromStorage ? JSON.parse(dataFromStorage) : defaultValue;
};

//; Función genérica para guardar datos en localStorage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

//; Datos predeterminados para cada tabla
const defaultUsers = [
  {
    user_id: "uuid-1",
    username: "Admin",
    password: "Admin1.", //; ¡Nunca almacenes contraseñas en texto plano en producción!
    role_name: "admin",
  },
  {
    user_id: "uuid-2",
    username: "Limpieza",
    password: "Limpieza1.",
    role_name: "cleaning",
  },
  {
    user_id: "uuid-3",
    username: "Entrega",
    password: "Entrega1.",
    role_name: "delivery",
  },
  {
    user_id: "uuid-4",
    username: "Mantenimiento",
    password: "Mantenimiento1.",
    role_name: "maintenance",
  },
];

const defaultUserPersonalData = [
  {
    user_id: "uuid-1",
    first_name: "John",
    last_name: "Doe",
    middle_name: "Smith",
  },
  {
    user_id: "uuid-2",
    first_name: "Jane",
    last_name: "Doe",
    middle_name: "Smith",
  },
  {
    user_id: "uuid-3",
    first_name: "Michael",
    last_name: "Johnson",
    middle_name: "Brown",
  },
  {
    user_id: "uuid-4",
    first_name: "Emily",
    last_name: "Taylor",
    middle_name: "Martinez",
  },
];

const defaultUserContactData = [
  {
    user_id: "uuid-1",
    email: "example1@example.com",
    phone_number: "1234567890",
  },
  {
    user_id: "uuid-2",
    email: "example2@example.com",
    phone_number: "2345678901",
  },
  {
    user_id: "uuid-3",
    email: "example3@example.com",
    phone_number: "3456789012",
  },
  {
    user_id: "uuid-4",
    email: "example4@example.com",
    phone_number: "4567890123",
  },
];

const defaultUserAdditionalData = [
  {
    user_id: "uuid-1",
    dni: "123456789A",
    address: "123 Example St",
    postal_code: "12345",
  },
  {
    user_id: "uuid-2",
    dni: "234567890B",
    address: "456 Test Ave",
    postal_code: "23456",
  },
  {
    user_id: "uuid-3",
    dni: "345678901C",
    address: "789 Sample Rd",
    postal_code: "34567",
  },
  {
    user_id: "uuid-4",
    dni: "456789012D",
    address: "012 Mockingbird Ln",
    postal_code: "45678",
  },
];

const defaultTasks = [
  {
    task_id: "tid-1",
    description: "Revisar limpieza del piso 1",
    status: "pending",
    user_id: "uuid-2",
    entry_date: "2024-08-25",
  },
  {
    task_id: "tid-2",
    description: "Reparación de tuberías en el apartamento 2B",
    status: "done",
    user_id: "uuid-4",
    entry_date: "2024-08-26",
  },
  {
    task_id: "tid-3",
    description: "Entrega de correo a la recepción",
    status: "canceled",
    user_id: "uuid-3",
    entry_date: "2024-08-27",
  },
];

//; Cargamos los datos de todas las tablas desde localStorage o usamos los datos predeterminados
export const Users = loadFromLocalStorage("Users", defaultUsers);
export const UserPersonalData = loadFromLocalStorage(
  "UserPersonalData",
  defaultUserPersonalData
);
export const UserContactData = loadFromLocalStorage(
  "UserContactData",
  defaultUserContactData
);
export const UserAdditionalData = loadFromLocalStorage(
  "UserAdditionalData",
  defaultUserAdditionalData
);
export const Tasks = loadFromLocalStorage("Tasks", defaultTasks);

//; Función para guardar todas las tablas en localStorage
export const saveAllTablesToLocalStorage = () => {
  saveToLocalStorage("Users", Users);
  saveToLocalStorage("UserPersonalData", UserPersonalData);
  saveToLocalStorage("UserContactData", UserContactData);
  saveToLocalStorage("UserAdditionalData", UserAdditionalData);
  saveToLocalStorage("Tasks", Tasks);
};

//; Función para restablecer todas las tablas a sus valores predeterminados
export const resetAllTablesToDefaults = () => {
  console.info("Tablas restablecidas a sus valores predeterminados");
  saveToLocalStorage("Users", defaultUsers);
  saveToLocalStorage("UserPersonalData", defaultUserPersonalData);
  saveToLocalStorage("UserContactData", defaultUserContactData);
  saveToLocalStorage("UserAdditionalData", defaultUserAdditionalData);
  saveToLocalStorage("Tasks", defaultTasks);

  //; Actualizar las variables en memoria con los valores predeterminados
  Users.splice(0, Users.length, ...defaultUsers);
  UserPersonalData.splice(
    0,
    UserPersonalData.length,
    ...defaultUserPersonalData
  );
  UserContactData.splice(0, UserContactData.length, ...defaultUserContactData);
  UserAdditionalData.splice(
    0,
    UserAdditionalData.length,
    ...defaultUserAdditionalData
  );
  Tasks.splice(0, Tasks.length, ...defaultTasks);
};
