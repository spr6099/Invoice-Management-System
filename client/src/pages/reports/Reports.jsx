import React, { useMemo, useState } from "react";
import { useData } from "../../hooks/useData";

const Reports = () => {
  /* -------------------- STATE -------------------- */
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { customers, invoices, loading, error } = useData()

  /* -------------------- CUSTOMER-WISE -------------------- */
  const customerInvoices = useMemo(() => {
    if (!selectedCustomer) return [];
    return invoices.filter(
      (i) => i.customerId?._id === selectedCustomer
    );
  }, [selectedCustomer, invoices]);

  const totalCustomerAmount = customerInvoices.reduce((sum, inv) => {
    const invoiceTotal = inv.items.reduce(
      (s, item) => s + item.price * item.quantity,
      0
    );
    return sum + invoiceTotal;
  }, 0);

  /* -------------------- DATE-WISE -------------------- */
  const dateRangeInvoices = useMemo(() => {
    if (!fromDate) return [];

    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0); // start of day

    const end = toDate ? new Date(toDate) : new Date(fromDate);
    end.setHours(23, 59, 59, 999); // end of day

    return invoices.filter((i) => {
      const invoiceDate = new Date(i.createdAt);
      return invoiceDate >= start && invoiceDate <= end;
    });
  }, [fromDate, toDate, invoices]);

  /* -------------------- TOTAL SALES -------------------- */
  const totalSales = useMemo(() => {
    return dateRangeInvoices.reduce((sum, inv) => {
      const invoiceTotal = inv.items.reduce(
        (s, item) => s + item.price * item.quantity,
        0
      );
      return sum + invoiceTotal;
    }, 0);
  }, [dateRangeInvoices]);


  if (loading) {
    return <p className="p-6 text-gray-500">Loading reports...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Simple Reports</h1>
      <button
        onClick={() => {
          setSelectedCustomer("");
          setFromDate("");
          setToDate("");
        }}
        className="px-4 py-2 bg-gray-300 rounded text-sm"
      >
        Clear Filters
      </button>

      {/* CUSTOMER-WISE REPORT */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-3">Customer-wise Invoices</h2>
        <div className="flex gap-3 mb-3">
          <p className="text-sm text-gray-600">
            Total Invoices: {customerInvoices.length}
          </p>
          <p className="text-sm text-gray-600">
            Total : {totalCustomerAmount}
          </p>
        </div>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border px-3 py-2 rounded mb-3"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {selectedCustomer && customerInvoices.length === 0 ? (
          <p className="text-sm text-gray-500">
            No invoices found for this customer
          </p>
        ) : (
          <InvoiceTable data={customerInvoices} />
        )}
      </div>

      {/* DATE-WISE REPORT */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-3">Date-wise Invoices</h2>
        <div className="flex gap-3 mb-2">
          <p className="text-sm text-gray-600">
            Total Invoices: {dateRangeInvoices.length}
          </p>
          <p className="text-sm text-gray-600">
            Total Sales: ₹{totalSales}
          </p>
        </div>

        <div className="flex gap-3 mb-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        {fromDate && dateRangeInvoices.length === 0 ? (
          <p className="text-sm text-gray-500">
            No invoices found for selected date(s)
          </p>
        ) : (
          <InvoiceTable data={dateRangeInvoices} />
        )}

        {/* TOTAL SALES */}
        {fromDate && (
          <div className="text-right font-bold mt-3">
            Total Sales: ₹{totalSales}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------- TABLE -------------------- */
const InvoiceTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
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
        {data.map((inv) => {
          const total = inv.items.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );

          return (
            <tr key={inv._id} className="text-center">
              <td className="border p-2">{inv.invoiceNo}</td>
              <td className="border p-2">
                {inv.customerId?.name}
              </td>
              <td className="border p-2">
                {new Date(inv.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2 font-semibold">
                Rs. {total.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Reports;
