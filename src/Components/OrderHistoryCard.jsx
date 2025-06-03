import React from "react";

const OrderHistoryCard = ({order, onViewDetails}) => {
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

    if (!order) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Placed on{" "}
                            {new Date(order.date).toLocaleDateString()}
                        </p>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                    >
                        <i className={`fa-solid ${statusInfo.icon} mr-1`}></i>
                        {statusInfo.label}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {order.items} item{order.items > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Products Preview */}
            <div className="mb-4">
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {order.products &&
                        order.products.slice(0, 3).map((product, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 min-w-[250px]"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-image text-gray-400"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {product.quantity}
                                    </p>
                                </div>
                                <span className="font-bold text-gray-900 flex-shrink-0">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    {order.products && order.products.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-3 min-w-[100px]">
                            <span className="text-sm text-gray-600 font-medium">
                                +{order.products.length - 3} more
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                    onClick={() => onViewDetails && onViewDetails(order)}
                    className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-eye"></i>
                    View Details
                </button>
                {order.status === "delivered" && (
                    <button
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                        onClick={() => onReorder}
                    >
                        <i className="fa-solid fa-redo"></i>
                        Reorder
                    </button>
                )}
                {order.status === "pending" && (
                    <button className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2">
                        <i className="fa-solid fa-times"></i>
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryCard;
