"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// db.ts
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./schema"); // Ajusta la ruta según tu estructura
dotenv_1.default.config();
const pgp = (0, pg_promise_1.default)();
const db = pgp(process.env.DATABASE_URL);
exports.db = db;
// Prueba de conexión a la base de datos
db.one('SELECT NOW()')
    .then((data) => {
    console.log('Database connection successful:', data);
    // Una vez conectados, asegurar que el esquema de la base de datos esté correcto
    return (0, schema_1.ensureDatabaseSchema)();
})
    .then(() => {
    console.log('Database schema ensured successfully.');
})
    .catch((error) => {
    console.error('Error during database connection or schema setup:', error);
});
