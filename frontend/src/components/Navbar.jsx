import { useState } from "react";

const NAV_ITEMS = [
  { id: "home",     label: "Home" },
  { id: "products", label: "Products" },
  { id: "listings", label: "Price Listings" },
  { id: "orders",   label: "Orders" },
];

export default function Navbar({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <button
            onClick={() => setActivePage("home")}
            className="flex items-center gap-2 font-bold text-gray-900 text-base hover:text-blue-700 transition-colors"
          >
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">CS</span>
            ChemSource
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  activePage === item.id
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm font-medium border-b border-gray-100 transition-colors ${
                activePage === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}