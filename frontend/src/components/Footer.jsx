export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xs">
              CF
            </div>
            <span className="text-sm font-semibold text-slate-400">
              Chem<span className="text-cyan-400">Flow</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Chemical Procurement & Distribution Management Platform
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            API Connected · localhost:8000
          </div>
        </div>
      </div>
    </footer>
  );
}