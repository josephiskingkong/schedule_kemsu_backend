import { Router } from 'express';
import authRoutes from './auth';
import groupRoutes from './groups';
import studentRoutes from './students';
import lessonRoutes from './lessons';
import attendanceRoutes from './attendance';

const router = Router();

router.use('/auth', authRoutes);
router.use('/groups', groupRoutes);
router.use('/students', studentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
