import Card from './ui/Card';
import { FiTrendingUp } from 'react-icons/fi';

export default function MetricCard({ label, value, icon: Icon, accent = 'text-cyan-300', trend = '+12%', caption = 'vs last month' }) {
  return (
    <Card className="p-4" interactive>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-white">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 shadow-lg ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-bold text-emerald-300">
          <FiTrendingUp className="h-3 w-3" />
          {trend}
        </span>
        <span className="text-slate-500">{caption}</span>
      </div>
    </Card>
  );
}
