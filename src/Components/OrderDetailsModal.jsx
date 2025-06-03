import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const OrderDetailsModal = ({showOrderDetails, selectedOrder, onClose}) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOrderData = async () => {
        setLoading(true);
        try {
            const response = await axiosJWT.get(
                `/api/v1/orders/${selectedOrder._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            if (response.data.status === "SUCCESS") {
                setOrder(response.data.order);
                console.log(
                    "Order data fetched successfully:",
                    response.data.order
                );
            } else {
                throw new Error(
                    response.data.message || "Failed to fetch order"
                );
            }
        } catch (error) {
            console.error("Error fetching order data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showOrderDetails && selectedOrder) {
            fetchOrderData();
        }
    }, [showOrderDetails, selectedOrder]);

    // Early return after all hooks
    if (!showOrderDetails || !selectedOrder) return null;

    // Get status display information
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

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        <span className="ml-2">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="text-center">
                        <p>No order data available</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Order Details
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {order.orderNumber}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                {/* Order Info */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Status
                            </label>
                            <div className="mt-2">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}
                                >
                                    <i
                                        className={`fa-solid ${statusInfo.icon} mr-2`}
                                    ></i>
                                    {statusInfo.label}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Order Date
                            </label>
                            <p className="mt-2 text-sm text-gray-900 font-medium">
                                {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Shipping Information
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg flex gap-10">
                            <div className="flex items-start">
                                <i className="fa-solid fa-location-dot text-gray-500 mt-1 mr-3"></i>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Delivery Address
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {order.shippingAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fa-solid fa-phone text-gray-500 mt-1 mr-3"></i>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Delivery Phone Number
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {order.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Products ({selectedOrder.items} items)
                        </h4>
                        <div className="space-y-4">
                            {order.products.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={item.product.image_url}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="w-[80%] font-semibold text-gray-900 word-break-all">
                                            {item.product.name}
                                        </h5>
                                        <div className="flex-center-between">
                                            <div className="flex gap-5 mt-2">
                                                <span className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Color: {item.color}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    Size: {item.size}
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-900">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4 flex flex-col gap-4">
                        {order.appliedCoupon && (
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                    Subtotal
                                </span>
                                <span className="text-xl font-bold text-gray-600">
                                    $
                                    {order.products
                                        .reduce(
                                            (sum, item) =>
                                                sum +
                                                item.price * item.quantity,
                                            0
                                        )
                                        .toFixed(2)}
                                </span>
                            </div>
                        )}
                        {order.appliedCoupon && (
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                    Coupon Discount
                                </span>
                                <span className="text-xl font-bold text-red-600">
                                    -$
                                    {order.appliedCoupon.discountAmount.toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">
                                Total
                            </span>
                            <span className="text-xl font-bold text-green-600">
                                ${order.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
