import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Activity from '../models/Activity.js';
import Lead from '../models/Lead.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Lead.deleteMany(), Task.deleteMany(), Activity.deleteMany()]);

  const users = await User.create([
    { name: 'Aarav Mehta', email: 'admin@smartcrm.dev', password: 'password123', role: 'Admin', avatar: 'AM' },
    { name: 'Nisha Rao', email: 'lead@smartcrm.dev', password: 'password123', role: 'Team Lead', avatar: 'NR' },
    { name: 'Kabir Shah', email: 'employee@smartcrm.dev', password: 'password123', role: 'Employee', avatar: 'KS' }
  ]);

  const [admin, teamLead, employee] = users;

  const leads = await Lead.create([
    {
      companyName: 'Prism Auto Components',
      contactPerson: 'Rohan Iyer',
      email: 'rohan@prismauto.in',
      phone: '+91 98765 10001',
      status: 'Won',
      priority: 'High',
      assignedTo: teamLead._id,
      budget: 140000,
      interestLevel: 9,
      notes: [{ text: 'Finalized annual supply agreement for CNC components.', createdBy: admin._id }],
      createdBy: admin._id
    },
    {
      companyName: 'Northline Fabricators',
      contactPerson: 'Meera Kapoor',
      email: 'meera@northline.co',
      phone: '+91 98765 10002',
      status: 'Negotiation',
      priority: 'High',
      assignedTo: employee._id,
      budget: 95000,
      interestLevel: 8,
      notes: [{ text: 'Procurement team requested revised delivery terms.', createdBy: teamLead._id }],
      createdBy: teamLead._id
    },
    {
      companyName: 'Kaveri Machinery Works',
      contactPerson: 'Dev Patel',
      email: 'dev@kaverimachinery.com',
      phone: '+91 98765 10003',
      status: 'Proposal Sent',
      priority: 'Medium',
      assignedTo: employee._id,
      budget: 52000,
      interestLevel: 6,
      createdBy: teamLead._id
    },
    {
      companyName: 'Atlas Packaging',
      contactPerson: 'Fatima Khan',
      email: 'fatima@atlaspackaging.in',
      phone: '+91 98765 10004',
      status: 'Contacted',
      priority: 'Medium',
      assignedTo: teamLead._id,
      budget: 28000,
      interestLevel: 5,
      createdBy: admin._id
    },
    {
      companyName: 'Veda Industrial Tools',
      contactPerson: 'Samar Jain',
      email: 'samar@vedatools.com',
      phone: '+91 98765 10005',
      status: 'New',
      priority: 'Low',
      assignedTo: employee._id,
      budget: 12000,
      interestLevel: 3,
      createdBy: admin._id
    },
    {
      companyName: 'Zenith Foundry',
      contactPerson: 'Ishita Bose',
      email: 'ishita@zenithfoundry.in',
      phone: '+91 98765 10006',
      status: 'Lost',
      priority: 'Low',
      assignedTo: teamLead._id,
      budget: 18000,
      interestLevel: 2,
      createdBy: teamLead._id
    }
  ]);

  await Task.create([
    {
      title: 'Send revised quotation',
      description: 'Update payment milestones and delivery dates.',
      assignedTo: employee._id,
      dueDate: new Date(Date.now() + 86400000 * 2),
      status: 'In Progress',
      relatedLead: leads[1]._id,
      createdBy: teamLead._id
    },
    {
      title: 'Schedule plant visit',
      description: 'Coordinate walkthrough for procurement stakeholders.',
      assignedTo: teamLead._id,
      dueDate: new Date(Date.now() + 86400000 * 4),
      status: 'Todo',
      relatedLead: leads[3]._id,
      createdBy: admin._id
    },
    {
      title: 'Collect signed PO',
      description: 'Get purchase order copy and upload to CRM.',
      assignedTo: teamLead._id,
      dueDate: new Date(Date.now() + 86400000),
      status: 'Completed',
      relatedLead: leads[0]._id,
      createdBy: admin._id
    }
  ]);

  await Activity.create([
    { user: admin._id, action: 'created lead', target: 'Prism Auto Components' },
    { user: teamLead._id, action: 'moved lead to Negotiation', target: 'Northline Fabricators' },
    { user: employee._id, action: 'updated task', target: 'Send revised quotation' },
    { user: admin._id, action: 'created task', target: 'Schedule plant visit' }
  ]);

  console.log('Seed complete. Login with admin@smartcrm.dev / password123');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
