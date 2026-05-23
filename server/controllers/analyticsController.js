import Activity from '../models/Activity.js';
import Lead from '../models/Lead.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const monthLabel = (date) => date.toLocaleString('en-US', { month: 'short' });

export const getDashboard = asyncHandler(async (req, res) => {
  const [leads, tasks, users, activities] = await Promise.all([
    Lead.find().populate('assignedTo', 'name role avatar'),
    Task.find().populate('assignedTo', 'name role avatar'),
    User.find().select('name role avatar'),
    Activity.find().populate('user', 'name role avatar').sort({ createdAt: -1 }).limit(12)
  ]);

  const wonLeads = leads.filter((lead) => lead.status === 'Won');
  const totalLeads = leads.length;
  const revenue = wonLeads.reduce((sum, lead) => sum + (lead.budget || 0), 0);
  const conversionRate = totalLeads ? Math.round((wonLeads.length / totalLeads) * 100) : 0;
  const pendingTasks = tasks.filter((task) => task.status !== 'Completed').length;

  const statusDistribution = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].map((status) => ({
    name: status,
    value: leads.filter((lead) => lead.status === status).length
  }));

  const monthlyConversions = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return { month: monthLabel(date), conversions: 0, revenue: 0 };
  });

  wonLeads.forEach((lead) => {
    const bucket = monthlyConversions.find((item) => item.month === monthLabel(new Date(lead.updatedAt)));
    if (bucket) {
      bucket.conversions += 1;
      bucket.revenue += lead.budget || 0;
    }
  });

  const teamPerformance = users.map((user) => {
    const owned = leads.filter((lead) => String(lead.assignedTo?._id) === String(user._id));
    const won = owned.filter((lead) => lead.status === 'Won');
    return {
      name: user.name,
      role: user.role,
      leads: owned.length,
      won: won.length,
      revenue: won.reduce((sum, lead) => sum + (lead.budget || 0), 0)
    };
  });

  res.json({
    metrics: { totalLeads, revenue, conversionRate, pendingTasks },
    statusDistribution,
    monthlyConversions,
    teamPerformance,
    recentActivity: activities
  });
});

export const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find().populate('user', 'name role avatar').sort({ createdAt: -1 }).limit(50);
  res.json(activities);
});
