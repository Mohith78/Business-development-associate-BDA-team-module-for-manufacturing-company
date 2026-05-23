import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LeadCard from '../components/LeadCard';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { leadApi } from '../services/api';
import { leadStatuses } from '../utils/constants';

export default function Kanban() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState('');
  const [dragOverStatus, setDragOverStatus] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      setLeads(await leadApi.list());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const moveLead = async (status) => {
    const lead = leads.find((item) => item._id === draggingId);
    if (!lead || lead.status === status) return;

    const previous = leads;
    setLeads((current) => current.map((item) => (item._id === draggingId ? { ...item, status } : item)));
    try {
      await leadApi.update(draggingId, { status });
      toast.success(`Moved to ${status}`);
    } catch (error) {
      setLeads(previous);
      toast.error(error.message);
    } finally {
      setDraggingId('');
      setDragOverStatus('');
    }
  };

  if (loading) return <Skeleton rows={6} />;

  if (!leads.length) {
    return <EmptyState title="No workflow cards yet" description="Add leads to see them flow through the BDA kanban board." />;
  }

  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1120px] grid-cols-6 gap-4">
        {leadStatuses.map((status) => {
          const columnLeads = leads.filter((lead) => lead.status === status);
          return (
            <Card
              key={status}
              className={`min-h-[70vh] p-3 transition-all duration-300 ${
                dragOverStatus === status ? 'border-cyan-300/50 bg-cyan-300/10 shadow-cyan-950/30' : ''
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={() => setDragOverStatus('')}
              onDrop={() => moveLead(status)}
            >
              <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black tracking-tight text-white">{status}</h2>
                  <span className="rounded-full bg-slate-950/70 px-2 py-0.5 text-xs font-bold text-cyan-200">{columnLeads.length}</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-slate-950/80">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400" style={{ width: `${Math.min(100, columnLeads.length * 24)}%` }} />
                </div>
              </div>
              <div className="space-y-3">
                {columnLeads.map((lead) => (
                  <div
                    key={lead._id}
                    draggable
                    onDragStart={() => setDraggingId(lead._id)}
                    onDragEnd={() => {
                      setDraggingId('');
                      setDragOverStatus('');
                    }}
                    className={`cursor-grab transition-all duration-300 active:cursor-grabbing ${
                      draggingId === lead._id ? 'scale-[0.98] opacity-60' : ''
                    }`}
                  >
                    <LeadCard lead={lead} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
