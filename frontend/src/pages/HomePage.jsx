const FEATURES = [
  {
    title: "Product Catalog",
    desc: "Browse all registered industrial chemicals by name, CAS number, and category.",
    page: "products",
  },
  {
    title: "Price Listings",
    desc: "View live pricing from verified distributors. Filter, sort, and place orders directly.",
    page: "listings",
  },
  {
    title: "Procurement Orders",
    desc: "Track all placed orders, quantities requested, and auto-calculated invoices.",
    page: "orders",
  },
];

const CATEGORIES = [
  { name: "Textile Auxiliary", tag: "TEXTILE_AUXILIARY" },
  { name: "Pharma Grade",      tag: "PHARMA_GRADE" },
  { name: "Solvents",          tag: "SOLVENT" },
  { name: "Acids & Bases",     tag: "ACID_BASE" },
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
        <p className="text-gray-500 text-base max-w-xl mb-6">
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

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-gray-700 mb-5">Platform Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <button
              key={f.title}
              onClick={() => setActivePage(f.page)}
              className="text-left p-5 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-5">Chemical Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.tag}
              onClick={() => setActivePage("products")}
              className="p-4 border border-gray-200 rounded text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <p className="text-sm font-medium text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-400 font-mono mt-1">{cat.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}