const STATS = [
  { label: "Chemical Products", value: "200+", icon: "◈", color: "cyan" },
  { label: "Active Distributors", value: "50+", icon: "◉", color: "teal" },
  { label: "Orders Processed", value: "1K+", icon: "◎", color: "emerald" },
];

const FEATURES = [
  {
    icon: "◈",
    title: "Product Catalog",
    desc: "Browse our comprehensive catalog of industrial chemicals categorized by type, CAS number, and application.",
    page: "products",
    color: "cyan",
  },
  {
    icon: "◉",
    title: "Price Listings",
    desc: "Compare real-time pricing from verified distributors. Filter by availability and get the best rates.",
    page: "listings",
    color: "teal",
  },
  {
    icon: "◎",
    title: "Procurement Orders",
    desc: "Place and track orders seamlessly. Automatic invoice generation and inventory management built-in.",
    page: "orders",
    color: "emerald",
  },
];

const CATEGORIES = [
  { name: "Textile Auxiliary", tag: "TEXTILE_AUXILIARY", icon: "⬡" },
  { name: "Pharma Grade", tag: "PHARMA_GRADE", icon: "◇" },
  { name: "Solvents", tag: "SOLVENT", icon: "○" },
  { name: "Acids & Bases", tag: "ACID_BASE", icon: "△" },
];

const COLOR_MAP = {
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    btn: "bg-cyan-500 hover:bg-cyan-400",
    shadow: "shadow-cyan-500/20",
  },
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-400",
    btn: "bg-teal-500 hover:bg-teal-400",
    shadow: "shadow-teal-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    btn: "bg-emerald-500 hover:bg-emerald-400",
    shadow: "shadow-emerald-500/20",
  },
};

export default function HomePage({ setActivePage }) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl" />
          <div className="absolute -top-10 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Chemical Procurement Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Industrial Chemicals,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
              Simplified.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect manufacturers with verified distributors. Browse live price listings,
            manage procurement orders, and streamline your chemical supply chain — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActivePage("listings")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:brightness-110 transition-all duration-200 w-full sm:w-auto"
            >
              Browse Price Listings →
            </button>
            <button
              onClick={() => setActivePage("products")}
              className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium text-sm hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 w-full sm:w-auto"
            >
              View Product Catalog
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-black text-${s.color}-400`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Platform Features</h2>
          <p className="text-slate-500 text-sm text-center mb-10">Everything you need to manage chemical procurement</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const c = COLOR_MAP[f.color];
              return (
                <div
                  key={f.title}
                  className={`group relative rounded-2xl border ${c.border} ${c.bg} p-6 hover:shadow-xl ${c.shadow} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                  onClick={() => setActivePage(f.page)}
                >
                  <div className={`text-2xl mb-4 ${c.text}`}>{f.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{f.desc}</p>
                  <span className={`text-xs font-semibold ${c.text} group-hover:underline`}>
                    Explore → 
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Chemical Categories</h2>
          <p className="text-slate-500 text-sm text-center mb-10">We cover all major industrial chemical segments</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.tag}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group"
                onClick={() => setActivePage("products")}
              >
                <span className="text-2xl text-slate-500 group-hover:text-cyan-400 transition-colors">{cat.icon}</span>
                <span className="text-sm font-medium text-slate-300 text-center leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}