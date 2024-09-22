"use strict";
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
const workScheduleRoutes_1 = __importDefault(require("./routes/workScheduleRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("./config/db");
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config(); //; Carga las variables de entorno al principio
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//; Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//; Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/notes', noteRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/work-schedules', workScheduleRoutes_1.default); //; Añade las rutas de horarios de trabajo
//; Inicia el servidor
app.listen(PORT, () => {
    logger_1.default.finalSuccess(`Servidor iniciado en {http://localhost:${PORT}}`);
});
//; Programar tarea cron para eliminar tareas completadas cada hora
node_cron_1.default.schedule('0 * * * *', async () => {
    logger_1.default.information('Ejecutando tarea cron: {Eliminando tareas completadas hace más de 24 horas.}');
    try {
        //; Eliminar tareas completadas hace más de 24 horas
        const result = await db_1.db.result(`DELETE FROM tasks WHERE status = 'done' AND completed_at IS NOT NULL AND completed_at < NOW() - INTERVAL '24 HOURS'`);
        if (result.rowCount > 0) {
            logger_1.default.success(`Eliminadas {${result.rowCount}} tareas completadas hace más de 24 horas.`);
        }
        else {
            logger_1.default.information('No se encontraron tareas para eliminar.');
        }
    }
    catch (error) {
        logger_1.default.finalError('Error eliminando tareas completadas:', error);
    }
});
//; Programar tarea cron para eliminar horarios de trabajo antiguos cada 5 meses
node_cron_1.default.schedule('0 0 1 */5 *', async () => {
    logger_1.default.information('Ejecutando tarea cron: {Eliminando horarios de trabajo antiguos.}');
    try {
        //; Eliminar horarios de trabajo creados hace más de 5 meses
        const result = await db_1.db.result(`DELETE FROM work_schedule WHERE created_at < NOW() - INTERVAL '5 months'`);
        if (result.rowCount > 0) {
            logger_1.default.success(`Eliminados {${result.rowCount}} horarios de trabajo antiguos.`);
        }
        else {
            logger_1.default.information('No se encontraron horarios de trabajo para eliminar.');
        }
    }
    catch (error) {
        logger_1.default.finalError('Error eliminando horarios de trabajo antiguos:', error);
    }
});
//; Programar tarea cron para eliminar notas cada 24 horas
node_cron_1.default.schedule('0 0 * * *', async () => {
    logger_1.default.information('Ejecutando tarea cron: {Eliminando notas antiguas.}');
    try {
        //; Eliminar notas creadas hace más de 24 horas
        const result = await db_1.db.result(`DELETE FROM notes WHERE created_at < NOW() - INTERVAL '24 HOURS'`);
        if (result.rowCount > 0) {
            logger_1.default.success(`Eliminadas {${result.rowCount}} notas creadas hace más de 24 horas.`);
        }
        else {
            logger_1.default.information('No se encontraron notas para eliminar.');
        }
    }
    catch (error) {
        logger_1.default.finalError('Error eliminando notas antiguas:', error);
    }
});
