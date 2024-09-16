"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pgp = (0, pg_promise_1.default)();
const db = pgp(process.env.DATABASE_URL);
exports.db = db;
// Función para crear tablas si no existen
const createTablesIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Crear tabla users
        yield db.none(`
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
        yield db.none(`
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
        yield db.none(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Crear función y trigger para actualizar el campo updated_at en users
        yield db.none(`
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
        yield db.none(`
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
        yield db.none(`
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
        console.log('Tables and triggers checked/created successfully');
    }
    catch (error) {
        console.error('Error creating tables or triggers:', error);
        throw new Error('Failed to create tables or triggers');
    }
});
createTablesIfNotExists();
// Prueba de conexión (puedes mantener esto durante el desarrollo)
db.one('SELECT NOW()')
    .then((data) => {
    console.log('Database connection successful:', data);
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
