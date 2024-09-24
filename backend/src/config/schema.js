"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDatabaseSchema = void 0;
const db_1 = require("./db");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Asegura que las tablas, columnas y triggers necesarios existen en la base de datos.
 */
const ensureDatabaseSchema = async () => {
    try {
        logger_1.default.information('Iniciando verificación y aseguramiento del esquema de la base de datos.');
        //; Definiciones de las tablas y columnas esperadas
        const tables = [
            {
                name: 'users',
                createQuery: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            role VARCHAR(50),
            username VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100),
            firstname VARCHAR(100),
            lastname VARCHAR(100),
            dni VARCHAR(16) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            telephone VARCHAR(20),
            address VARCHAR,
            postal_code VARCHAR(10),
            password VARCHAR(100) NOT NULL,
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
                    address: 'VARCHAR',
                    postal_code: 'VARCHAR(10)',
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
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            is_done BOOLEAN NOT NULL DEFAULT FALSE,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP DEFAULT NULL
          );
        `,
                columns: {
                    id: 'SERIAL PRIMARY KEY',
                    title: 'TEXT NOT NULL',
                    description: 'TEXT NOT NULL',
                    is_done: 'BOOLEAN NOT NULL DEFAULT FALSE',
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
        logger_1.default.finalSuccess('Tablas, columnas y triggers verificados/creados exitosamente.');
    }
    catch (error) {
        logger_1.default.finalError('Error en el proceso de creación/verificación del esquema de la base de datos:', error);
        throw new Error('Fallo al asegurar el esquema de la base de datos.');
    }
};
exports.ensureDatabaseSchema = ensureDatabaseSchema;
/**
 * Crea una tabla si no existe. Si falla, la elimina y la vuelve a crear.
 * @param tableName - El nombre de la tabla.
 * @param createTableQuery - La consulta SQL para crear la tabla.
 */
const createTableIfNotExists = async (tableName, createTableQuery) => {
    try {
        await db_1.db.none(createTableQuery);
        logger_1.default.success(`Tabla {'${tableName}'} creada o ya existente.`);
    }
    catch (error) {
        logger_1.default.error(`Error creando la tabla {'${tableName}'}:`, error);
        await dropTableAndRetry(tableName, createTableQuery);
    }
};
/**
 * Elimina una tabla y la vuelve a crear en caso de error.
 * @param tableName - El nombre de la tabla.
 * @param createTableQuery - La consulta SQL para crear la tabla.
 */
const dropTableAndRetry = async (tableName, createTableQuery) => {
    try {
        logger_1.default.warning(`Eliminando la tabla '${tableName}' debido a un error previo...`);
        await db_1.db.none(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
        logger_1.default.success(`Tabla '${tableName}' eliminada. Intentando recrear...`);
        await db_1.db.none(createTableQuery);
        logger_1.default.success(`Tabla '${tableName}' recreada exitosamente.`);
    }
    catch (error) {
        logger_1.default.error(`Error al eliminar o recrear la tabla '${tableName}':`, error);
        throw new Error(`Fallo al recrear la tabla '${tableName}'.`);
    }
};
/**
 * Verifica y ajusta columnas de una tabla para que coincidan con las definiciones esperadas.
 * @param tableName - El nombre de la tabla.
 * @param expectedColumns - Las definiciones de columnas esperadas.
 */
const checkAndAlterTableColumns = async (tableName, expectedColumns) => {
    try {
        logger_1.default.information(`Verificando columnas de la tabla {'${tableName}'}.`);
        const existingColumns = await db_1.db.any(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [tableName]);
        const existingColumnNames = existingColumns.map((col) => col.column_name.toLowerCase());
        //; Crear columnas que faltan
        for (const [columnName, columnDefinition] of Object.entries(expectedColumns)) {
            if (!existingColumnNames.includes(columnName.toLowerCase())) {
                await db_1.db.none(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
                logger_1.default.success(`Columna '{${columnName}'} añadida a la tabla {'${tableName}'}.`);
            }
        }
        //; Eliminar columnas sobrantes
        await removeExtraColumns(tableName, existingColumnNames, Object.keys(expectedColumns));
    }
    catch (error) {
        logger_1.default.error(`Error verificando/ajustando columnas de la tabla {'${tableName}'}:`, error);
        throw new Error(`Fallo al verificar/ajustar columnas en la tabla {'${tableName}'}.`);
    }
};
/**
 * Elimina las columnas de la tabla que no están declaradas en el esquema esperado.
 * @param tableName - El nombre de la tabla.
 * @param existingColumns - Columnas actuales en la tabla.
 * @param expectedColumns - Columnas esperadas en la tabla.
 */
const removeExtraColumns = async (tableName, existingColumns, expectedColumns) => {
    for (const columnName of existingColumns) {
        if (!expectedColumns.map((col) => col.toLowerCase()).includes(columnName.toLowerCase())) {
            try {
                await db_1.db.none(`ALTER TABLE ${tableName} DROP COLUMN ${columnName} CASCADE`);
                logger_1.default.warning(`Columna {'${columnName}'} eliminada de la tabla {'${tableName}'}.`);
            }
            catch (error) {
                logger_1.default.error(`Error eliminando la columna {'${columnName}'} de la tabla {'${tableName}'}:`, error);
            }
        }
    }
};
/**
 * Crea funciones y triggers para actualizar el campo `updated_at`.
 * @param tableName - El nombre de la tabla.
 */
const createUpdatedAtTrigger = async (tableName) => {
    try {
        await db_1.db.none(`
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
        logger_1.default.success(`Trigger 'update_{${tableName}}_updated_at_trigger' creado/verificado para la tabla '${tableName}'.`);
    }
    catch (error) {
        logger_1.default.error(`Error creando/verificando el trigger para la tabla {'${tableName}'}:`, error);
        throw new Error(`Fallo al crear/verificar el trigger para la tabla '${tableName}'.`);
    }
};
