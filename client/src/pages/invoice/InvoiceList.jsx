import React, {  useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useData } from "../../hooks/useData";

const InvoiceList = () => {

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const { customers, invoices, loading, error } = useData()
console.log(invoices)
console.log(selectedCustomer)
  /* -------------------- FILTER -------------------- */
  const filteredInvoices = useMemo(() => {
    if (!selectedCustomer) return invoices;
    return invoices.filter(i => i.customerId._id === selectedCustomer);
  }, [selectedCustomer, invoices]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading reports...</p>;
  }
  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Invoice Reports</h1>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <div className="flex gap-3 items-center">
          <label className="font-medium">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Customers</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {filteredInvoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices found</p>
        ) : (
          <InvoiceTable data={filteredInvoices} />
        )}
      </div>
    </div>
  );
};






/* -------------------- TABLE -------------------- */
const InvoiceTable = ({ data }) => {
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Invoice No</th>
          <th className="border p-2">Customer</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Amount</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((inv) => {
          const total = inv.items.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          );

          return (
            <tr key={inv.invoiceNo} className="text-center">
              <td className="border p-2">{inv.invoiceNo}</td>
              <td className="border p-2">{inv.customerId.name}</td>
              <td className="border p-2">  {new Date(inv.createdAt).toLocaleDateString("en-GB")}
              </td>
              <td className="border p-2 font-semibold">₹{total}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => downloadInvoicePDF(inv)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                >
                  PDF
                </button>
                <button
                  onClick={() => shareInvoice(inv)}
                  className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                >
                  Share
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};



const downloadInvoicePDF = (invoice) => {
  const doc = new jsPDF("p", "mm", "a4");

  const MARGIN_LEFT = 20;
  const MARGIN_RIGHT = 190;

  /* -------------------- CALCULATIONS -------------------- */
  const subTotal = invoice.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* -------------------- SELLER -------------------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("East Repair Inc.", MARGIN_LEFT, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("1912 Banglore Lane", MARGIN_LEFT, 31);
  doc.text("Karnataka , NY 12210", MARGIN_LEFT, 36);

  /* -------------------- INVOICE TITLE -------------------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", 105, 25, { align: "center" });

  /* -------------------- INVOICE META -------------------- */
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoice.invoiceNo}`, MARGIN_RIGHT, 31, { align: "right" });
  doc.text(
    `Invoice Date: ${new Date(invoice.updatedAt).toLocaleDateString()}`,
    MARGIN_RIGHT,
    36,
    { align: "right" }
  );

  /* -------------------- BILL TO / SHIP TO -------------------- */
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", MARGIN_LEFT, 50);
  doc.text("Ship To", 100, 50);

  doc.setFont("helvetica", "normal");
  doc.text(invoice.customerId.name, MARGIN_LEFT, 56);
  doc.text(invoice.customerId.phone, MARGIN_LEFT, 62);
  doc.text(invoice.customerId.email, MARGIN_LEFT, 68);

  doc.text(invoice.userId.name, 100, 56);
  doc.text(invoice.userId.email, 100, 62);
  doc.text("Pattambi, Kerala 678589", 100, 68);

  /* -------------------- ITEMS TABLE (WITH SL NO) -------------------- */
  autoTable(doc, {
    startY: 80,
    margin: { left: MARGIN_LEFT, right: MARGIN_LEFT },
    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 10,
      halign: "center",
      valign: "middle",
    },

    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: "bold",
    },

    columnStyles: {
      0: { halign: "center", cellWidth: 12 }, // SL No
      2: { halign: "left" },                  // Description
      3: { halign: "right" },                 // Unit price
      4: { halign: "right" },                 // Amount
    },

    head: [["SL", "QTY", "DESCRIPTION", "UNIT PRICE", "AMOUNT"]],

    body: invoice.items.map((item, index) => [
      index + 1,
      item.quantity,
      item.name,
      `Rs. ${item.price.toFixed(2)}`,
      `Rs. ${(item.price * item.quantity).toFixed(2)}`,
    ]),
  });

  /* -------------------- TOTAL SECTION -------------------- */
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Subtotal", 140, finalY);
  doc.text(`Rs. ${subTotal.toFixed(2)}`, MARGIN_RIGHT, finalY, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", 140, finalY + 10);
  doc.text(`Rs. ${subTotal.toFixed(2)}`, MARGIN_RIGHT, finalY + 10, {
    align: "right",
  });

  /* -------------------- SIGNATURE -------------------- */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Authorized Signature", 140, finalY + 35);
  doc.text(invoice.userId.name, 140, finalY + 42);

  /* -------------------- FOOTER -------------------- */
  doc.setFontSize(9);
  doc.text(
    "Payment is due within 15 days. Please make checks payable to East Repair Inc.",
    MARGIN_LEFT,
    285
  );

  doc.save(`${invoice.invoiceNo}.pdf`);
};


/* -------------------- SHARE -------------------- */
const shareInvoice = async (invoice) => {
  const total = invoice.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const itemLines = invoice.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}
   Qty: ${item.quantity}
   Unit Price: Rs. ${item.price.toFixed(2)}
   Amount: Rs. ${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n\n");

  const text = `
INVOICE
----------------------------
Seller:
${invoice.userId.name}
${invoice.userId.email}
Koppam
Pattambi, Kerala 678589

Invoice No: ${invoice.invoiceNo}
Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}

----------------------------
Bill To:
Name: ${invoice.customerId.name}
Phone: ${invoice.customerId.phone}
Email: ${invoice.customerId.email}

----------------------------
Items:
${itemLines}

----------------------------
Subtotal: Rs. ${total.toFixed(2)}
TOTAL: Rs. ${total.toFixed(2)}

----------------------------
Thank you for your business!
`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Invoice ${invoice.invoiceNo}`,
        text,
      });
    } catch (error) {
      console.error("Share cancelled");
    }
  } else {
    await navigator.clipboard.writeText(text);
    alert("Invoice details copied to clipboard");
  }
};


export default InvoiceList;
