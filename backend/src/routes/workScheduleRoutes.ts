import { Router } from 'express';
import {
  getAllWorkSchedules,
  getWorkScheduleById,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule
} from '../controllers/workScheduleController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getAllWorkSchedules);
router.get('/:id', authenticateToken, getWorkScheduleById);
router.post('/', authenticateToken, authorizeRole('schedules', 'create'), createWorkSchedule);
router.put('/:id', authenticateToken, authorizeRole('schedules', 'update'), updateWorkSchedule);
router.delete('/:id', authenticateToken, authorizeRole('schedules', 'delete'), deleteWorkSchedule);

export default router;
