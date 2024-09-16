export const users = [
  {
    id: 1, // PK
    username: "Admin",
    password: "Admin1.",
    role: "admin",
    name: "John", // Primer nombre
    firstname: "Smith", // Primer apellido
    lastname: "Johnson", // Segundo apellido
    email: "example1@example.com",
    telephone: "1234567890",
    dni: "123456789A",
    address: "123 Example St",
    cp: "12345", // Código postal
    created_at: "2024-09-01",
    updated_at: "2024-09-13",
  },
  {
    id: 2, // PK
    username: "Limpieza",
    password: "Limpieza1.",
    role: "cleaning",
    name: "Jane", // Primer nombre
    firstname: "Smith", // Primer apellido
    lastname: "Doe", // Segundo apellido
    email: "example2@example.com",
    telephone: "2345678901",
    dni: "234567890B",
    address: "456 Test Ave",
    cp: "23456", // Código postal
    created_at: "2024-09-02",
    updated_at: "2024-09-13",
  },
  {
    id: 3, // PK
    username: "Entrega",
    password: "Entrega1.",
    role: "delivery",
    name: "Michael", // Primer nombre
    firstname: "Brown", // Primer apellido
    lastname: "Williams", // Segundo apellido
    email: "example3@example.com",
    telephone: "3456789012",
    dni: "345678901C",
    address: "789 Sample Rd",
    cp: "34567", // Código postal
    created_at: "2024-09-03",
    updated_at: "2024-09-13",
  },
  {
    id: 4, // PK
    username: "Mantenimiento",
    password: "Mantenimiento1.",
    role: "maintenance",
    name: "Emily", // Primer nombre
    firstname: "Martinez", // Primer apellido
    lastname: "Garcia", // Segundo apellido
    email: "example4@example.com",
    telephone: "4567890123",
    dni: "456789012D",
    address: "012 Mockingbird Ln",
    cp: "45678", // Código postal
    created_at: "2024-09-04",
    updated_at: "2024-09-13",
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
    name: "John Smith", // Combinación de name y firstname de `users`
  },
  {
    id: 2, // PK
    user_id: 2, // FK que referencia `users.id`
    title: "Limpieza semanal",
    description: "Realizar limpieza profunda en el segundo piso.",
    created_at: "2024-09-02",
    updated_at: "2024-09-11",
    name: "Jane Smith", // Combinación de name y firstname de `users`
  },
  {
    id: 3, // PK
    user_id: 3, // FK que referencia `users.id`
    title: "Entrega urgente",
    description: "Entregar paquete urgente en la recepción.",
    created_at: "2024-09-03",
    updated_at: "2024-09-12",
    name: "Michael Brown", // Combinación de name y firstname de `users`
  },
  {
    id: 4, // PK
    user_id: 4, // FK que referencia `users.id`
    title: "Revisión de equipos",
    description:
      "Revisar y reparar equipos de aire acondicionado en el tercer piso.",
    created_at: "2024-09-04",
    updated_at: "2024-09-13",
    name: "Emily Martinez", // Combinación de name y firstname de `users`
  },
];
