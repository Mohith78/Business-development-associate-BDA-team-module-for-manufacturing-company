export const leadStatuses = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
export const priorities = ['Low', 'Medium', 'High'];
export const taskStatuses = ['Todo', 'In Progress', 'Completed'];

export const roleOptions = ['Admin', 'Team Lead', 'Employee'];

export const statusColor = {
  New: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  Contacted: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-200',
  'Proposal Sent': 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  Negotiation: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  Won: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Lost: 'border-rose-400/30 bg-rose-400/10 text-rose-200'
};

export const priorityColor = {
  Low: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
  Medium: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  High: 'border-rose-400/30 bg-rose-400/10 text-rose-200'
};

export const scoreColor = {
  Hot: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  Warm: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  Cold: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200'
};

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const formatDate = (date) =>
  date ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date)) : 'No date';
