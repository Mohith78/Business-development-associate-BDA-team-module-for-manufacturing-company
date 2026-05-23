import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { analyticsApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

export default function Analytics() {
  const { data, loading } = useApi(analyticsApi.dashboard, { fallback: null });

  if (loading || !data) return <Skeleton rows={5} />;

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="mb-5">
          <h2 className="text-lg font-black tracking-tight">Revenue Tracking</h2>
          <p className="text-sm text-slate-400">Smoothed revenue and conversion trend across the last six months.</p>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyConversions}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="conversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#revenue)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Area type="monotone" dataKey="conversions" stroke="#a78bfa" fill="url(#conversions)" strokeWidth={2.5} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-black tracking-tight">Team Performance Table</h2>
          <p className="mt-1 text-sm text-slate-400">Assigned leads, won deals, and revenue contribution by member.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Assigned Leads</th>
                <th className="px-5 py-3">Won</th>
                <th className="px-5 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.teamPerformance.map((member) => (
                <tr key={member.name} className="border-t border-white/10 transition hover:bg-cyan-300/5">
                  <td className="px-5 py-4 font-semibold text-white">{member.name}</td>
                  <td className="px-5 py-4 text-slate-300">{member.role}</td>
                  <td className="px-5 py-4 text-slate-300">{member.leads}</td>
                  <td className="px-5 py-4 text-slate-300">{member.won}</td>
                  <td className="px-5 py-4 text-cyan-300">INR {member.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
