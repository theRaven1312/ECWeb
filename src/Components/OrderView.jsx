import { set } from 'mongoose';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosJWT from '../utils/axiosJWT';
import axios from 'axios';

const OrderView = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [oderStatus, setOrderStatus] = useState('');
    const [filter, setFilter] = useState('all'); 

    const user = useSelector((state) => state.user);

    const fetchOrders = async (selectedFilter = filter) => {
        setLoading(true);
        setError(null);
        
        try {
            // ✅ Add authentication header
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                throw new Error('Authentication required');
            }

            if(selectedFilter === 'all') { selectedFilter = ''; } // Handle 'all' filter case
            const response = await axiosJWT.get(`/api/v1/orders?filter=${selectedFilter}`);
            
                // Log the response for debugging
            console.log(response);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

        //     if (!response.ok) {
        //         const errorData = await response.text();
        //         console.error('Error response:', errorData);
        //         throw new Error(`Failed to fetch orders: ${response.status}`);
        //     }

            const data = await response.data;
            
            console.log('API Response data:', data);

            if (data.status === 'SUCCESS') {
                // Backend returns { message, orders: [...], status }
                const ordersArray = data.orders || [];
                setOrders(Array.isArray(ordersArray) ? ordersArray : []);
            } else {
                // Handle error response
                throw new Error(data.message || 'Failed to fetch orders');
            }
            
        } catch (err) {
            console.error('Fetch orders error:', err);
            setError(err.message);
            setOrders([]); // ✅ Ensure orders is always an array
        } finally {
            setLoading(false);
        }
};

        const handleFilterChange = async (newFilter) => {
                setFilter(newFilter);
                await fetchOrders(newFilter);
        };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">All Orders</h1>
        <select value = {filter} onChange={(e) => handleFilterChange(e.target.value)} 
        className="mb-4 px-4 py-2 border-1 border-gray-300 rounded-3xl shadow-md">
                <option value="all">All Orders</option>
                <option value="pending">Pending Orders</option>
                <option value="delivered">Delivering Orders</option>
                <option value="cancelled">Cancelled Orders</option>
                <option value="shipped">Shipped Orders</option>
                <option value="returned">Returned Orders</option>
        </select>
        
        {loading ? (

        <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2">Loading orders...</p>
        </div>

        ) : error ? (

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                <i className="fa-solid fa-exclamation-triangle text-red-600 mr-2"></i>
                <p className="text-red-700">{error}</p>
                </div>
                <button 
                        onClick={fetchOrders}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                        Retry
                </button>
        </div>

        ) : (
        <div className='grid grid-cols-3 gap-5'>
                {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (

                        <div key={order._id} className="border border-gray-200 p-4 mb-4 rounded-lg shadow-sm max-w-md">
                                {/* ✅ Use orderNumber if available, fallback to _id */}
                                <h2 className="text-xl font-semibold mb-2">
                                        Order: {order.orderNumber || order._id}
                                </h2>
                                
                                {/* ✅ Safely display user info */}
                                <p className="text-gray-600 mb-2">
                                        <strong>User: </strong>
                                        <span className='text-blue-600'>
                                                {order.user?.name || order.user?.email || order.user || 'Unknown User'}
                                        </span>
                                        
                                </p>
                                
                                <div className="mb-3">
                                        <h3 className="font-medium text-gray-800 mb-1">Products:</h3>
                                        <ul className="space-y-1">
                                        {order.products && Array.isArray(order.products) ? (
                                                order.products.map((item, index) => (
                                                <li key={item.product?._id || index} className="text-gray-700 text-sm">
                                                        {/* ✅ Handle both populated and non-populated products */}
                                                        <span className="font-medium text-green-700">
                                                                {item.product?.name || `Product ${item.product}`}
                                                        </span>

                                                        <div> - Qty: {item.quantity}</div>
                                                        {item.size && <div>- Size: {item.size}</div>}
                                                        {item.color && <div> - Color: {item.color}</div>}
                                                        {item.price && <span> - ${item.price.toFixed(2)}</span>}
                                                </li>
                                                ))
                                        ) : (
                                                <li className="text-gray-500 text-sm">No products found</li>
                                        )}
                                        </ul>
                                </div>
                                
                                {/* ✅ Order details with safety checks */}
                                <div className="space-y-1">
                                        <p className="text-green-700">
                                                <strong className='text-gray-600'>Total:</strong> ${order.totalPrice?.toFixed(2) || '0.00'}
                                        </p>

                                        <p className="text-gray-600">
                                                <strong>Address:</strong> {order.shippingAddress || 'N/A'}
                                        </p>

                                        <p className="text-gray-600">
                                                <strong>Phone:</strong> {order.phone || 'N/A'}
                                        </p>

                                        <p className="text-gray-600">
                                                <strong>Status:</strong> 
                                                <span className={`ml-1 px-2 py-1 rounded text-xm ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status || 'Unknown'}
                                                </span>
                                        </p>

                                        <p className="text-gray-600">
                                                <strong>Ordered:</strong> {
                                                        order.createdAt 
                                                        ? new Date(order.createdAt).toLocaleDateString()
                                                        : order.dateOrdered 
                                                                ? new Date(order.dateOrdered).toLocaleDateString()
                                                                : 'Unknown'
                                                }
                                        </p>

                                        <p className="text-gray-600">
                                                <strong>Coupon: </strong> 
                                                <span className='text-red-500'>
                                                        {
                                                                order.appliedCoupon && order.appliedCoupon.code
                                                                ? `${order.appliedCoupon.code} - $${order.appliedCoupon.discountAmount.toFixed(2)} off`
                                                                : 'None'
                                                        }
                                                </span>
                                                
                                        </p>
                                </div>

                                </div>
                                ))
                                ) : (
                                        <div className="text-center py-8">
                                                <i className="fa-solid fa-shopping-cart text-gray-400 text-4xl mb-4"></i>
                                                <p className="text-gray-500 text-lg">No orders found</p>
                                                <p className="text-gray-400 text-sm">Orders will appear here once customers place them</p>
                                        </div>
                                )}
                        </div>
                )}
        </div>
        );
};

export default OrderView;
