import { Router } from 'express';
import {
  createSession,
  getSessionAttendance,
  markAttendance,
  getStatuses,
  getClassrooms
} from '../controllers/attendanceController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/sessions', auth, createSession);
router.get('/sessions/:sessionId', auth, getSessionAttendance);
router.post('/sessions/:sessionId/mark', auth, markAttendance);
router.get('/statuses', auth, getStatuses);
router.get('/classrooms', auth, getClassrooms);

export default router;
