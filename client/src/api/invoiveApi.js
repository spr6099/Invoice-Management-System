import axios from "../utils/axiosInstance";

/* ================= CREATE INVOICE ================= */
export const createInvoice = async (payload) => {
    console.log(payload)
  const res = await axios.post("/invoices", payload);
  return res.data;
};

/* ================= GET ALL INVOICES ================= */
export const getInvoices = async () => {
  const res = await axios.get("/invoices");
  return res.data;
};

/* ================= GET INVOICE BY ID ================= */
export const getInvoiceById = async (id) => {
  const res = await axios.get(`/invoices/${id}`);
  return res.data;
};

/* ================= CANCEL INVOICE ================= */
export const cancelInvoice = async (id) => {
  const res = await axios.put(`/invoices/${id}/cancel`);
  return res.data;
};
