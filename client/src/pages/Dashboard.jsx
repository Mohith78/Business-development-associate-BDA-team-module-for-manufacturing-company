import { FiBriefcase, FiCheckCircle, FiDollarSign, FiTarget } from 'react-icons/fi';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { analyticsApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import Card from '../components/ui/Card';
import MetricCard from '../components/MetricCard';
import Skeleton from '../components/ui/Skeleton';
import { formatCurrency } from '../utils/constants';

const colors = ['#22d3ee', '#818cf8', '#a78bfa', '#f59e0b', '#34d399', '#fb7185'];

export default function Dashboard() {
  const { data, loading } = useApi(analyticsApi.dashboard, { fallback: null });

  if (loading || !data) return <Skeleton rows={6} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Leads" value={data.metrics.totalLeads} icon={FiBriefcase} trend="+18%" />
        <MetricCard label="Revenue" value={formatCurrency(data.metrics.revenue)} icon={FiDollarSign} accent="text-emerald-300" trend="+24%" />
        <MetricCard label="Conversion Rate" value={`${data.metrics.conversionRate}%`} icon={FiTarget} accent="text-violet-300" trend="+12%" />
        <MetricCard label="Pending Tasks" value={data.metrics.pendingTasks} icon={FiCheckCircle} accent="text-amber-300" trend="-8%" caption="open workload" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Monthly Conversions</h2>
              <p className="text-sm text-slate-400">Won opportunities and attributed revenue trend.</p>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">Live analytics</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyConversions}>
                <defs>
                  <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="revenueGradientDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="#a78bfa" fill="url(#revenueGradientDash)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Area type="monotone" dataKey="conversions" stroke="#22d3ee" fill="url(#conversionsGradient)" strokeWidth={2.5} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 text-lg font-black tracking-tight">Lead Status Distribution</h2>
          <p className="mb-5 text-sm text-slate-400">Pipeline health by active stage.</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.statusDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-base font-bold">Team Performance</h2>
          <div className="space-y-3">
            {data.teamPerformance.map((member) => (
              <div key={member.name} className="rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                  <p className="text-sm font-bold text-cyan-300">{formatCurrency(member.revenue)}</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-950/80">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400" style={{ width: `${Math.min(100, member.leads * 18)}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{member.won} won from {member.leads} assigned leads</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-base font-bold">Recent Activity</h2>
          <div className="space-y-3">
            {data.recentActivity.map((activity) => (
              <div key={activity._id} className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/10">
                <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40" />
                <div>
                  <p className="text-sm text-slate-200">
                    <span className="font-bold text-white">{activity.user?.name}</span> {activity.action}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{activity.target}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
