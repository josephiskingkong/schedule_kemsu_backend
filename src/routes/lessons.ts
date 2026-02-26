import { Router } from 'express';
import { getLessons, getLessonById, createLesson, deleteLesson } from '../controllers/lessonController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getLessons);
router.get('/:id', auth, getLessonById);
router.post('/', auth, createLesson);
router.delete('/:id', auth, deleteLesson);

export default router;
