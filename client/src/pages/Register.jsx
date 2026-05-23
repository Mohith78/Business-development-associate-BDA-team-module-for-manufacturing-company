import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { AuthShell, Input } from './Login';
import { roleOptions } from '../utils/constants';

export default function Register() {
  const { authenticate, user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Employee' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authenticate('register', form);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create workspace access" subtitle="Register as an Admin, Team Lead, or Employee for role-aware CRM workflows.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
        <Input label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} required />
        <Input label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} required minLength={6} />
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Role</span>
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300"
          >
            {roleOptions.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </label>
        <Button className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        Already registered? <Link className="font-semibold text-cyan-300" to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
