import { useEffect, useState } from "react";
import { fetchOrders } from "../api";
import { LoadingSpinner, ErrorBanner, EmptyState, Badge } from "../components/UI";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders()
      .then((data) => {
        // Handle both array and single object responses
        setOrders(Array.isArray(data) ? data : data ? [data] : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    String(o.id).includes(search) ||
    String(o.listing).includes(search)
  );

  const totalValue = filtered.reduce((sum, o) => sum + parseFloat(o.total_invoice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
          <span>◎</span> Procurement
        </div>
        <h1 className="text-3xl font-black text-white mb-1">Orders</h1>
        <p className="text-slate-400 text-sm">
          Track all procurement orders, quantities, and invoices.
        </p>
      </div>

      {/* Summary cards */}
      {!loading && !error && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-slate-500 text-xs mb-1">Total Orders</p>
            <p className="text-white text-3xl font-black">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-slate-500 text-xs mb-1">Total Invoice Value</p>
            <p className="text-emerald-400 text-2xl font-black">
              PKR {totalValue.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-slate-500 text-xs mb-1">Avg Order Value</p>
            <p className="text-cyan-400 text-2xl font-black">
              PKR {orders.length ? (totalValue / orders.length).toLocaleString("en-PK", { maximumFractionDigits: 0 }) : "0"}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
        <input
          type="text"
          placeholder="Search by order ID or listing ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {loading && <LoadingSpinner message="Fetching orders…" />}
      {error && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="◎" title="No orders found" desc="Orders placed through the listings page will appear here." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="rounded-2xl border border-slate-800 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Order ID</span>
            <span>Listing</span>
            <span>Quantity</span>
            <span>Invoice (PKR)</span>
            <span>Date</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-slate-800/60">
            {filtered.map((order, i) => (
              <div
                key={order.id}
                className="grid grid-cols-2 sm:grid-cols-5 gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors items-center"
              >
                {/* Order ID */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    #{order.id}
                  </div>
                </div>

                {/* Listing */}
                <div>
                  <p className="text-slate-300 text-sm font-medium">
                    Listing #{order.listing}
                  </p>
                  <p className="text-slate-600 text-xs sm:hidden">
                    {order.quantity_requested} MT
                  </p>
                </div>

                {/* Qty */}
                <div className="hidden sm:block">
                  <Badge color="teal">{order.quantity_requested} MT</Badge>
                </div>

                {/* Invoice */}
                <div>
                  <p className="text-cyan-400 font-bold text-sm">
                    {parseFloat(order.total_invoice).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Date */}
                <div className="text-slate-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString("en-PK", {
                    year: "numeric", month: "short", day: "numeric"
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}