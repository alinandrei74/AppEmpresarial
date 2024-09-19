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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("./config/db");
dotenv_1.default.config(); //! Asegúrate de cargar las variables de entorno al principio
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/notes', noteRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
// Programar tarea cron para eliminar tareas completadas cada hora
node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Ejecutando tarea cron de eliminación de tareas completadas cada hora...'); // Log para confirmar la ejecución
    try {
        // Eliminar tareas donde `status` es "done" y `completed_at` es más de 24 horas atrás
        const result = yield db_1.db.result(`DELETE FROM tasks WHERE status = 'done' AND completed_at IS NOT NULL AND completed_at < NOW() - INTERVAL '24 HOURS'`);
        if (result.rowCount > 0) {
            console.log(`Eliminadas ${result.rowCount} tareas completadas hace más de 24 horas.`);
        }
        else {
            console.log('No se encontraron tareas para eliminar.');
        }
    }
    catch (error) {
        console.error('Error eliminando tareas completadas:', error);
    }
}));
