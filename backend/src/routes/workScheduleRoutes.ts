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
import { validateRequest } from '../middlewares/validateRequest';
import {
  createWorkScheduleSchema,
  updateWorkScheduleSchema,
  workScheduleIdSchema,
} from '../validators/validationSchemas';

const router = Router();

router.get('/', authenticateToken, authorizeRole('work_schedules', 'read'), getAllWorkSchedules);
router.get('/:id', authenticateToken, validateRequest(workScheduleIdSchema, 'params'), authorizeRole('work_schedules', 'read'), getWorkScheduleById);
router.post('/', authenticateToken, authorizeRole('work_schedules', 'create'),  validateRequest(createWorkScheduleSchema, 'body'), createWorkSchedule);
router.put('/:id', authenticateToken, authorizeRole('work_schedules', 'update'), validateRequest(workScheduleIdSchema, 'params'), validateRequest(updateWorkScheduleSchema, 'body'), updateWorkSchedule);
router.delete('/:id', authenticateToken, authorizeRole('work_schedules', 'delete'),  validateRequest(workScheduleIdSchema, 'params'), deleteWorkSchedule);

export default router;
