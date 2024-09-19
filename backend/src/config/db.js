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
/**
 * Verifica y ajusta columnas de una tabla para que coincidan con las definiciones esperadas.
 * @param {string} tableName - El nombre de la tabla.
 * @param {Record<string, string>} expectedColumns - Las definiciones de columnas esperadas.
 */
const checkAndAlterTableColumns = (tableName, expectedColumns) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtener las columnas existentes de la tabla
    const existingColumns = yield db.any(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
      `, [tableName]);
    const existingColumnNames = existingColumns.map(col => col.column_name.toLowerCase());
    // Crear columnas que faltan
    for (const [columnName, columnDefinition] of Object.entries(expectedColumns)) {
        if (!existingColumnNames.includes(columnName.toLowerCase())) {
            try {
                yield db.none(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
                console.log(`Columna '${columnName}' añadida a la tabla '${tableName}'.`);
            }
            catch (error) {
                console.error(`Error añadiendo la columna '${columnName}' a la tabla '${tableName}':`, error);
            }
        }
    }
    // Eliminar columnas que no están en el esquema esperado
    for (const { column_name } of existingColumns) {
        if (!Object.keys(expectedColumns).map(col => col.toLowerCase()).includes(column_name.toLowerCase())) {
            try {
                yield db.none(`ALTER TABLE ${tableName} DROP COLUMN ${column_name}`);
                console.log(`Columna '${column_name}' eliminada de la tabla '${tableName}'.`);
            }
            catch (error) {
                console.error(`Error eliminando la columna '${column_name}' de la tabla '${tableName}':`, error);
            }
        }
    }
});
// Función para crear tablas si no existen
const ensureDatabaseSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Crear tabla `users` si no existe
        const createUsersTable = `
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
    `;
        yield db.none(createUsersTable);
        console.log('Tabla `users` creada o ya existe.');
        // Definiciones de columnas esperadas para la tabla `users`
        const usersColumns = {
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
        yield checkAndAlterTableColumns('users', usersColumns);
        // Crear tabla `work_schedule` si no existe
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
        yield db.none(createWorkScheduleTable);
        console.log('Tabla `work_schedule` creada o ya existe.');
        // Definiciones de columnas esperadas para la tabla `work_schedule`
        const workScheduleColumns = {
            id: 'SERIAL PRIMARY KEY',
            user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
            start_time: 'TIMESTAMP NOT NULL',
            end_time: 'TIMESTAMP NOT NULL',
            description: 'TEXT NOT NULL',
            day_of_week: 'VARCHAR(15) NOT NULL',
            created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        };
        yield checkAndAlterTableColumns('work_schedule', workScheduleColumns);
        // Crear tabla `tasks` si no existe
        const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP DEFAULT NULL
      );
    `;
        yield db.none(createTasksTable);
        console.log('Tabla `tasks` creada o ya existe.');
        // Definiciones de columnas esperadas para la tabla `tasks`
        const tasksColumns = {
            id: 'SERIAL PRIMARY KEY',
            title: 'VARCHAR(255) NOT NULL',
            description: 'TEXT NOT NULL',
            status: 'VARCHAR(50) NOT NULL',
            user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
            created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            completed_at: 'TIMESTAMP DEFAULT NULL',
        };
        yield checkAndAlterTableColumns('tasks', tasksColumns);
        // Crear tabla `notes` si no existe
        const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        yield db.none(createNotesTable);
        console.log('Tabla `notes` creada o ya existe.');
        // Definiciones de columnas esperadas para la tabla `notes`
        const notesColumns = {
            id: 'SERIAL PRIMARY KEY',
            user_id: 'INT REFERENCES users(id) ON DELETE CASCADE',
            title: 'VARCHAR(255) NOT NULL',
            description: 'TEXT NOT NULL',
            created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        };
        yield checkAndAlterTableColumns('notes', notesColumns);
        // Función y trigger para actualizar el campo updated_at en `users`
        const createUpdatedAtTrigger = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
            yield db.none(`
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
        });
        yield createUpdatedAtTrigger('users');
        yield createUpdatedAtTrigger('tasks');
        yield createUpdatedAtTrigger('notes');
        yield createUpdatedAtTrigger('work_schedule');
        console.log('Tablas y triggers verificados/creados con éxito');
    }
    catch (error) {
        console.error('Error creando tablas o triggers:', error);
        throw new Error('Failed to create tables or triggers');
    }
});
ensureDatabaseSchema();
// Prueba de conexión (puedes mantener esto durante el desarrollo)
db.one('SELECT NOW()')
    .then((data) => {
    console.log('Database connection successful:', data);
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
