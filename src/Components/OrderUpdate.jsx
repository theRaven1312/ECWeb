// Components/UpdateOrderStatus.jsx
import React, {useState} from "react";
import axiosJWT from "../utils/axiosJWT";

const OrderUpdate = ({order, isOpen, onClose, onUpdate}) => {
    const [newStatus, setNewStatus] = useState(order?.status || "pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const statusOptions = [
        {
            value: "pending",
            label: "Pending",
            color: "bg-yellow-100 text-yellow-800",
            icon: "fa-clock",
        },
        {
            value: "delivering",
            label: "Delivering",
            color: "bg-indigo-100 text-indigo-800",
            icon: "fa-shipping-fast",
        },
        {
            value: "delivered",
            label: "Delivered",
            color: "bg-green-100 text-green-800",
            icon: "fa-check-circle",
        },
        {
            value: "cancelled",
            label: "Cancelled",
            color: "bg-red-100 text-red-800",
            icon: "fa-times-circle",
        },
        {
            value: "returned",
            label: "Returned",
            color: "bg-orange-100 text-orange-800",
            icon: "fa-undo",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("Authentication required");

            console.log("Updating order status:", order._id, "to:", newStatus);

            const response = await axiosJWT.put(
                `/api/v1/orders/${order._id}/status`,
                {
                    status: newStatus,
                }
            );

            console.log("Update response:", response.data);

            if (response.data.status === "SUCCESS") {
                onUpdate(response.data.order); // Update the order in parent component
                onClose(); // Close modal
                console.log("✅ Order status updated successfully");
            } else {
                throw new Error(
                    response.data.message || "Failed to update order"
                );
            }
        } catch (err) {
            console.error("❌ Update status error:", err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewStatus(order?.status || "pending");
        setError(null);
        onClose();
    };

    // Reset status when order changes
    React.useEffect(() => {
        if (order) {
            setNewStatus(order.status || "pending");
        }
    }, [order]);

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* ✅ Modal Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Update Order Status
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Order #{order.orderNumber || order._id.slice(-6)}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                        disabled={loading}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                {/* ✅ Order Summary */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Customer:</span>
                            <p className="font-medium text-blue-600">
                                {order.user?.name ||
                                    order.user?.email ||
                                    "Unknown"}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-600">Total:</span>
                            <p className="font-medium text-green-600">
                                ${order.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-600">
                                Current Status:
                            </span>
                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                                    statusOptions.find(
                                        (s) => s.value === order.status
                                    )?.color || "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {order.status || "Unknown"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Date:</span>
                            <p className="font-medium">
                                {order.createdAt
                                    ? new Date(
                                          order.createdAt
                                      ).toLocaleDateString()
                                    : "Unknown"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ✅ Status Update Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <i className="fa-solid fa-exclamation-triangle text-red-600 mr-2"></i>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* ✅ Status Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select New Status:
                        </label>
                        <div className="space-y-2">
                            {statusOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center cursor-pointer p-3 rounded-lg border transition-colors ${
                                        newStatus === option.value
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={option.value}
                                        checked={newStatus === option.value}
                                        onChange={(e) =>
                                            setNewStatus(e.target.value)
                                        }
                                        className="mr-3 text-blue-600"
                                        disabled={loading}
                                    />
                                    <i
                                        className={`fa-solid ${option.icon} mr-3 w-4 text-gray-400`}
                                    ></i>
                                    <div className="flex-1">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${option.color}`}
                                        >
                                            {option.label}
                                        </span>
                                        {newStatus === option.value && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                {option.value === "pending" &&
                                                    "Order is waiting to be processed"}
                                                {option.value ===
                                                    "delivering" &&
                                                    "Order is out for delivery"}
                                                {option.value === "delivered" &&
                                                    "Order has been delivered"}
                                                {option.value === "cancelled" &&
                                                    "Order has been cancelled"}
                                                {option.value === "returned" &&
                                                    "Order has been returned"}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            <i className="fa-solid fa-times mr-2"></i>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || newStatus === order.status}
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-save mr-2"></i>
                                    Update Status
                                </>
                            )}
                        </button>
                    </div>

                    {/* ✅ Status Change Warning */}
                    {newStatus !== order.status && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start">
                                <i className="fa-solid fa-info-circle text-yellow-600 mr-2 mt-0.5"></i>
                                <div className="text-sm">
                                    <p className="text-yellow-800 font-medium">
                                        Status Change
                                    </p>
                                    <p className="text-yellow-700">
                                        Order will change from{" "}
                                        <strong>{order.status}</strong> to{" "}
                                        <strong>{newStatus}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrderUpdate;
