const FEATURES = [
  {
    title: "Product Catalog",
    desc: "Browse all registered industrial chemicals by name, CAS number, and category classification.",
    page: "products",
    stat: "Products",
  },
  {
    title: "Price Listings",
    desc: "View live pricing from verified distributors. Filter, sort, and place procurement orders directly.",
    page: "listings",
    stat: "Live Listings",
  },
  {
    title: "Procurement Orders",
    desc: "Track all placed orders, quantities requested, and auto-calculated invoices in one place.",
    page: "orders",
    stat: "Orders",
  },
];

export default function HomePage({ setActivePage }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      {/* Hero */}
      <div className="border-b border-gray-200 pb-10 mb-10">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-3">
          Chemical Procurement Platform
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Manage Chemical Supply<br className="hidden sm:block" /> Chain Operations
        </h1>
        <p className="text-gray-500 text-base max-w-xl mb-7">
          A centralised platform for manufacturers and distributors to manage product listings,
          compare prices, and process procurement orders efficiently.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActivePage("listings")}
            className="px-5 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors"
          >
            Browse Listings
          </button>
          <button
            onClick={() => setActivePage("products")}
            className="px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            View Products
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Platform Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <button
              key={f.title}
              onClick={() => setActivePage(f.page)}
              className="text-left p-6 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group bg-white"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.desc}</p>
              <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                Go to {f.title} →
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}