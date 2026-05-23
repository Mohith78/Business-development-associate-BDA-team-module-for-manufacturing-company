export default function Card({ children, className = '', interactive = false, ...props }) {
  return (
    <section
      className={`rounded-lg border border-white/10 bg-[#0f172a]/80 shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition-all duration-300 ${
        interactive ? 'hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-cyan-950/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
