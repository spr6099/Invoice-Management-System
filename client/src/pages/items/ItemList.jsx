import { useMemo, useState } from "react";
import { addItem, deleteItems, getItems, updateItems } from "../../api/itemApi";
import { useData } from "../../hooks/useData";
import Loader from "../../components/common/Loader";

const ItemList = () => {
    const { items, fetchDetails, loading, error } = useData()
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [load, setload] = useState(true)

    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        stock: "",
    });

    /* ---------- Edit ---------- */
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditData(item);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!editData.name || editData.price <= 0 || editData.stock < 0) {
            alert("Please enter valid item details");
            return;
        }

        try {
            await updateItems(editId, editData);
            fetchDetails();
            setEditId(null);
        } catch (error) {
            alert("Update failed");
        }
    };


    /* ---------- Totals (AUTO) ---------- */
    const totalStock = useMemo(
        () => items.reduce((sum, i) => sum + Number(i.stock), 0),
        [items]
    );

    const totalValue = useMemo(
        () =>
            items.reduce(
                (sum, i) => sum + Number(i.price) * Number(i.stock),
                0
            ),
        [items]
    );

    /* ---------- Delete ---------- */
    const handleDelete = async (id) => {
        if (window.confirm("Delete this item?")) {
            await deleteItems(id)
            fetchDetails()
        }
    };

    /* ---------- Add Item ---------- */
    const handleAddItem = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const itemPayload = {
                name: newItem.name.trim(),
                price: Number(newItem.price),
                stock: Number(newItem.stock),
            };
            await addItem(itemPayload);

            setNewItem({ name: "", price: "", stock: "" });
            setShowModal(false);
            fetchDetails();
        } catch (error) {
            alert("Failed to add item");
        } finally {
            setSaving(false);
        }
    };



    if (loading) {
        return (
            <Loader text="loading" />
        );
    }
    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                {error}
            </div>
        );
    }


    return (
        <div className="bg-white rounded-xl shadow p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Items</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                    + Add Item
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Item Name</th>
                            <th className="p-2 border">Price (₹)</th>
                            <th className="p-2 border">Stock</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item._id} className="text-center">
                                {/* Name */}
                                <td className="border p-2">
                                    {editId === item._id ? (
                                        <input
                                            name="name"
                                            value={editData.name}
                                            onChange={handleEditChange}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </td>

                                {/* Price */}
                                <td className="border p-2">
                                    {editId === item._id ? (
                                        <input
                                            type="number"
                                            name="price"
                                            value={editData.price}
                                            onChange={handleEditChange}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        <>
                                            ₹{Number(item.price).toLocaleString()}

                                        </>
                                    )}
                                </td>

                                {/* Stock */}
                                <td className="border p-2">
                                    {editId === item._id ? (
                                        <input
                                            type="number"
                                            name="stock"
                                            value={editData.stock}
                                            onChange={handleEditChange}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        item.stock
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="border p-2 space-x-2">
                                    {editId === item._id ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs"
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
                                                onClick={() => handleEdit(item)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
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

            {/* ---------- Totals ---------- */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="font-semibold">
                    Total Stock: <span className="text-blue-600">{totalStock}</span>
                </p>
                <p className="font-semibold">
                    Total Inventory Value:{" "}
                    <span className="text-green-600">
                        ₹{totalValue.toLocaleString()}
                    </span>
                </p>
            </div>

            {/* ---------- Add Item Modal ---------- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">Add Item</h3>

                        <form onSubmit={handleAddItem} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={newItem.name}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, name: e.target.value })
                                }
                                required
                                className="w-full border rounded px-3 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={newItem.price}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, price: e.target.value })
                                }
                                required
                                className="w-full border rounded px-3 py-2"
                            />

                            <input
                                type="number"
                                placeholder="Stock"
                                value={newItem.stock}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, stock: e.target.value })
                                }
                                required
                                className="w-full border rounded px-3 py-2"
                            />

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                >
                                    {saving ? "Adding..." : "Add"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemList;
