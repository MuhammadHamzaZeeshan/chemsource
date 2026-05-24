import { useEffect, useState } from "react";
import { fetchListings, createOrder } from "../api";
import { LoadingSpinner, ErrorBanner, EmptyState, Badge } from "../components/UI";

const CATEGORY_META = {
  TEXTILE_AUXILIARY: { label: "Textile Aux", color: "cyan" },
  PHARMA_GRADE:      { label: "Pharma",      color: "emerald" },
  SOLVENT:           { label: "Solvent",     color: "teal" },
  ACID_BASE:         { label: "Acid/Base",   color: "amber" },
};

function OrderModal({ listing, onClose, onSuccess }) {
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalInvoice = (qty * parseFloat(listing.price_per_metric_ton)).toFixed(2);

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Place Order</h2>
            <p className="text-slate-400 text-xs mt-0.5">{listing.PRODUCT?.CHEMICAL_NAME}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Listing summary */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Distributor</span>
              <span className="text-white font-medium">{listing.DISTRIBUTOR}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price / MT</span>
              <span className="text-cyan-400 font-bold">PKR {listing.price_per_metric_ton}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Available Stock</span>
              <span className="text-emerald-400 font-semibold">{listing.quantity_available_mt} MT</span>
            </div>
          </div>

          {/* Quantity input */}
          <div>
            <label className="block text-sm text-slate-300 font-medium mb-2">
              Quantity (Metric Tons)
            </label>
            <input
              type="number"
              min={1}
              max={listing.quantity_available_mt}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Max: {listing.quantity_available_mt} MT</p>
          </div>

          {/* Invoice Preview */}
          <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm font-medium">Estimated Invoice</span>
              <span className="text-cyan-400 text-xl font-black">PKR {totalInvoice}</span>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || qty > listing.quantity_available_mt}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing…" : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const load = () => {
    setLoading(true);
    fetchListings()
      .then(setListings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleOrderSuccess = () => {
    setSelectedListing(null);
    setOrderSuccess(true);
    load();
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  let filtered = listings.filter((l) =>
    l.PRODUCT?.CHEMICAL_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    l.DISTRIBUTOR?.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === "price_asc") filtered = [...filtered].sort((a, b) => parseFloat(a.price_per_metric_ton) - parseFloat(b.price_per_metric_ton));
  if (sortBy === "price_desc") filtered = [...filtered].sort((a, b) => parseFloat(b.price_per_metric_ton) - parseFloat(a.price_per_metric_ton));
  if (sortBy === "stock_desc") filtered = [...filtered].sort((a, b) => b.quantity_available_mt - a.quantity_available_mt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-teal-400 text-sm font-medium mb-2">
          <span>◉</span> Market Listings
        </div>
        <h1 className="text-3xl font-black text-white mb-1">Price Listings</h1>
        <p className="text-slate-400 text-sm">
          Live pricing from verified distributors. All prices in PKR per metric ton.
        </p>
      </div>

      {/* Success toast */}
      {orderSuccess && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <span>✓</span> Order placed successfully!
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search by chemical or distributor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-teal-500 transition-colors"
        >
          <option value="default">Sort: Default</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="stock_desc">Stock: Most Available</option>
        </select>
      </div>

      {loading && <LoadingSpinner message="Fetching live listings…" />}
      {error && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="◉" title="No listings available" desc="Check back later or adjust your search." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-xs text-slate-500 mb-4">{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((listing) => {
              const catMeta = CATEGORY_META[listing.PRODUCT?.CATEGORY] || { label: listing.PRODUCT?.CATEGORY, color: "slate" };
              return (
                <div
                  key={listing.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-teal-500/30 hover:bg-slate-800/50 p-5 transition-all duration-200"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base truncate group-hover:text-teal-100 transition-colors">
                        {listing.PRODUCT?.CHEMICAL_NAME || "—"}
                      </h3>
                      <p className="text-slate-500 text-xs font-mono mt-0.5">
                        CAS: {listing.PRODUCT?.CAS_NUMBER || "—"}
                      </p>
                    </div>
                    <Badge color={catMeta.color}>{catMeta.label}</Badge>
                  </div>

                  {/* Distributor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500/30 to-cyan-500/30 border border-teal-500/20 flex items-center justify-center text-xs text-teal-400 font-bold">
                      {listing.DISTRIBUTOR?.[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-slate-400 text-sm">{listing.DISTRIBUTOR}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl bg-slate-800/60 p-3">
                      <p className="text-slate-500 text-xs mb-1">Price / MT</p>
                      <p className="text-cyan-400 font-black text-lg leading-none">
                        PKR {parseFloat(listing.price_per_metric_ton).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-800/60 p-3">
                      <p className="text-slate-500 text-xs mb-1">Available Stock</p>
                      <p className="text-emerald-400 font-black text-lg leading-none">
                        {listing.quantity_available_mt} <span className="text-xs font-normal text-emerald-500">MT</span>
                      </p>
                    </div>
                  </div>

                  {/* Updated */}
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 text-xs">
                      Updated: {new Date(listing.updated_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="px-4 py-2 rounded-lg bg-teal-500/15 text-teal-400 text-xs font-semibold border border-teal-500/20 hover:bg-teal-500/25 hover:border-teal-400/30 transition-all"
                    >
                      Order Now →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedListing && (
        <OrderModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}