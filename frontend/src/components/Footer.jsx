export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} ChemFlow — Chemical Procurement Platform
        </p>
      </div>
    </footer>
  );
}