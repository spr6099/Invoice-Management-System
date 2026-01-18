import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Auto-open invoice submenu when inside /invoices
  useEffect(() => {
    if (location.pathname.startsWith("/invoices")) {
      setInvoiceOpen(true);
    }
  }, [location.pathname]);

  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  const subLinkClasses = ({ isActive }) =>
    `block pl-10 pr-4 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-blue-500 text-white"
        : "text-gray-400 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-0 left-0 h-full sm:h-auto
        w-64 bg-gray-900 text-white p-4 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0`}
      >
        <h2 className="text-lg font-bold mb-6">Menu</h2>

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>

          <NavLink to="/customers" className={linkClasses}>
            Customers
          </NavLink>

          <NavLink to="/items" className={linkClasses}>
            Items
          </NavLink>

          {/* Invoices with submenu */}
          <button
            onClick={() => setInvoiceOpen((prev) => !prev)}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
              ${
                location.pathname.startsWith("/invoices")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
          >
            Invoices
          </button>

          {invoiceOpen && (
            <div className="ml-2 space-y-1">
              <NavLink
                to="/invoices/create"
                className={subLinkClasses}
              >
                Create Invoice
              </NavLink>

              <NavLink
                to="/invoices/list"
                className={subLinkClasses}
              >
                Invoice List
              </NavLink>
            </div>
          )}

          <NavLink to="/reports" className={linkClasses}>
            Reports
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
