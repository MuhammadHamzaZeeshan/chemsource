export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
      </div>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}

export function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
      <span className="text-lg">⚠</span>
      <div>
        <p className="font-semibold">Error</p>
        <p className="text-red-400/80 text-xs mt-0.5">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon = "◎", title = "No data found", desc = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <span className="text-4xl text-slate-700">{icon}</span>
      <p className="text-slate-400 font-semibold">{title}</p>
      {desc && <p className="text-slate-600 text-sm max-w-xs">{desc}</p>}
    </div>
  );
}

export function Badge({ children, color = "slate" }) {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    slate: "bg-slate-700/50 text-slate-400 border-slate-700",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
}