import Lead from '../models/Lead.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getLeadScore } from '../utils/leadScore.js';
import { createActivity } from '../services/activityService.js';

const leadPopulate = [
  { path: 'assignedTo', select: 'name email role avatar' },
  { path: 'createdBy', select: 'name email role avatar' },
  { path: 'notes.createdBy', select: 'name email role avatar' }
];

export const getLeads = asyncHandler(async (req, res) => {
  const { search, status, priority, assignedTo, sort = '-createdAt' } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const leads = await Lead.find(query).populate(leadPopulate).sort(sort);
  res.json(leads);
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate(leadPopulate);
  if (!lead) throw new AppError('Lead not found', 404);
  res.json(lead);
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, createdBy: req.user._id });
  await createActivity({ user: req.user._id, action: 'created lead', target: lead.companyName });
  const populated = await Lead.findById(lead._id).populate(leadPopulate);
  res.status(201).json(populated);
});

export const updateLead = asyncHandler(async (req, res) => {
  const before = await Lead.findById(req.params.id);
  if (!before) throw new AppError('Lead not found', 404);

  const update = { ...req.body };
  if (update.budget !== undefined || update.interestLevel !== undefined) {
    update.leadScore = getLeadScore(update.budget ?? before.budget, update.interestLevel ?? before.interestLevel);
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).populate(leadPopulate);
  const action = req.body.status && req.body.status !== before.status ? `moved lead to ${req.body.status}` : 'updated lead';
  await createActivity({ user: req.user._id, action, target: lead.companyName });
  res.json(lead);
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new AppError('Lead not found', 404);
  await createActivity({ user: req.user._id, action: 'deleted lead', target: lead.companyName });
  res.json({ message: 'Lead deleted' });
});

export const addLeadNote = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new AppError('Lead not found', 404);
  if (!req.body.text) throw new AppError('Note text is required', 400);

  lead.notes.push({ text: req.body.text, createdBy: req.user._id });
  await lead.save();
  await createActivity({ user: req.user._id, action: 'added note to lead', target: lead.companyName });

  const populated = await Lead.findById(lead._id).populate(leadPopulate);
  res.status(201).json(populated);
});
