import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

// Función para crear tablas si no existen
const createTablesIfNotExists = async () => {
  try {
    // Crear tabla users
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        role VARCHAR(50),
        username VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100),
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        dni VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telephone VARCHAR(20),
        address TEXT,
        cp VARCHAR(10),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla tasks
    await db.none(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla notes
    await db.none(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear función y triggers para actualizar el campo updated_at en users
    await db.none(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'update_users_updated_at_trigger'
        ) THEN
          CREATE OR REPLACE FUNCTION update_users_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ language 'plpgsql';

          CREATE TRIGGER update_users_updated_at_trigger
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE PROCEDURE update_users_updated_at_column();
        END IF;
      END;
      $$;
    `);

    // Crear función y triggers para actualizar el campo updated_at en tasks
    await db.none(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'update_tasks_updated_at_trigger'
        ) THEN
          CREATE OR REPLACE FUNCTION update_tasks_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ language 'plpgsql';

          CREATE TRIGGER update_tasks_updated_at_trigger
          BEFORE UPDATE ON tasks
          FOR EACH ROW
          EXECUTE PROCEDURE update_tasks_updated_at_column();
        END IF;
      END;
      $$;
    `);

    // Crear función y triggers para actualizar el campo updated_at en notes
    await db.none(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'update_notes_updated_at_trigger'
        ) THEN
          CREATE OR REPLACE FUNCTION update_notes_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ language 'plpgsql';

          CREATE TRIGGER update_notes_updated_at_trigger
          BEFORE UPDATE ON notes
          FOR EACH ROW
          EXECUTE PROCEDURE update_notes_updated_at_column();
        END IF;
      END;
      $$;
    `);

    console.log('Tables and triggers checked/created successfully');
  } catch (error) {
    console.error('Error creating tables or triggers:', error);
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
