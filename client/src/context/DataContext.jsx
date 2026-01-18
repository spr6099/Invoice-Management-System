import { createContext, useEffect, useState } from "react";
import { getCustomer } from "../api/customerApi";
import { getInvoices } from "../api/invoiveApi";
import { getItems } from "../api/itemApi";
import { useAuth } from "../hooks/useAuth";

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
    const { token } = useAuth()
    const [customers, setCustomers] = useState([])
    const [invoices, setInvoices] = useState([])
    const [items, setItems] = useState([])

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const fetchDetails = async () => {
        if (!token) return
        try {
            setLoading(true);
            setError("")
            const custRes = await getCustomer();
            const invRes = await getInvoices();
            const itemsData = await getItems();
            setCustomers(custRes?.customers || []);
            setInvoices(invRes?.invoices || []);
            setItems(itemsData?.items || []);
        } catch (err) {
            setError("Failed to load reports..");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (token) {
            fetchDetails();
        } else {
            // 🔄 Clear data on logout
            setCustomers([]);
            setInvoices([]);
            setItems([]);
            setLoading(false); // ✅ important

        }
    }, [token]);
    return (
        <DataContext.Provider value={{ customers, invoices, loading, error, setLoading, items, fetchDetails }}>

            {children}
        </DataContext.Provider>
    )
}