import React, { useState } from 'react';
import axiosJWT from '../utils/axiosJWT';

const OrderDelete = ({ order, isOpen, onClose, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('Authentication required');

            console.log('Deleting order:', order._id);

            const response = await axiosJWT.delete(`/api/v1/orders/${order._id}`);

            console.log('Delete response:', response.data);

            if (response.data.status === 'SUCCESS') {
                onDelete(order._id); // Remove order from parent component
                onClose(); // Close modal
                console.log('✅ Order deleted successfully');
            } else {
                throw new Error(response.data.message || 'Failed to delete order');
            }
        } catch (err) {
            console.error('❌ Delete order error:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setConfirmText('');
        setError(null);
        onClose();
    };

    // Check if user typed the confirmation text correctly
    const isConfirmValid = confirmText.toLowerCase() === 'delete';

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* ✅ Modal Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <i className="fa-solid fa-exclamation-triangle text-red-600"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete Order
                            </h3>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                        disabled={loading}
                    >
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                {/* ✅ Order Details */}
                <div className="p-6 border-b bg-red-50">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Order Number:</span>
                            <span className="text-sm font-medium">
                                #{order.orderNumber || order._id.slice(-6)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Customer:</span>
                            <span className="text-sm font-medium">
                                {order.user?.name || order.user?.email || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`font-medium px-2 py-1 rounded text-xs ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'delivering' ? 'bg-indigo-100 text-indigo-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                order.status === 'returned' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {order.status || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <span className="text-sm font-medium text-red-600">
                                ${order.totalPrice?.toFixed(2) || '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Order Date:</span>
                            <span className="text-sm">
                                {order.createdAt 
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : 'Unknown'
                                }
                            </span>
                        </div>
                        
                        {/* ✅ Products List */}
                        <div className="mt-3">
                            <span className="text-sm text-gray-600">Products:</span>
                            <div className="mt-1 max-h-20 overflow-y-auto">
                                {order.products && Array.isArray(order.products) ? (
                                    <ul className="text-sm space-y-1">
                                        {order.products.map((item, index) => (
                                            <li key={index} className="text-gray-700">
                                                • {item.product?.name || `Product ${item.product}`} 
                                                <span className="text-gray-500"> (x{item.quantity})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No products found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Warning Message */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <i className="fa-solid fa-exclamation-triangle text-red-600 mr-2"></i>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <i className="fa-solid fa-warning text-yellow-600 mr-2 mt-0.5"></i>
                            <div className="text-sm">
                                <p className="text-yellow-800 font-medium mb-2">Warning: This action is irreversible!</p>
                                <ul className="text-yellow-700 space-y-1">
                                    <li>• The order will be permanently deleted from the system</li>
                                    <li>• Customer order history will be affected</li>
                                    <li>• This may impact sales reports and analytics</li>
                                    <li>• Consider updating status to "cancelled" instead</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Confirmation Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            disabled={loading}
                        />
                        {confirmText && !isConfirmValid && (
                            <p className="text-red-600 text-sm mt-1">
                                Please type "DELETE" exactly to confirm
                            </p>
                        )}
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
                            onClick={handleDelete}
                            disabled={loading || !isConfirmValid}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-trash mr-2"></i>
                                    Delete Order
                                </>
                            )}
                        </button>
                    </div>

                    {/* ✅ Alternative Actions */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Alternative actions:</strong>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClose}
                                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                            >
                                Cancel Order Instead
                            </button>
                            <button
                                onClick={handleClose}
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDelete;
