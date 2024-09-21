import { db } from './db';
import Logger from '../utils/Logger';

/**
 * Asegura que las tablas, columnas y triggers necesarios existen en la base de datos.
 */
export const ensureDatabaseSchema = async (): Promise<void> => {
  try {
    Logger.information('Iniciando verificación y aseguramiento del esquema de la base de datos.');

    //; Definiciones de las tablas y columnas esperadas
    const tables: TableDefinition[] = [
      {
        name: 'users',
        createQuery: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            role VARCHAR(50),
            username VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(100),
            firstname VARCHAR(100),
            lastname VARCHAR(100),
            dni VARCHAR(20) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            telephone VARCHAR(20),
            address TEXT,
            cp VARCHAR(10),
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
        columns: {
          id: 'SERIAL PRIMARY KEY',
          role: 'VARCHAR(50)',
          username: 'VARCHAR(100) UNIQUE NOT NULL',
          name: 'VARCHAR(100)',
          firstname: 'VARCHAR(100)',
          lastname: 'VARCHAR(100)',
          dni: 'VARCHAR(20) UNIQUE NOT NULL',
          email: 'VARCHAR(100) UNIQUE NOT NULL',
          telephone: 'VARCHAR(20)',
          address: 'TEXT',
          cp: 'VARCHAR(10)',
          password: 'VARCHAR(255) NOT NULL',
          created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
          updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        },
      },
      {
        name: 'tasks',
        createQuery: `
          CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            description TEXT NOT NULL,
            status VARCHAR(50) NOT NULL,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP DEFAULT NULL
          );
        `,
        columns: {
          id: 'SERIAL PRIMARY KEY',
          description: 'TEXT NOT NULL',
          status: 'VARCHAR(50) NOT NULL',
          user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
          created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
          updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
          completed_at: 'TIMESTAMP DEFAULT NULL',
        },
      },
      {
        name: 'notes',
        createQuery: `
          CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
        columns: {
          id: 'SERIAL PRIMARY KEY',
          user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
          title: 'VARCHAR(255) NOT NULL',
          description: 'TEXT NOT NULL',
          created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
          updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        },
      },
      {
        name: 'work_schedule',
        createQuery: `
          CREATE TABLE IF NOT EXISTS work_schedule (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            description TEXT NOT NULL,
            day_of_week VARCHAR(15) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `,
        columns: {
          id: 'SERIAL PRIMARY KEY',
          user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
          start_time: 'TIMESTAMP NOT NULL',
          end_time: 'TIMESTAMP NOT NULL',
          description: 'TEXT NOT NULL',
          day_of_week: 'VARCHAR(15) NOT NULL',
          created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
          updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        },
      },
    ];

    //; Iterar sobre cada tabla y realizar las operaciones necesarias
    for (const table of tables) {
      await createTableIfNotExists(table.name, table.createQuery);
      await checkAndAlterTableColumns(table.name, table.columns);
      await createUpdatedAtTrigger(table.name);
    }

    Logger.finalSuccess('Tablas, columnas y triggers verificados/creados exitosamente.');
  } catch (error) {
    Logger.finalError('Error en el proceso de creación/verificación del esquema de la base de datos:', error);
    throw new Error('Fallo al asegurar el esquema de la base de datos.');
  }
};

/**
 * Crea una tabla si no existe. Si falla, la elimina y la vuelve a crear.
 * @param tableName - El nombre de la tabla.
 * @param createTableQuery - La consulta SQL para crear la tabla.
 */
const createTableIfNotExists = async (tableName: string, createTableQuery: string): Promise<void> => {
  try {
    await db.none(createTableQuery);
    Logger.success(`Tabla {'${tableName}'} creada o ya existente.`);
  } catch (error) {
    Logger.error(`Error creando la tabla {'${tableName}'}:`, error);
    await dropTableAndRetry(tableName, createTableQuery);
  }
};

/**
 * Elimina una tabla y la vuelve a crear en caso de error.
 * @param tableName - El nombre de la tabla.
 * @param createTableQuery - La consulta SQL para crear la tabla.
 */
const dropTableAndRetry = async (tableName: string, createTableQuery: string): Promise<void> => {
  try {
    Logger.warning(`Eliminando la tabla '${tableName}' debido a un error previo...`);
    await db.none(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    Logger.success(`Tabla '${tableName}' eliminada. Intentando recrear...`);
    await db.none(createTableQuery);
    Logger.success(`Tabla '${tableName}' recreada exitosamente.`);
  } catch (error) {
    Logger.error(`Error al eliminar o recrear la tabla '${tableName}':`, error);
    throw new Error(`Fallo al recrear la tabla '${tableName}'.`);
  }
};

/**
 * Verifica y ajusta columnas de una tabla para que coincidan con las definiciones esperadas.
 * @param tableName - El nombre de la tabla.
 * @param expectedColumns - Las definiciones de columnas esperadas.
 */
const checkAndAlterTableColumns = async (tableName: string, expectedColumns: Record<string, string>): Promise<void> => {
  try {
    Logger.information(`Verificando columnas de la tabla {'${tableName}'}.`);
    const existingColumns = await db.any<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
      [tableName]
    );

    const existingColumnNames = existingColumns.map((col) => col.column_name.toLowerCase());

    //; Crear columnas que faltan
    for (const [columnName, columnDefinition] of Object.entries(expectedColumns)) {
      if (!existingColumnNames.includes(columnName.toLowerCase())) {
        await db.none(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
        Logger.success(`Columna '{${columnName}'} añadida a la tabla {'${tableName}'}.`);
      }
    }

    //; Eliminar columnas sobrantes
    await removeExtraColumns(tableName, existingColumnNames, Object.keys(expectedColumns));
  } catch (error) {
    Logger.error(`Error verificando/ajustando columnas de la tabla {'${tableName}'}:`, error);
    throw new Error(`Fallo al verificar/ajustar columnas en la tabla {'${tableName}'}.`);
  }
};

/**
 * Elimina las columnas de la tabla que no están declaradas en el esquema esperado.
 * @param tableName - El nombre de la tabla.
 * @param existingColumns - Columnas actuales en la tabla.
 * @param expectedColumns - Columnas esperadas en la tabla.
 */
const removeExtraColumns = async (tableName: string, existingColumns: string[], expectedColumns: string[]): Promise<void> => {
  for (const columnName of existingColumns) {
    if (!expectedColumns.map((col) => col.toLowerCase()).includes(columnName.toLowerCase())) {
      try {
        await db.none(`ALTER TABLE ${tableName} DROP COLUMN ${columnName} CASCADE`);
        Logger.warning(`Columna {'${columnName}'} eliminada de la tabla {'${tableName}'}.`);
      } catch (error) {
        Logger.error(`Error eliminando la columna {'${columnName}'} de la tabla {'${tableName}'}:`, error);
      }
    }
  }
};

/**
 * Crea funciones y triggers para actualizar el campo `updated_at`.
 * @param tableName - El nombre de la tabla.
 */
const createUpdatedAtTrigger = async (tableName: string): Promise<void> => {
  try {
    await db.none(`
      CREATE OR REPLACE FUNCTION update_${tableName}_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_${tableName}_updated_at_trigger'
        ) THEN
          CREATE TRIGGER update_${tableName}_updated_at_trigger
          BEFORE UPDATE ON ${tableName}
          FOR EACH ROW
          EXECUTE FUNCTION update_${tableName}_updated_at_column();
        END IF;
      END;
      $$;
    `);
    Logger.success(`Trigger 'update_{${tableName}}_updated_at_trigger' creado/verificado para la tabla '${tableName}'.`);
  } catch (error) {
    Logger.error(`Error creando/verificando el trigger para la tabla {'${tableName}'}:`, error);
    throw new Error(`Fallo al crear/verificar el trigger para la tabla '${tableName}'.`);
  }
};

/**
 * Definición de una tabla, incluyendo su nombre, consulta de creación y columnas esperadas.
 */
interface TableDefinition {
  name: string;
  createQuery: string;
  columns: Record<string, string>;
}
