//;todo---MARK:# Tables

export const role = [
  {
    id: 1, // PK
    name: "admin",
  },
  {
    id: 2, // PK
    name: "cleaning",
  },
  {
    id: 3, // PK
    name: "delivery",
  },
  {
    id: 4, // PK
    name: "maintenance",
  },
];

export const users = [
  {
    id: 1, // PK
    name: "Admin",
    password: "Admin1.",
    role_id: 1, // FK que referencia `role.id`
    first_name: "John",
    last_name: "Doe",
    middle_name: "Smith",
    email: "example1@example.com",
    phone_number: "1234567890",
    dni: "123456789A",
    address: "123 Example St",
    postal_code: "12345",
  },
  {
    id: 2, // PK
    name: "Limpieza",
    password: "Limpieza1.",
    role_id: 2, // FK que referencia `role.id`
    first_name: "Jane",
    last_name: "Doe",
    middle_name: "Smith",
    email: "example2@example.com",
    phone_number: "2345678901",
    dni: "234567890B",
    address: "456 Test Ave",
    postal_code: "23456",
  },
  {
    id: 3, // PK
    name: "Entrega",
    password: "Entrega1.",
    role_id: 3, // FK que referencia `role.id`
    first_name: "Michael",
    last_name: "Johnson",
    middle_name: "Brown",
    email: "example3@example.com",
    phone_number: "3456789012",
    dni: "345678901C",
    address: "789 Sample Rd",
    postal_code: "34567",
  },
  {
    id: 4, // PK
    name: "Mantenimiento",
    password: "Mantenimiento1.",
    role_id: 4, // FK que referencia `role.id`
    first_name: "Emily",
    last_name: "Taylor",
    middle_name: "Martinez",
    email: "example4@example.com",
    phone_number: "4567890123",
    dni: "456789012D",
    address: "012 Mockingbird Ln",
    postal_code: "45678",
  },
];

export const tasks = [
  {
    id: 1, // PK
    description: "Revisar limpieza del piso 1",
    status: "pending",
    user_id: 2, // FK que referencia `users.id`
    created_at: "2024-08-25",
    updated_at: "2024-09-25",
  },
  {
    id: 2, // PK
    description: "Reparación de tuberías en el apartamento 2B",
    status: "done",
    user_id: 4, // FK que referencia `users.id`
    created_at: "2024-08-26",
    updated_at: "2024-09-26",
  },
  {
    id: 3, // PK
    description: "Entrega de correo a la recepción",
    status: "canceled",
    user_id: 3, // FK que referencia `users.id`
    created_at: "2024-08-27",
    updated_at: "2024-09-27",
  },
];

export const notes = [
  {
    id: 1, // PK
    user_id: 1, // FK que referencia `users.id`
    title: "Revisión de seguridad",
    description: "Revisar todos los sistemas de seguridad en la planta baja.",
    created_at: "2024-09-01",
    updated_at: "2024-09-10",
    name: "John Smith Doe", // Combinación de first_name, middle_name, y last_name de `users`
  },
  {
    id: 2, // PK
    user_id: 2, // FK que referencia `users.id`
    title: "Limpieza semanal",
    description: "Realizar limpieza profunda en el segundo piso.",
    created_at: "2024-09-02",
    updated_at: "2024-09-11",
    name: "Jane Smith Doe", // Combinación de first_name, middle_name, y last_name de `users`
  },
  {
    id: 3, // PK
    user_id: 3, // FK que referencia `users.id`
    title: "Entrega urgente",
    description: "Entregar paquete urgente en la recepción.",
    created_at: "2024-09-03",
    updated_at: "2024-09-12",
    name: "Michael Brown Johnson", // Combinación de first_name, middle_name, y last_name de `users`
  },
  {
    id: 4, // PK
    user_id: 4, // FK que referencia `users.id`
    title: "Revisión de equipos",
    description:
      "Revisar y reparar equipos de aire acondicionado en el tercer piso.",
    created_at: "2024-09-04",
    updated_at: "2024-09-13",
    name: "Emily Martinez Taylor", // Combinación de first_name, middle_name, y last_name de `users`
  },
];
