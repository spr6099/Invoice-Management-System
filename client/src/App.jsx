import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout";
import CustomerList from "./pages/customers/Customer";
import ItemList from "./pages/items/ItemList";
import InvoiceCreate from "./pages/invoice/InvoiceCreate";
import InvoiceList from "./pages/invoice/InvoiceList";
import Reports from "./pages/reports/Reports";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/invoices/create" element={<InvoiceCreate />} />
          <Route path="/invoices/list" element={<InvoiceList />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
