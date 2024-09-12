"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL); // Verifica si la variable de entorno está cargada
const pgp = (0, pg_promise_1.default)();
const db = pgp(process.env.DATABASE_URL);
exports.db = db;
// Prueba de conexión
db.one('SELECT NOW()')
    .then((data) => {
    console.log('Database connection successful:', data);
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
