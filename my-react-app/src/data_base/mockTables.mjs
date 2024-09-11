//* Simulación de la tabla de Usuarios (users)
const Users = [
  {
    user_id: "uuid-1",
    username: "Admin",
    password: "Admin1.", //! Nota: nunca almacenes contraseñas en texto plano en un entorno de producción.
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

//* Simulación de la tabla de Información Personal de Usuarios (user_personal_data)
const UserPersonalData = [
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

//* Simulación de la tabla de Información de Contacto de Usuarios (user_contact_data)
const UserContactData = [
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

//* Simulación de la tabla de Información Adicional de Usuarios (user_additional_data)
const UserAdditionalData = [
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

//* Simulación de la tabla de Tareas (tasks)
const Tasks = [
  {
    task_id: 1,
    description: "Revisar limpieza del piso 1",
    status: "pending",
    user_id: "uuid-2",
    entry_date: "2024-08-25",
  },
  {
    task_id: 2,
    description: "Reparación de tuberías en el apartamento 2B",
    status: "done",
    user_id: "uuid-4",
    entry_date: "2024-08-26",
  },
  {
    task_id: 3,
    description: "Entrega de correo a la recepción",
    status: "canceled",
    user_id: "uuid-3",
    entry_date: "2024-08-27",
  },
];

//* Exportar las tablas simuladas
export { Users, UserPersonalData, UserContactData, UserAdditionalData, Tasks };
