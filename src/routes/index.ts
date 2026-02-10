import { Router } from 'express';
import authRoutes from './auth';
import groupRoutes from './groups';
import studentRoutes from './students';
import scheduleRoutes from './schedule';
import attendanceRoutes from './attendance';
import statisticsRoutes from './statistics';

const router = Router();

router.use('/auth', authRoutes);
router.use('/groups', groupRoutes);
router.use('/students', studentRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/statistics', statisticsRoutes);

export default router;
