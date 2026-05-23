import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { leadApi, taskApi, userApi } from '../services/api';
import { formatDate, taskStatuses } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const initialTask = { title: '', description: '', assignedTo: '', dueDate: '', status: 'Todo', relatedLead: '' };
const statusProgress = { Todo: 15, 'In Progress': 62, Completed: 100 };
const statusStyles = {
  Todo: 'border-slate-400/30 bg-slate-400/10 text-slate-200',
  'In Progress': 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  Completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
};

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(initialTask);
  const [loading, setLoading] = useState(true);
  const canManage = ['Admin', 'Team Lead'].includes(user?.role);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      setTasks(await taskApi.list());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    userApi.list().then(setUsers).catch(() => setUsers([]));
    leadApi.list().then(setLeads).catch(() => setLeads([]));
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.relatedLead) delete payload.relatedLead;
      await taskApi.create(payload);
      toast.success('Task created');
      setForm(initialTask);
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await taskApi.update(task._id, { status });
      toast.success('Task updated');
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (task) => {
    try {
      await taskApi.remove(task._id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card className="p-5">
        <h2 className="mb-1 text-lg font-black tracking-tight">Create Task</h2>
        <p className="mb-4 text-sm text-slate-400">Assign follow-ups, proposals, and plant visit actions.</p>
        {canManage ? (
          <form onSubmit={createTask} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} required />
            <Input label="Description" value={form.description} onChange={(description) => setForm({ ...form, description })} />
            <Select label="Assigned To" value={form.assignedTo} onChange={(assignedTo) => setForm({ ...form, assignedTo })} required options={users.map((user) => ({ value: user._id, label: user.name }))} />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(dueDate) => setForm({ ...form, dueDate })} required />
            <Select label="Related Lead" value={form.relatedLead} onChange={(relatedLead) => setForm({ ...form, relatedLead })} options={leads.map((lead) => ({ value: lead._id, label: lead.companyName }))} placeholder="No related lead" />
            <Button className="w-full"><FiPlus /> Add task</Button>
          </form>
        ) : (
          <p className="text-sm text-slate-400">Employees can update assigned work. Admins and Team Leads create new tasks.</p>
        )}
      </Card>

      <div>
        {loading ? (
          <Skeleton rows={5} />
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Create tasks to coordinate follow-ups, proposals, and account actions." />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task._id} className="p-4" interactive>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white">{task.title}</h3>
                      <Badge className={statusStyles[task.status]}>{task.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{task.description || 'No description'}</p>
                    <p className="mt-3 text-xs text-slate-500">Assigned to {task.assignedTo?.name} - Due {formatDate(task.dueDate)} - {task.relatedLead?.companyName || 'General task'}</p>
                    <div className="mt-4 max-w-md">
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>Completion progress</span>
                        <span>{statusProgress[task.status]}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-950/80">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${statusProgress[task.status]}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select value={task.status} onChange={(event) => updateStatus(task, event.target.value)} className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-cyan-300">
                      {taskStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    {canManage && (
                      <button onClick={() => deleteTask(task)} className="rounded-lg border border-rose-400/30 p-2 text-rose-300 transition hover:bg-rose-500/10">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm outline-none focus:border-cyan-300" {...props} />
    </label>
  );
}

function Select({ label, value, onChange, options, placeholder, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm outline-none focus:border-cyan-300" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {!placeholder && <option value="">Select</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
