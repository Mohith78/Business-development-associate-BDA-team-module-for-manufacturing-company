import express from 'express';
import { addLeadNote, createLead, deleteLead, getLead, getLeads, updateLead } from '../controllers/leadController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getLeads).post(authorize('Admin', 'Team Lead'), createLead);
router.route('/:id').get(getLead).put(updateLead).delete(authorize('Admin', 'Team Lead'), deleteLead);
router.post('/:id/notes', addLeadNote);

export default router;
