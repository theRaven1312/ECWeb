import React, {useState, useEffect} from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import axiosJWT from "../utils/axiosJWT";
import {useNavigate} from "react-router-dom";

const UserOrderHistory = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [message, setMessage] = useState("");
    const fetchUserOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosJWT.get("/api/v1/orders/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            });
            if (response.data.status === "SUCCESS") {
                setOrders(response.data.orders || []);
            } else {
                throw new Error(
                    response.data.message || "Failed to fetch orders"
                );
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
            setError(error.response?.data?.message || error.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                icon: "fa-clock",
                label: "Pending",
            },
            delivering: {
                color: "bg-blue-100 text-blue-800 border-blue-300",
                icon: "fa-truck",
                label: "Delivering",
            },
            delivered: {
                color: "bg-green-100 text-green-800 border-green-300",
                icon: "fa-check-circle",
                label: "Delivered",
            },
            cancelled: {
                color: "bg-red-100 text-red-800 border-red-300",
                icon: "fa-times-circle",
                label: "Cancelled",
            },
        };
        return (
            statusMap[status] || {
                color: "bg-gray-100 text-gray-800 border-gray-300",
                icon: "fa-question",
                label: "Unknown",
            }
        );
    };

    // Handle order details view
    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };
    const handleCloseOrderDetails = () => {
        setShowOrderDetails(false);
        setSelectedOrder(null);
    };
    const handleReorder = (order) => {
        if (order.products && order.products.length > 0) {
            if (order.products.length === 1) {
                const productId =
                    order.products[0].product?._id || order.products[0].product;
                if (productId) {
                    navigate(`/product/${productId}`);
                }
            } else {
                const productId =
                    order.products[0].product?._id || order.products[0].product;
                if (productId) {
                    navigate(`/product/${productId}`);
                }
            }
        }
    };

    // Handle cancel order functionality
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        setProcessingOrderId(orderId);
        try {
            const response = await axiosJWT.put(
                `/api/v1/orders/${orderId}/status`,
                {
                    status: "cancelled",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );

            if (response.data.status === "SUCCESS") {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? {...order, status: "cancelled"}
                            : order
                    )
                );
                alert("Order cancelled successfully!");
            } else {
                throw new Error(
                    response.data.message || "Failed to cancel order"
                );
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to cancel order"
            );
        } finally {
            setProcessingOrderId(null);
        }
    };
    const filteredOrders =
        filter === "all"
            ? orders
            : orders.filter((order) => order.status === filter);

    return (
        <div className="w-full h-full p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order History
                </h2>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Filter Section */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {[
                        {value: "all", label: "All Orders", icon: "fa-list"},
                        {value: "pending", label: "Pending", icon: "fa-clock"},
                        {
                            value: "delivering",
                            label: "Delivering",
                            icon: "fa-truck",
                        },
                        {
                            value: "delivered",
                            label: "Delivered",
                            icon: "fa-check-circle",
                        },
                        {
                            value: "cancelled",
                            label: "Cancelled",
                            icon: "fa-times-circle",
                        },
                    ].map((filterOption) => (
                        <button
                            key={filterOption.value}
                            onClick={() => setFilter(filterOption.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                filter === filterOption.value
                                    ? "bg-black text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <i className={`fa-solid ${filterOption.icon}`}></i>
                            {filterOption.label}
                            {filterOption.value === "all" && (
                                <span className="ml-1 bg-white text-black px-2 py-1 rounded-full text-xs">
                                    {orders.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>{" "}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    <span className="ml-3 text-gray-600">
                        Loading orders...
                    </span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <i className="fa-solid fa-exclamation-triangle text-red-600 mr-2"></i>
                        <p className="text-red-700">{error}</p>
                    </div>
                    <button
                        onClick={fetchUserOrders}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Orders List */}
            {!loading && !error && (
                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div className="flex items-center gap-4 mb-2 md:mb-0">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    #
                                                    {order.orderNumber ||
                                                        order._id?.slice(-6)}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on{" "}
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                                            >
                                                <i
                                                    className={`fa-solid ${statusInfo.icon} mr-1`}
                                                ></i>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">
                                                $
                                                {order.totalPrice?.toFixed(2) ||
                                                    "0.00"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.products?.length || 0}{" "}
                                                item
                                                {(order.products?.length || 0) >
                                                1
                                                    ? "s"
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Products Preview */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                            {order.products &&
                                                order.products
                                                    .slice(0, 3)
                                                    .map(
                                                        (
                                                            productItem,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 min-w-[250px]"
                                                            >
                                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <i className="fa-solid fa-image text-gray-400"></i>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 truncate">
                                                                        {productItem
                                                                            .product
                                                                            ?.name ||
                                                                            "Product"}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        Qty:{" "}
                                                                        {
                                                                            productItem.quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <span className="font-bold text-gray-900 flex-shrink-0">
                                                                    $
                                                                    {productItem.price?.toFixed(
                                                                        2
                                                                    ) || "0.00"}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                            {order.products &&
                                                order.products.length > 3 && (
                                                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 min-w-[100px]">
                                                        <span className="text-sm text-gray-600 font-medium">
                                                            +
                                                            {order.products
                                                                .length -
                                                                3}{" "}
                                                            more
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() =>
                                                handleViewOrderDetails(order)
                                            }
                                            className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                            View Details
                                        </button>{" "}
                                        {order.status === "delivered" && (
                                            <button
                                                onClick={() =>
                                                    handleReorder(order)
                                                }
                                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <i className="fa-solid fa-redo"></i>
                                                Reorder
                                            </button>
                                        )}
                                        {order.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    handleCancelOrder(order._id)
                                                }
                                                disabled={
                                                    processingOrderId ===
                                                    order._id
                                                }
                                                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                                                    processingOrderId ===
                                                    order._id
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            >
                                                {processingOrderId ===
                                                order._id ? (
                                                    <>
                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                        Cancelling...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-times"></i>
                                                        Cancel Order
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-shopping-cart text-gray-400 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Orders Found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {filter === "all"
                                    ? "You haven't placed any orders yet."
                                    : `No ${filter} orders found.`}
                            </p>
                            {filter !== "all" && (
                                <button
                                    onClick={() => setFilter("all")}
                                    className="text-black hover:text-gray-800 font-medium"
                                >
                                    View all orders
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            <OrderDetailsModal
                showOrderDetails={showOrderDetails}
                selectedOrder={selectedOrder}
                onClose={handleCloseOrderDetails}
            />
        </div>
    );
};

export default UserOrderHistory;
