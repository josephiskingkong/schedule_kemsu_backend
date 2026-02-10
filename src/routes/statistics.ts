import { Router } from 'express';
import { getStatsByDisciplinePlan, getStudentStats, getSummary } from '../controllers/statisticsController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/summary', auth, getSummary);
router.get('/discipline-plan/:disciplinePlanId', auth, getStatsByDisciplinePlan);
router.get('/student/:studentId', auth, getStudentStats);

export default router;
