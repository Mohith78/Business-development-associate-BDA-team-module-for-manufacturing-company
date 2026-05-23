import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const { authenticate, user } = useAuth();
  const [form, setForm] = useState({ email: 'admin@smartcrm.dev', password: 'password123' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authenticate('login', form);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage leads, tasks, and BDA workflow analytics.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Input label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        <Button className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'} <FiArrowRight />
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        New to SmartCRM? <Link className="font-semibold text-cyan-300" to="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#020617_0%,#111827_48%,#172554_100%)]" />
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <div className="mb-6">
          <p className="mb-2 text-sm font-bold text-cyan-300">SmartCRM</p>
          <h1 className="text-2xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
        {...props}
      />
    </label>
  );
}
