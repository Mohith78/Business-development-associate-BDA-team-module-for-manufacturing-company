import Task from '../models/Task.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createActivity } from '../services/activityService.js';

const taskPopulate = [
  { path: 'assignedTo', select: 'name email role avatar' },
  { path: 'relatedLead', select: 'companyName status priority leadScore' },
  { path: 'createdBy', select: 'name email role avatar' },
  { path: 'comments.user', select: 'name email role avatar' }
];

export const getTasks = asyncHandler(async (req, res) => {
  const { status, assignedTo } = req.query;
  const query = {};
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;

  const tasks = await Task.find(query).populate(taskPopulate).sort({ dueDate: 1 });
  res.json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  await createActivity({ user: req.user._id, action: 'created task', target: task.title });
  const populated = await Task.findById(task._id).populate(taskPopulate);
  res.status(201).json(populated);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(taskPopulate);
  if (!task) throw new AppError('Task not found', 404);
  await createActivity({ user: req.user._id, action: 'updated task', target: task.title });
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new AppError('Task not found', 404);
  await createActivity({ user: req.user._id, action: 'deleted task', target: task.title });
  res.json({ message: 'Task deleted' });
});

export const addTaskComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError('Task not found', 404);
  if (!req.body.text) throw new AppError('Comment text is required', 400);

  task.comments.push({ text: req.body.text, user: req.user._id });
  await task.save();
  await createActivity({ user: req.user._id, action: 'commented on task', target: task.title });

  const populated = await Task.findById(task._id).populate(taskPopulate);
  res.status(201).json(populated);
});
