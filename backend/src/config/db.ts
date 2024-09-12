import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL); // Verifica si la variable de entorno está cargada

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

// Prueba de conexión
db.one('SELECT NOW()')
  .then((data) => {
    console.log('Database connection successful:', data);
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export { db };
