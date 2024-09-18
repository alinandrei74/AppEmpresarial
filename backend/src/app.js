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
const workScheduleRoutes_1 = __importDefault(require("./routes/workScheduleRoutes")); // Asegúrate de importar las rutas de work schedule
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
app.use('/api/work-schedules', workScheduleRoutes_1.default); // Añade las rutas de horarios de trabajo
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
// Programar tarea cron para eliminar horarios de trabajo antiguos cada 5 meses
node_cron_1.default.schedule('0 0 1 */5 *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Ejecutando tarea cron para eliminar horarios de trabajo antiguos...'); // Log para confirmar la ejecución
    try {
        // Eliminar horarios de trabajo que se crearon hace más de 5 meses
        const result = yield db_1.db.result(`DELETE FROM work_schedule WHERE created_at < NOW() - INTERVAL '5 months'`);
        if (result.rowCount > 0) {
            console.log(`Eliminados ${result.rowCount} horarios de trabajo antiguos.`);
        }
        else {
            console.log('No se encontraron horarios de trabajo para eliminar.');
        }
    }
    catch (error) {
        console.error('Error eliminando horarios de trabajo antiguos:', error);
    }
}));
