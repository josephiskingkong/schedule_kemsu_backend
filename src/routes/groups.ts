import { Router } from 'express';
import { getGroups, getWorkGroupsByBaseGroup } from '../controllers/groupController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getGroups);
router.get('/:baseGroupId/work-groups', auth, getWorkGroupsByBaseGroup);

export default router;
