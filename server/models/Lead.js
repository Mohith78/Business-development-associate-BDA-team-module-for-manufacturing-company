import mongoose from 'mongoose';
import { getLeadScore } from '../utils/leadScore.js';

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
      default: 'New'
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    budget: { type: Number, default: 0, min: 0 },
    interestLevel: { type: Number, default: 5, min: 1, max: 10 },
    leadScore: {
      score: { type: Number, default: 0 },
      label: { type: String, enum: ['Hot', 'Warm', 'Cold'], default: 'Cold' }
    },
    notes: [noteSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

leadSchema.pre('save', function calculateLeadScore(next) {
  this.leadScore = getLeadScore(this.budget, this.interestLevel);
  next();
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
