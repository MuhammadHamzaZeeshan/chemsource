import { useEffect, useState } from "react";
import { fetchListings, createOrder } from "../api";
import { LoadingSpinner, ErrorBanner, EmptyState, Badge, PageHeader } from "../components/UI";

const CATEGORY_META = {
  TEXTILE_AUXILIARY: { label: "Textile Aux", color: "blue" },
  PHARMA_GRADE:      { label: "Pharma",      color: "green" },
  SOLVENT:           { label: "Solvent",     color: "yellow" },
  ACID_BASE:         { label: "Acid/Base",   color: "red" },
};

function OrderModal({ listing, onClose, onSuccess }) {
  const [qty, setQty]               = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const total = (qty * parseFloat(listing.price_per_metric_ton)).toFixed(2);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await createOrder({ listing: listing.id, quantity_requested: qty });
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900">Place Order</h2>
            <p className="text-xs text-gray-500 mt-0.5">{listing.PRODUCT?.CHEMICAL_NAME}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <table className="w-full text-sm border border-gray-200 rounded">
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-gray-500 text-xs font-medium w-1/2">Distributor</td>
                <td className="px-3 py-2 text-gray-900 font-medium">{listing.DISTRIBUTOR}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-gray-500 text-xs font-medium">Price / MT</td>
                <td className="px-3 py-2 text-gray-900 font-semibold">PKR {listing.price_per_metric_ton}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-gray-500 text-xs font-medium">Available Stock</td>
                <td className="px-3 py-2 text-gray-900">{listing.quantity_available_mt} MT</td>
              </tr>
            </tbody>
          </table>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Metric Tons)
            </label>
            <input
              type="number"
              min={1}
              max={listing.quantity_available_mt}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Maximum: {listing.quantity_available_mt} MT</p>
          </div>

          <div className="flex items-center justify-between px-3 py-3 bg-blue-50 border border-blue-200 rounded">
            <span className="text-sm font-medium text-gray-700">Estimated Invoice</span>
            <span className="text-base font-bold text-blue-700">PKR {parseFloat(total).toLocaleString()}</span>
          </div>

          {error && <ErrorBanner message={error} />}
        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || qty > listing.quantity_available_mt}
            className="flex-1 py-2 bg-blue-700 text-white rounded text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState("default");
  const [catFilter, setCatFilter] = useState("ALL");
  const [distFilter, setDistFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [success, setSuccess]   = useState(false);

  const load = () => {
    setLoading(true);
    fetchListings()
      .then(setListings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSuccess = () => {
    setSelected(null);
    setSuccess(true);
    load();
    setTimeout(() => setSuccess(false), 3000);
  };

  // Unique distributors and categories from data
  const distributors = ["ALL", ...Array.from(new Set(listings.map((l) => l.DISTRIBUTOR).filter(Boolean)))];
  const categories   = ["ALL", ...Object.keys(CATEGORY_META)];

  let filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = l.PRODUCT?.CHEMICAL_NAME?.toLowerCase().includes(q) || l.DISTRIBUTOR?.toLowerCase().includes(q);
    const matchCat    = catFilter === "ALL" || l.PRODUCT?.CATEGORY === catFilter;
    const matchDist   = distFilter === "ALL" || l.DISTRIBUTOR === distFilter;
    return matchSearch && matchCat && matchDist;
  });

  if (sortBy === "price_asc")   filtered = [...filtered].sort((a, b) => parseFloat(a.price_per_metric_ton) - parseFloat(b.price_per_metric_ton));
  if (sortBy === "price_desc")  filtered = [...filtered].sort((a, b) => parseFloat(b.price_per_metric_ton) - parseFloat(a.price_per_metric_ton));
  if (sortBy === "stock_desc")  filtered = [...filtered].sort((a, b) => b.quantity_available_mt - a.quantity_available_mt);
  if (sortBy === "name_asc")    filtered = [...filtered].sort((a, b) => (a.PRODUCT?.CHEMICAL_NAME || "").localeCompare(b.PRODUCT?.CHEMICAL_NAME || ""));
  if (sortBy === "dist_asc")    filtered = [...filtered].sort((a, b) => (a.DISTRIBUTOR || "").localeCompare(b.DISTRIBUTOR || ""));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        label="Market"
        title="Price Listings"
        desc="Live pricing from verified distributors. All prices in PKR per metric ton."
      />

      {success && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded font-medium">
          ✓ Order placed successfully.
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search chemical or distributor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === "ALL" ? "All Categories" : CATEGORY_META[c]?.label}</option>
          ))}
        </select>
        <select
          value={distFilter}
          onChange={(e) => setDistFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
        >
          {distributors.map((d) => (
            <option key={d} value={d}>{d === "ALL" ? "All Distributors" : d}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="default">Sort: Default</option>
          <option value="name_asc">Chemical Name: A–Z</option>
          <option value="dist_asc">Distributor: A–Z</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock_desc">Stock: Most Available</option>
        </select>
      </div>

      {loading && <LoadingSpinner message="Loading listings..." />}
      {error   && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No listings available" desc="Try adjusting your filters or search." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-3">{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Chemical</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Distributor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price / MT</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock (MT)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Updated</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((l) => {
                  const meta = CATEGORY_META[l.PRODUCT?.CATEGORY] || { label: l.PRODUCT?.CATEGORY, color: "gray" };
                  return (
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{l.PRODUCT?.CHEMICAL_NAME || "—"}</p>
                        <p className="text-xs text-gray-400 font-mono">{l.PRODUCT?.CAS_NUMBER}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={meta.color}>{meta.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{l.DISTRIBUTOR}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        PKR {parseFloat(l.price_per_metric_ton).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{l.quantity_available_mt}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(l.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(l)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                          Order
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selected && (
        <OrderModal listing={selected} onClose={() => setSelected(null)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}