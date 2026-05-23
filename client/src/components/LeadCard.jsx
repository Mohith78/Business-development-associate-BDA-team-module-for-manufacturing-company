import { FiDollarSign, FiUser } from 'react-icons/fi';
import Badge from './ui/Badge';
import { formatCurrency, priorityColor, scoreColor, statusColor } from '../utils/constants';

const scoreReason = {
  Hot: 'High budget and strong buying interest',
  Warm: 'Qualified interest with moderate budget',
  Cold: 'Needs more discovery and engagement'
};

export default function LeadCard({ lead, onClick }) {
  return (
    <button
      onClick={() => onClick?.(lead)}
      className="w-full rounded-lg border border-white/10 bg-white/5 p-4 text-left shadow-xl shadow-slate-950/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/10 hover:shadow-cyan-950/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200 ring-1 ring-cyan-300/20">
            <FiUser className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">{lead.companyName}</h3>
            <p className="mt-1 truncate text-xs text-slate-400">{lead.contactPerson} - {lead.email}</p>
          </div>
        </div>
        <Badge className={scoreColor[lead.leadScore?.label] || scoreColor.Cold}>{lead.leadScore?.label || 'Cold'}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className={statusColor[lead.status]}>{lead.status}</Badge>
        <Badge className={priorityColor[lead.priority]}>{lead.priority}</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{lead.assignedTo?.name || 'Unassigned'}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
          <FiDollarSign /> {formatCurrency(lead.budget)}
        </span>
      </div>
      <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2">
        <p className="text-xs font-semibold text-slate-300">AI score: {lead.leadScore?.score || 0}/100</p>
        <p className="mt-1 text-xs text-slate-500">{scoreReason[lead.leadScore?.label] || scoreReason.Cold}</p>
      </div>
    </button>
  );
}
