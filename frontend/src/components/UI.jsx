export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ErrorBanner({ message }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
      <span className="font-bold mt-0.5">!</span>
      <div>
        <p className="font-semibold">Error</p>
        <p className="text-red-600 text-xs mt-0.5">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title = "No records found", desc = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      <p className="text-gray-400 font-medium">{title}</p>
      {desc && <p className="text-gray-400 text-sm max-w-xs">{desc}</p>}
    </div>
  );
}

export function Badge({ children, color = "gray" }) {
  const colors = {
    blue:    "bg-blue-50 text-blue-700 border-blue-200",
    green:   "bg-green-50 text-green-700 border-green-200",
    yellow:  "bg-yellow-50 text-yellow-700 border-yellow-200",
    red:     "bg-red-50 text-red-700 border-red-200",
    purple:  "bg-purple-50 text-purple-700 border-purple-200",
    gray:    "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

export function PageHeader({ label, title, desc }) {
  return (
    <div className="mb-7 pb-5 border-b border-gray-200">
      {label && <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1">{label}</p>}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
    </div>
  );
}