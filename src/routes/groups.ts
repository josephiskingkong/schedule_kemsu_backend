import { Router } from 'express';
import { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } from '../controllers/groupController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getGroups);
router.get('/:id', auth, getGroupById);
router.post('/', auth, createGroup);
router.put('/:id', auth, updateGroup);
router.delete('/:id', auth, deleteGroup);

export default router;
