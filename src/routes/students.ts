import { Router } from 'express';
import { getStudentsByGroup, addStudent, updateStudent, deleteStudent } from '../controllers/studentController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/group/:groupId', auth, getStudentsByGroup);
router.post('/', auth, addStudent);
router.put('/:id', auth, updateStudent);
router.delete('/:id', auth, deleteStudent);

export default router;
