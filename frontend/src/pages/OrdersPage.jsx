import { useEffect, useState } from "react";
import { fetchOrders } from "../api";
import { LoadingSpinner, ErrorBanner, EmptyState, PageHeader } from "../components/UI";

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit", hour12: true });
  return { date, time };
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : data ? [data] : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    String(o.id).includes(search) || String(o.listing).includes(search)
  );

  const totalValue = filtered.reduce((sum, o) => sum + parseFloat(o.total_invoice || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        label="Procurement"
        title="Orders"
        desc="All procurement orders with quantities and auto-calculated invoices."
      />

      {/* Summary */}
      {!loading && !error && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Invoice Value</p>
            <p className="text-xl font-bold text-gray-900">
              PKR {totalValue.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Average Order Value</p>
            <p className="text-xl font-bold text-gray-900">
              PKR {orders.length ? (totalValue / orders.length).toLocaleString("en-PK", { maximumFractionDigits: 0 }) : "0"}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {loading && <LoadingSpinner message="Loading orders..." />}
      {error   && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No orders found" desc="Orders placed from the listings page will appear here." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-3">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Invoice (PKR)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((o) => {
                  const { date, time } = formatDateTime(o.created_at);
                  return (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">#{o.id}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{o.quantity_requested} MT</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {parseFloat(o.total_invoice).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs">{date}</p>
                        <p className="text-gray-400 text-xs">{time}</p>
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