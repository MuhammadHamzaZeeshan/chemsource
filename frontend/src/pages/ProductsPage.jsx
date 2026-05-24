import { useEffect, useState } from "react";
import { fetchProducts } from "../api";
import { LoadingSpinner, ErrorBanner, EmptyState, Badge } from "../components/UI";

const CATEGORY_META = {
  TEXTILE_AUXILIARY: { label: "Textile Auxiliary", color: "cyan", icon: "⬡" },
  PHARMA_GRADE:      { label: "Pharma Grade",      color: "emerald", icon: "◇" },
  SOLVENT:           { label: "Solvent",            color: "teal", icon: "○" },
  ACID_BASE:         { label: "Acid / Base",        color: "amber", icon: "△" },
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["ALL", ...Object.keys(CATEGORY_META)];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.CHEMICAL_NAME.toLowerCase().includes(search.toLowerCase()) ||
      p.CAS_NUMBER.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || p.CATEGORY === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
          <span>◈</span> Product Catalog
        </div>
        <h1 className="text-3xl font-black text-white mb-1">Chemical Products</h1>
        <p className="text-slate-400 text-sm">
          Browse all registered chemical products with CAS numbers and category classifications.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search by name or CAS number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {cat === "ALL" ? "All Categories" : CATEGORY_META[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching chemical products…" />}
      {error && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="◈" title="No products found" desc="Try adjusting your search or filter." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-xs text-slate-500 mb-4">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => {
              const meta = CATEGORY_META[product.CATEGORY] || { label: product.CATEGORY, color: "slate", icon: "●" };
              return (
                <div
                  key={product.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60 p-5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xl text-${meta.color}-400 opacity-80`}>{meta.icon}</span>
                    <Badge color={meta.color}>{meta.label}</Badge>
                  </div>
                  <h3 className="text-white font-bold text-base mb-1 leading-snug group-hover:text-cyan-100 transition-colors">
                    {product.CHEMICAL_NAME}
                  </h3>
                  <p className="text-slate-500 text-xs font-mono">
                    CAS: <span className="text-slate-300">{product.CAS_NUMBER}</span>
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-600">ID #{product.id}</span>
                    <span className="text-xs text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      View listings →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}