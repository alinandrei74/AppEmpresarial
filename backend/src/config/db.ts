import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

// Prueba de conexión (puedes mantener esto durante el desarrollo)
db.one('SELECT NOW()')
  .then((data) => {
    console.log('Database connection successful:', data);
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export { db };
