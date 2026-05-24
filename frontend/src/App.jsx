import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductsPage from "./pages/ProductsPage";
import ListingsPage from "./pages/ListingsPage";
import OrdersPage from "./pages/OrdersPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":     return <HomePage setActivePage={setActivePage} />;
      case "products": return <ProductsPage />;
      case "listings": return <ListingsPage />;
      case "orders":   return <OrdersPage />;
      default:         return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}