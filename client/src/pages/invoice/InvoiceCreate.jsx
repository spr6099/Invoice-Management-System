import { useMemo, useState } from "react";

import { createInvoice } from "../../api/invoiveApi";
import { useData } from "../../hooks/useData";
import Loader from "../../components/common/Loader";

const InvoiceCreate = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const { customers, loading, error, items, setLoading, fetchDetails } = useData()
  /* -------------------- INVOICE LOGIC -------------------- */
  const addItem = (item) => {
    if (invoiceItems.find((i) => i._id === item._id)) return;

    setInvoiceItems((prev) => [
      ...prev,
      { ...item, quantity: 1, total: item.price },
    ]);
  };

  const updateQuantity = (id, qty) => {
    if (!Number.isFinite(qty) || qty <= 0) return;

    setInvoiceItems((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, quantity: qty, total: i.price * qty }
          : i
      )
    );
  };

  const removeItem = (id) => {
    setInvoiceItems((prev) => prev.filter((i) => i._id !== id));
  };

  const subTotal = useMemo(
    () => invoiceItems.reduce((sum, i) => sum + i.total, 0),
    [invoiceItems]
  );

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    if (invoiceItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerId: selectedCustomer,
        items: invoiceItems.map((i) => ({
          itemId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          total: i.total,
        })),
      };
      // console.log(payload)
      await createInvoice(payload);

      alert("Invoice created successfully!");
      setInvoiceItems([]);
      setSelectedCustomer("");

      await fetchDetails(); // refresh stock
    } catch (err) {
      alert(err?.response?.data?.message || "Invoice creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  { loading && <Loader /> }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* LEFT – INVOICE */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="text-xl font-bold">Create Invoice</h2>

        {/* Customer */}
        <div>
          <label className="font-semibold block mb-1">Customer</label>

          {customers.length === 0 ? (
            <p className="text-sm text-gray-500">No customers found</p>
          ) : (
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Invoice Table */}
        {invoiceItems.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No items added to invoice
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((i) => (
                  <tr key={i._id} className="text-center">
                    <td className="border p-2">{i.name}</td>
                    <td className="border p-2">₹{i.price}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="1"
                        max={i.stock}
                        value={i.quantity}
                        onChange={(e) =>
                          updateQuantity(i._id, Number(e.target.value))
                        }
                        className="border rounded px-2 w-16"
                      />
                    </td>
                    <td className="border p-2">₹{i.total}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => removeItem(i._id)}
                        className="text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="font-bold text-lg">
              Grand Total: ₹{subTotal}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600"
            }`}
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </div>

      {/* RIGHT – ITEMS */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Items</h3>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No items available</p>
        ) : (
          <div className="h-[420px] overflow-y-auto divide-y">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => item.stock > 0 && addItem(item)}
                className={`p-3 flex justify-between items-center cursor-pointer
                  ${item.stock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                  }`}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Stock: {item.stock}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCreate;
