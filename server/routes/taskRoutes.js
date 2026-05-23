import express from 'express';
import { addTaskComment, createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getTasks).post(authorize('Admin', 'Team Lead'), createTask);
router.route('/:id').put(updateTask).delete(authorize('Admin', 'Team Lead'), deleteTask);
router.post('/:id/comments', addTaskComment);

export default router;
