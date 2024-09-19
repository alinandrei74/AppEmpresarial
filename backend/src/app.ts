import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import noteRoutes from './routes/noteRoutes';
import workScheduleRoutes from './routes/workScheduleRoutes'; // Asegúrate de importar las rutas de work schedule
import dotenv from 'dotenv';
import cron from 'node-cron';
import { db } from './config/db';

dotenv.config(); //! Asegúrate de cargar las variables de entorno al principio

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/work-schedules', workScheduleRoutes); // Añade las rutas de horarios de trabajo

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

// Programar tarea cron para eliminar tareas completadas cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Ejecutando tarea cron para eliminar tareas completadas...'); // Log para confirmar la ejecución

  try {
    // Eliminar tareas completadas hace más de 24 horas
    const result = await db.result(
      `DELETE FROM tasks WHERE status = 'done' AND completed_at IS NOT NULL AND completed_at < NOW() - INTERVAL '24 HOURS'`
    );

    if (result.rowCount > 0) {
      console.log(`Eliminadas ${result.rowCount} tareas completadas hace más de 24 horas.`);
    } else {
      console.log('No se encontraron tareas para eliminar.');
    }
  } catch (error) {
    console.error('Error eliminando tareas completadas:', error);
  }
});

// Programar tarea cron para eliminar horarios de trabajo antiguos cada 5 meses
cron.schedule('0 0 1 */5 *', async () => {
  console.log('Ejecutando tarea cron para eliminar horarios de trabajo antiguos...'); // Log para confirmar la ejecución

  try {
    // Eliminar horarios de trabajo creados hace más de 5 meses
    const result = await db.result(
      `DELETE FROM work_schedule WHERE created_at < NOW() - INTERVAL '5 months'`
    );

    if (result.rowCount > 0) {
      console.log(`Eliminados ${result.rowCount} horarios de trabajo antiguos.`);
    } else {
      console.log('No se encontraron horarios de trabajo para eliminar.');
    }
  } catch (error) {
    console.error('Error eliminando horarios de trabajo antiguos:', error);
  }
});