import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Button from './ui/Button';
import { leadStatuses, priorities } from '../utils/constants';

const initialForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  status: 'New',
  priority: 'Medium',
  assignedTo: '',
  budget: 25000,
  interestLevel: 5,
  notesText: ''
};

export default function LeadFormModal({ lead, users = [], onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (lead) {
      setForm({
        companyName: lead.companyName || '',
        contactPerson: lead.contactPerson || '',
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status || 'New',
        priority: lead.priority || 'Medium',
        assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
        budget: lead.budget || 0,
        interestLevel: lead.interestLevel || 5,
        notesText: ''
      });
    }
  }, [lead]);

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, budget: Number(form.budget), interestLevel: Number(form.interestLevel) };
    if (!payload.assignedTo) delete payload.assignedTo;
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-xl">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-3xl animate-[modalIn_220ms_ease-out] overflow-y-auto rounded-lg border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{lead ? 'Edit Lead' : 'Add Lead'}</h2>
            <p className="text-sm text-slate-400">Lead score is recalculated from budget and interest level.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <FiX />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" value={form.companyName} onChange={(companyName) => setForm({ ...form, companyName })} required />
          <Field label="Contact Person" value={form.contactPerson} onChange={(contactPerson) => setForm({ ...form, contactPerson })} required />
          <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
          <Field label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
          <Select label="Status" value={form.status} onChange={(status) => setForm({ ...form, status })} options={leadStatuses} />
          <Select label="Priority" value={form.priority} onChange={(priority) => setForm({ ...form, priority })} options={priorities} />
          <Select
            label="Assigned To"
            value={form.assignedTo}
            onChange={(assignedTo) => setForm({ ...form, assignedTo })}
            options={users.map((user) => ({ label: `${user.name} (${user.role})`, value: user._id }))}
            placeholder="Unassigned"
          />
          <Field label="Budget" type="number" value={form.budget} onChange={(budget) => setForm({ ...form, budget })} min="0" />
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Interest Level: {form.interestLevel}/10</span>
            <input
              type="range"
              min="1"
              max="10"
              value={form.interestLevel}
              onChange={(event) => setForm({ ...form, interestLevel: event.target.value })}
              className="mt-3 w-full accent-cyan-300"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{lead ? 'Save changes' : 'Create lead'}</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300"
        {...props}
      />
    </label>
  );
}

function Select({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const item = typeof option === 'string' ? { label: option, value: option } : option;
          return <option key={item.value} value={item.value}>{item.label}</option>;
        })}
      </select>
    </label>
  );
}
