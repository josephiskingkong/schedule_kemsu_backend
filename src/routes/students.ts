import { Router } from 'express';
import { getStudentsByWorkGroup, getStudentsByBaseGroup } from '../controllers/studentController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/work-group/:workGroupId', auth, getStudentsByWorkGroup);
router.get('/base-group/:baseGroupId', auth, getStudentsByBaseGroup);

export default router;
