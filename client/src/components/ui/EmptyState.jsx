import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title, description }) {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
      <div>
        <FiInbox className="mx-auto mb-3 h-8 w-8 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}
