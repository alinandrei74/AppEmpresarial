"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./schema");
const logger_1 = __importDefault(require("../utils/logger"));
dotenv_1.default.config();
const pgp = (0, pg_promise_1.default)();
const db = pgp(process.env.DATABASE_URL);
exports.db = db;
/**
 * Prueba de conexión a la base de datos y asegura el esquema.
 */
(async () => {
    try {
        const data = await db.one('SELECT NOW()');
        logger_1.default.success('Conexión a la base de datos exitosa:', data);
        await (0, schema_1.ensureDatabaseSchema)();
        logger_1.default.finalSuccess('Esquema de la base de datos asegurado exitosamente.');
    }
    catch (error) {
        logger_1.default.finalError('Error durante la conexión a la base de datos o la configuración del esquema:', error);
    }
})();
