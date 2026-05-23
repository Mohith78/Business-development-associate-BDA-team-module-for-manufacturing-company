export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/30 hover:bg-indigo-400 hover:shadow-indigo-500/25',
    secondary: 'border border-white/10 bg-white/5 text-slate-100 hover:border-cyan-300/30 hover:bg-white/10',
    danger: 'border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20 hover:shadow-rose-500/10',
    ghost: 'text-slate-300 hover:bg-white/10 hover:text-white'
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
