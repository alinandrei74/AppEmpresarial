import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import noteRoutes from './routes/noteRoutes';
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

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

// Programar tarea cron para eliminar tareas completadas cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Ejecutando tarea cron de eliminación de tareas completadas cada hora...'); // Log para confirmar la ejecución

  try {
    // Eliminar tareas donde `status` es "done" y `completed_at` es más de 24 horas atrás
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
