// db.ts
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import { ensureDatabaseSchema } from './schema'; // Ajusta la ruta según tu estructura

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

// Prueba de conexión a la base de datos
db.one('SELECT NOW()')
  .then((data) => {
    console.log('Database connection successful:', data);

    // Una vez conectados, asegurar que el esquema de la base de datos esté correcto
    return ensureDatabaseSchema();
  })
  .then(() => {
    console.log('Database schema ensured successfully.');
  })
  .catch((error) => {
    console.error('Error during database connection or schema setup:', error);
  });

export { db };
