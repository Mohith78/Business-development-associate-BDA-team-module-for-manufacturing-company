import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiBell, FiBriefcase, FiChevronDown, FiGrid, FiLogOut, FiMenu, FiMoon, FiSearch, FiTrello, FiUsers } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/leads', label: 'Leads', icon: FiBriefcase },
  { to: '/kanban', label: 'Kanban', icon: FiTrello },
  { to: '/tasks', label: 'Tasks', icon: FiUsers },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 }
];

const titles = {
  '/': 'Executive Dashboard',
  '/leads': 'Lead Management',
  '/kanban': 'BDA Workflow Board',
  '/tasks': 'Task Management',
  '/analytics': 'Revenue Analytics'
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const today = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 soft-grid">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(129,140,248,0.18),transparent_30%),linear-gradient(135deg,#020617_0%,#111827_48%,#0f172a_100%)]" />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl transition-all duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/25">
              <FiActivity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">SmartCRM</p>
              <p className="text-xs text-slate-400">Manufacturing BDA Ops</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:translate-x-1 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 transition group-hover:text-cyan-300" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300/15 text-sm font-bold text-cyan-200 ring-1 ring-cyan-300/20">
                {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.role}</p>
              </div>
            </div>
            <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              <FiLogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 shadow-xl shadow-slate-950/10 backdrop-blur-2xl">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 lg:hidden" onClick={() => setOpen(true)}>
                <FiMenu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-base font-black tracking-tight sm:text-xl">{titles[pathname] || 'SmartCRM'}</h1>
                <p className="hidden text-xs text-slate-400 sm:block">Pipeline clarity for business development teams</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative hidden min-w-64 md:block">
                <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  placeholder="Search leads, tasks, companies"
                  className="h-9 w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none transition focus:border-cyan-300/60 focus:bg-white/10"
                />
              </label>
              <select className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 outline-none transition hover:bg-white/10">
                <option>Manufacturing CRM</option>
                <option>BDA Sales Ops</option>
              </select>
              <div className="hidden h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-300 sm:flex">
                {today}
              </div>
              <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                <FiBell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                <FiMoon className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <span className="grid h-6 w-6 place-items-center rounded bg-cyan-300/15 text-xs font-bold text-cyan-200">
                    {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
                  </span>
                  <FiChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
                    <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                    <button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/10">
                      <FiLogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
