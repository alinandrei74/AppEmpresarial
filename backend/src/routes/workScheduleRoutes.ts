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

router.get('/', authenticateToken, authorizeRole('work_schedules', 'read'), getAllWorkSchedules);
router.get('/:id', authenticateToken, authorizeRole('work_schedules', 'read'), getWorkScheduleById);
router.post('/', authenticateToken, authorizeRole('work_schedules', 'create'), createWorkSchedule);
router.put('/:id', authenticateToken, authorizeRole('work_schedules', 'update'), updateWorkSchedule);
router.delete('/:id', authenticateToken, authorizeRole('work_schedules', 'delete'), deleteWorkSchedule);

export default router;
