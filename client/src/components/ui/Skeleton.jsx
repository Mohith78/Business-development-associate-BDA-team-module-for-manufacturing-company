export default function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-lg border border-white/10 bg-white/5 shadow-xl shadow-slate-950/20 backdrop-blur" />
      ))}
    </div>
  );
}
