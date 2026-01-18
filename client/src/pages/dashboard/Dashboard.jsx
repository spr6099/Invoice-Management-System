import React, { useEffect, useMemo } from "react";
import { useData } from "../../hooks/useData";

const Dashboard = () => {
  /* -------------------- DUMMY DATA -------------------- */
  const { customers, items, invoices, fetchDetails } = useData()

  /* -------------------- CALCULATIONS -------------------- */
  const totalSales = useMemo(() => {
    return invoices.reduce(
      (sum, inv) => sum + (inv.grandTotal || 0),
      0
    );
  }, [invoices]);


  // const today = "2026-01-18";

  const todaySales = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    return invoices
      .filter(
        (inv) => inv.createdAt?.split("T")[0] === today
      )
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  }, [invoices]);

  useEffect(() => {
    fetchDetails()
  })
  const lastFiveInvoices = invoices.slice(0, 5);

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Customers" value={customers.length} />
        <StatCard title="Items" value={items.length} />
        <StatCard title="Invoices" value={invoices.length} />
        <StatCard title="Total Sales" value={`₹${totalSales}`} />
      </div>

      {/* TODAY SALES */}
      <div className="bg-white shadow rounded p-4">
        <p className="text-sm text-gray-500">Today’s Sales</p>
        <p className="text-2xl font-bold">₹{todaySales}</p>
      </div>

      {/* LAST 5 INVOICES */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-3">Last 5 Invoices</h2>

        {lastFiveInvoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices found</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Invoice No</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lastFiveInvoices.map((inv) => (
                <tr key={inv._id} className="text-center">
                  <td className="border p-2">{inv.invoiceNo}</td>
                  <td className="border p-2">{inv.customerId.name}</td>
                  <td className="border p-2">{new Date(inv.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="border p-2">₹{inv.subTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* -------------------- STAT CARD -------------------- */
const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
