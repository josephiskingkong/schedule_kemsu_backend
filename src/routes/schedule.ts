import { Router } from 'express';
import { getSchedule, getDisciplines, getDisciplinePlanSessions } from '../controllers/scheduleController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getSchedule);
router.get('/disciplines', auth, getDisciplines);
router.get('/discipline-plan/:disciplinePlanId/sessions', auth, getDisciplinePlanSessions);

export default router;
