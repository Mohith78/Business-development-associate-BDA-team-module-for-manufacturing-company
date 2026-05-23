import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload, FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import LeadFormModal from '../components/LeadFormModal';
import { leadApi, userApi } from '../services/api';
import { formatCurrency, priorities, priorityColor, scoreColor, statusColor } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLead, setModalLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });
  const [sortBy, setSortBy] = useState('createdAt');

  const canManage = ['Admin', 'Team Lead'].includes(user?.role);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      setLeads(await leadApi.list(filters));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    userApi.list().then(setUsers).catch(() => setUsers([]));
  }, []);

  const rows = useMemo(() => {
    return [...leads].sort((a, b) => {
      if (sortBy === 'budget') return (b.budget || 0) - (a.budget || 0);
      if (sortBy === 'score') return (b.leadScore?.score || 0) - (a.leadScore?.score || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [leads, sortBy]);

  const submitLead = async (payload) => {
    try {
      if (modalLead) await leadApi.update(modalLead._id, payload);
      else await leadApi.create(payload);
      toast.success(modalLead ? 'Lead updated' : 'Lead created');
      setModalOpen(false);
      setModalLead(null);
      fetchLeads();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteLead = async (lead) => {
    try {
      await leadApi.remove(lead._id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const exportCsv = () => {
    const header = ['Company', 'Contact', 'Email', 'Status', 'Priority', 'Assigned To', 'Budget', 'Lead Score'];
    const lines = rows.map((lead) => [
      lead.companyName,
      lead.contactPerson,
      lead.email,
      lead.status,
      lead.priority,
      lead.assignedTo?.name || 'Unassigned',
      lead.budget,
      `${lead.leadScore?.label || 'Cold'} ${lead.leadScore?.score || 0}`
    ]);
    const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartcrm-leads.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Leads exported');
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:min-w-[860px]">
            <label className="relative block">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                value={filters.search}
                onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                placeholder="Search leads"
                className="w-full rounded-lg border border-white/10 bg-slate-950/70 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-cyan-300"
              />
            </label>
            <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300">
              <option value="">All statuses</option>
              {['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })} className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300">
              <option value="">All priorities</option>
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-300">
              <option value="createdAt">Newest first</option>
              <option value="budget">Highest budget</option>
              <option value="score">Highest AI score</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportCsv}>
              <FiDownload /> Export CSV
            </Button>
            {canManage && (
              <Button onClick={() => { setModalLead(null); setModalOpen(true); }}>
                <FiPlus /> Add Lead
              </Button>
            )}
          </div>
        </div>
      </Card>

      {loading ? (
        <Skeleton rows={5} />
      ) : rows.length === 0 ? (
        <EmptyState title="No leads found" description="Create a lead or relax the current filters to see pipeline opportunities." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">AI Score</th>
                  <th className="px-5 py-3">Assigned</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((lead) => (
                  <tr key={lead._id} className="border-t border-white/10 transition-all duration-300 hover:bg-cyan-300/5">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{lead.companyName}</p>
                      <p className="text-xs text-slate-400">{lead.contactPerson} - {lead.email}</p>
                    </td>
                    <td className="px-5 py-4"><Badge className={statusColor[lead.status]}>{lead.status}</Badge></td>
                    <td className="px-5 py-4"><Badge className={priorityColor[lead.priority]}>{lead.priority}</Badge></td>
                    <td className="px-5 py-4">
                      <Badge className={scoreColor[lead.leadScore?.label]}>{lead.leadScore?.label} - {lead.leadScore?.score}</Badge>
                      <p className="mt-1 text-xs text-slate-500">Budget + interest based</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{lead.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-5 py-4 font-semibold text-cyan-300">{formatCurrency(lead.budget)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" onClick={() => { setModalLead(lead); setModalOpen(true); }}>
                          <FiEdit2 />
                        </button>
                        {canManage && (
                          <button className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-500/10" onClick={() => deleteLead(lead)}>
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {modalOpen && <LeadFormModal lead={modalLead} users={users} onClose={() => setModalOpen(false)} onSubmit={submitLead} />}
    </div>
  );
}
