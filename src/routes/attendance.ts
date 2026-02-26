import { Router } from 'express';
import { updateAttendance, getStatuses } from '../controllers/attendanceController';
import { auth } from '../middleware/auth';

const router = Router();

router.put('/:id', auth, updateAttendance);
router.get('/statuses', auth, getStatuses);

export default router;
