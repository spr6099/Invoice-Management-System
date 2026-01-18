import { useEffect, useState } from "react";
import {
    deleteCustomer,
    getCustomer,
    registerCustomer,
    updateCustomer,
} from "../../api/customerApi";

const INITIAL_CUSTOMER = {
    name: "",
    phone: "",
    email: "",
    address: "",
};
import { validateCustomer } from "../../utils/validators/customerValidation";
const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState(INITIAL_CUSTOMER);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    /* ================= FETCH ================= */
    const fetchCustomers = async () => {
        try {
            const data = await getCustomer();
            setCustomers(data.customers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    /* ================= EDIT ================= */
    const handleEdit = (customer) => {
        setEditId(customer._id);
        setEditData(customer);
    };

    const handleEditChange = (e) => {
        setEditData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        const errorMessage = validateCustomer(editData);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        try {
            setLoading(true);

            await updateCustomer(editId, editData);
            fetchCustomers()
            setError("")
            setEditId(null);
        } catch (error) {
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };


    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer?")) return;

        try {
            await deleteCustomer(id);
            setCustomers((prev) => prev.filter((c) => c._id !== id));
        } catch (error) {
            alert("Delete failed");
        }
    };



    /* ================= ADD ================= */
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        const errorMessage = validateCustomer(newCustomer);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
        try {
            setLoading(true);

            const data = await registerCustomer(newCustomer);

            setCustomers((prev) => [data.customer, ...prev]);
            setNewCustomer(INITIAL_CUSTOMER);
            setShowModal(false);
            setError("")
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Customers</h2>
                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                    + Add Customer
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            {["Name", "Phone", "Email", "Address", "Actions"].map((h) => (
                                <th key={h} className="p-2 border">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((c) => (
                            <tr key={c._id} className="text-center">
                                {["name", "phone", "email", "address"].map((field) => (
                                    <td key={field} className="border p-2">
                                        {editId === c._id ? (
                                            <input
                                                name={field}
                                                value={editData[field]}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        ) : (
                                            c[field]
                                        )}
                                    </td>
                                ))}

                                <td className="border p-2 space-x-2">
                                    {editId === c._id ? (
                                        <>
                                            <button
                                                disabled={loading}
                                                onClick={handleSave}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditId(null)}
                                                className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(c)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">Add Customer</h3>
                    {error && <p className="text-red-500">{error}</p>}

                        <form onSubmit={handleAddCustomer} className="space-y-3">
                            {Object.keys(INITIAL_CUSTOMER).map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={field[0].toUpperCase() + field.slice(1)}
                                    value={newCustomer[field]}
                                    onChange={(e) =>
                                        setNewCustomer((prev) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }))
                                    }
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            ))}

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
