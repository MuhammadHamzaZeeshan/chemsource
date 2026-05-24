import { useEffect, useState } from "react";
import { fetchProducts } from "../api";
import { LoadingSpinner, ErrorBanner, EmptyState, Badge, PageHeader } from "../components/UI";

const CATEGORY_META = {
  TEXTILE_AUXILIARY: { label: "Textile Auxiliary", color: "blue" },
  PHARMA_GRADE:      { label: "Pharma Grade",      color: "green" },
  SOLVENT:           { label: "Solvent",            color: "yellow" },
  ACID_BASE:         { label: "Acid / Base",        color: "red" },
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("ALL");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["ALL", ...Object.keys(CATEGORY_META)];

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.CHEMICAL_NAME.toLowerCase().includes(q) || p.CAS_NUMBER.toLowerCase().includes(q);
    const matchCat    = catFilter === "ALL" || p.CATEGORY === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        label="Catalog"
        title="Chemical Products"
        desc="All registered chemicals with CAS numbers and category classifications."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or CAS number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "ALL" ? "All Categories" : CATEGORY_META[c]?.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner message="Loading products..." />}
      {error   && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No products found" desc="Try a different search or category filter." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-3">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>

          {/* Table */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Chemical Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">CAS Number</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => {
                  const meta = CATEGORY_META[p.CATEGORY] || { label: p.CATEGORY, color: "gray" };
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.CHEMICAL_NAME}</td>
                      <td className="px-4 py-3 font-mono text-gray-600 text-xs">{p.CAS_NUMBER}</td>
                      <td className="px-4 py-3">
                        <Badge color={meta.color}>{meta.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}