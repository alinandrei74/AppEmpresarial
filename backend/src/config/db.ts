import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

// Función para crear tablas si no existen
const createTablesIfNotExists = async () => {
  try {
    // Crear la tabla work_schedule si no existe
    await db.none(`
      CREATE TABLE IF NOT EXISTS work_schedule (
        id SERIAL PRIMARY KEY,
        worker_id INT REFERENCES users(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        description TEXT NOT NULL,
        day_of_week VARCHAR(15) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tabla work_schedule creada o ya existe.');

    /**
     * Verifica y ajusta columnas de una tabla para que coincidan con las definiciones esperadas.
     * @param {string} tableName - El nombre de la tabla.
     * @param {Record<string, string>} expectedColumns - Las definiciones de columnas esperadas.
     */
    const checkAndAlterTableColumns = async (tableName: string, expectedColumns: Record<string, string>) => {
      // Obtener las columnas existentes de la tabla
      const existingColumns: { column_name: string; data_type: string }[] = await db.any(
        `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
      `,
        [tableName]
      );

      const existingColumnNames = existingColumns.map(col => col.column_name.toLowerCase()); // Convertir a minúsculas

      // Crear columnas que faltan
      for (const [columnName, columnDefinition] of Object.entries(expectedColumns)) {
        if (!existingColumnNames.includes(columnName.toLowerCase())) {
          try {
            await db.none(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
            console.log(`Columna '${columnName}' añadida a la tabla '${tableName}'.`);
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(`Error añadiendo la columna '${columnName}' a la tabla '${tableName}':`, error.message);
            } else {
              console.error(`Error desconocido añadiendo la columna '${columnName}' a la tabla '${tableName}'.`);
            }
          }
        }
      }

      // Eliminar columnas que no están en el esquema esperado
      for (const { column_name } of existingColumns) {
        if (!Object.keys(expectedColumns).map(col => col.toLowerCase()).includes(column_name.toLowerCase())) {
          try {
            await db.none(`ALTER TABLE ${tableName} DROP COLUMN ${column_name}`);
            console.log(`Columna '${column_name}' eliminada de la tabla '${tableName}'.`);
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(`Error eliminando la columna '${column_name}' de la tabla '${tableName}':`, error.message);
            } else {
              console.error(`Error desconocido eliminando la columna '${column_name}' de la tabla '${tableName}'.`);
            }
          }
        }
      }
    };

    
    // Definiciones de columnas esperadas para la tabla `users`
    const usersColumns: Record<string, string> = {
      id: 'SERIAL PRIMARY KEY',
      role: 'VARCHAR(50)',
      username: 'VARCHAR(100) UNIQUE NOT NULL',
      name: 'VARCHAR(100)',
      firstName: 'VARCHAR(100)',
      lastName: 'VARCHAR(100)',
      dni: 'VARCHAR(20) UNIQUE NOT NULL',
      email: 'VARCHAR(100) UNIQUE NOT NULL',
      telephone: 'VARCHAR(20)',
      address: 'TEXT',
      cp: 'VARCHAR(10)',
      password: 'VARCHAR(255) NOT NULL',
      created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    };

    // Verificar y ajustar columnas para la tabla `users`
    await checkAndAlterTableColumns('users', usersColumns);

    // Definiciones de columnas esperadas para la tabla `tasks`
    const tasksColumns: Record<string, string> = {
      id: 'SERIAL PRIMARY KEY',
      title: 'VARCHAR(255) NOT NULL',
      description: 'TEXT NOT NULL',
      status: 'VARCHAR(50) NOT NULL',
      user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
      created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      completed_at: 'TIMESTAMP DEFAULT NULL',
    };

    // Verificar y ajustar columnas para la tabla `tasks`
    await checkAndAlterTableColumns('tasks', tasksColumns);

    // Definiciones de columnas esperadas para la tabla `notes`
    const notesColumns: Record<string, string> = {
      id: 'SERIAL PRIMARY KEY',
      user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
      title: 'VARCHAR(255) NOT NULL',
      description: 'TEXT NOT NULL',
      created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    };

    // Verificar y ajustar columnas para la tabla `notes`
    await checkAndAlterTableColumns('notes', notesColumns);

    //! ToDo: Verificar que se puedan actualizar columnas con los triggers
    

    // Crear función y trigger para actualizar el campo updated_at en users
    await db.none(`
      CREATE OR REPLACE FUNCTION update_users_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at_trigger'
        ) THEN
          CREATE TRIGGER update_users_updated_at_trigger
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_users_updated_at_column();
        END IF;
      END;
      $$;
    `);

    // Crear función y trigger para actualizar el campo updated_at en tasks
    await db.none(`
      CREATE OR REPLACE FUNCTION update_tasks_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_tasks_updated_at_trigger'
        ) THEN
          CREATE TRIGGER update_tasks_updated_at_trigger
          BEFORE UPDATE ON tasks
          FOR EACH ROW
          EXECUTE FUNCTION update_tasks_updated_at_column();
        END IF;
      END;
      $$;
    `);

    // Crear función y trigger para actualizar el campo updated_at en notes
    await db.none(`
      CREATE OR REPLACE FUNCTION update_notes_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_notes_updated_at_trigger'
        ) THEN
          CREATE TRIGGER update_notes_updated_at_trigger
          BEFORE UPDATE ON notes
          FOR EACH ROW
          EXECUTE FUNCTION update_notes_updated_at_column();
        END IF;
      END;
      $$;
    `);

    // Crear función y trigger para actualizar el campo updated_at en work_schedule
    await db.none(`
      CREATE OR REPLACE FUNCTION update_work_schedule_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_work_schedule_updated_at_trigger'
        ) THEN
          CREATE TRIGGER update_work_schedule_updated_at_trigger
          BEFORE UPDATE ON work_schedule
          FOR EACH ROW
          EXECUTE FUNCTION update_work_schedule_updated_at_column();
        END IF;
      END;
      $$;
    `);

    console.log('Tables and triggers checked/created successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating tables or triggers:', error.message);
    } else {
      console.error('Error desconocido al crear tablas o triggers.');
    }
    throw new Error('Failed to create tables or triggers');
  }
};

createTablesIfNotExists();

// Prueba de conexión (puedes mantener esto durante el desarrollo)
db.one('SELECT NOW()')
  .then((data) => {
    console.log('Database connection successful:', data);
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export { db };
