// schema.ts
import { db } from './db'; // Ajusta la ruta si es necesario

/**
 * Asegura que las tablas, columnas, y los triggers necesarios existen en la base de datos.
 */
export const ensureDatabaseSchema = async () => {
  try {
    /**
     * Crea una tabla si no existe.
     * @param {string} tableName - El nombre de la tabla.
     * @param {string} createTableQuery - La consulta SQL para crear la tabla.
     */
    const createTableIfNotExists = async (tableName: string, createTableQuery: string) => {
      try {
        await db.none(createTableQuery);
        console.log(`Tabla '${tableName}' creada o ya existente.`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error creando la tabla '${tableName}':`, error.message);
        } else {
          console.error(`Error desconocido creando la tabla '${tableName}':`, error);
        }
      }
    };

    // Crear la tabla `users` si no existe
    const createUsersTable = `
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
    `;
    await createTableIfNotExists('users', createUsersTable);

    // Crear la tabla `tasks` si no existe
    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP DEFAULT NULL
      );
    `;
    await createTableIfNotExists('tasks', createTasksTable);

    // Crear la tabla `notes` si no existe
    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await createTableIfNotExists('notes', createNotesTable);

    // Crear la tabla `work_schedule` si no existe
    const createWorkScheduleTable = `
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
    `;
    await createTableIfNotExists('work_schedule', createWorkScheduleTable);

    /**
     * Verifica y ajusta columnas de una tabla para que coincidan con las definiciones esperadas.
     * @param {string} tableName - El nombre de la tabla.
     * @param {Record<string, string>} expectedColumns - Las definiciones de columnas esperadas.
     */
    const checkAndAlterTableColumns = async (tableName: string, expectedColumns: Record<string, string>) => {
      const existingColumns: { column_name: string; data_type: string }[] = await db.any(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`,
        [tableName]
      );

      const existingColumnNames = existingColumns.map(col => col.column_name.toLowerCase());

      // Crear columnas que faltan
      for (const [columnName, columnDefinition] of Object.entries(expectedColumns)) {
        if (!existingColumnNames.includes(columnName.toLowerCase())) {
          try {
            await db.none(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
            console.log(`Columna '${columnName}' añadida a la tabla '${tableName}'.`);
          } catch (error) {
            if (error instanceof Error) {
              console.error(`Error añadiendo la columna '${columnName}' a la tabla '${tableName}':`, error.message);
            } else {
              console.error(`Error desconocido añadiendo la columna '${columnName}' a la tabla '${tableName}'.`);
            }
          }
        }
      }

      // Eliminar columnas que sobran (no están en las definiciones esperadas)
      await removeExtraColumns(tableName, existingColumnNames, Object.keys(expectedColumns));
    };

    /**
     * Elimina las columnas de la tabla que no están declaradas en el esquema esperado.
     * @param {string} tableName - El nombre de la tabla.
     * @param {string[]} existingColumns - Columnas actuales en la tabla.
     * @param {string[]} expectedColumns - Columnas esperadas en la tabla.
     */
    const removeExtraColumns = async (tableName: string, existingColumns: string[], expectedColumns: string[]) => {
      for (const columnName of existingColumns) {
        if (!expectedColumns.map(col => col.toLowerCase()).includes(columnName.toLowerCase())) {
          try {
            await db.none(`ALTER TABLE ${tableName} DROP COLUMN ${columnName}`);
            console.log(`Columna '${columnName}' eliminada de la tabla '${tableName}'.`);
          } catch (error) {
            if (error instanceof Error) {
              console.error(`Error eliminando la columna '${columnName}' de la tabla '${tableName}':`, error.message);
            } else {
              console.error(`Error desconocido eliminando la columna '${columnName}' de la tabla '${tableName}'.`);
            }
          }
        }
      }
    };

    // Definiciones de columnas esperadas para cada tabla
    const usersColumns: Record<string, string> = {
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
    };

    const tasksColumns: Record<string, string> = {
      id: 'SERIAL PRIMARY KEY',
      title: 'TEXT NOT NULL',
      description: 'TEXT NOT NULL',
      status: 'VARCHAR(50) NOT NULL',
      user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
      created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      completed_at: 'TIMESTAMP DEFAULT NULL',
    };

    const notesColumns: Record<string, string> = {
      id: 'SERIAL PRIMARY KEY',
      user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
      title: 'VARCHAR(255) NOT NULL',
      description: 'TEXT NOT NULL',
      created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    };

    const workScheduleColumns: Record<string, string> = {
      id: 'SERIAL PRIMARY KEY',
      user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
      start_time: 'TIMESTAMP NOT NULL',
      end_time: 'TIMESTAMP NOT NULL',
      description: 'TEXT NOT NULL',
      day_of_week: 'VARCHAR(15) NOT NULL',
      created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    };

    // Verificar y ajustar columnas
    await checkAndAlterTableColumns('users', usersColumns);
    await checkAndAlterTableColumns('tasks', tasksColumns);
    await checkAndAlterTableColumns('notes', notesColumns);
    await checkAndAlterTableColumns('work_schedule', workScheduleColumns);

    // Crear funciones y triggers para actualizar el campo `updated_at`
    const createUpdatedAtTrigger = async (tableName: string) => {
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
    };

    // Crear triggers para todas las tablas
    await createUpdatedAtTrigger('users');
    await createUpdatedAtTrigger('tasks');
    await createUpdatedAtTrigger('notes');
    await createUpdatedAtTrigger('work_schedule');

    console.log('Tablas, columnas y triggers verificados/creados exitosamente.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creando tablas, columnas o triggers:', error.message);
    } else {
      console.error('Error desconocido al crear tablas, columnas o triggers.');
    }
    throw new Error('Fallo al crear tablas, columnas o triggers.');
  }
};
