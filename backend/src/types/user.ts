// user.ts
export interface User {
  id: string;
  role: 'admin' | 'maintenance' | 'cleaning' | 'delivery'; // Ejemplo de roles permitidos
  username: string;
  name: string;
  firstname: string;
  lastname: string;
  dni: string;
  email: string;
  telephone: string;
  address: string;
  cp: string;
  password: string;}
