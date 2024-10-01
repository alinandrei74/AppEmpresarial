import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import { ensureDatabaseSchema } from './schema';
import Logger from '../utils/logger';

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

/**
 * Prueba de conexión a la base de datos y asegura el esquema.
 */
(async () => {
  try {
    const data = await db.one('SELECT NOW()');
    Logger.success('Conexión a la base de datos exitosa:', data);

    await ensureDatabaseSchema();
    Logger.finalSuccess('Esquema de la base de datos asegurado exitosamente.');
  } catch (error) {
    Logger.finalError('Error durante la conexión a la base de datos o la configuración del esquema:', error);
  }
})();

export { db };
