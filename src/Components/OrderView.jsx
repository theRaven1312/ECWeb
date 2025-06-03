import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosJWT from '../utils/axiosJWT';
import OrderUpdate from './OrderUpdate'; 
import OrderDelete from './OrderDelete';

const OrderView = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const user = useSelector((state) => state.user);

    // ✅ Enhanced fetchOrders with pagination
    const fetchOrders = async (selectedFilter = filter, page = currentPage) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                throw new Error('Authentication required');
            }

            // ✅ Handle 'all' filter and build query params
            const filterParam = selectedFilter === 'all' ? '' : selectedFilter;
            
            // ✅ Use appropriate endpoint based on user role
            const endpoint = `/api/v1/orders?filter=${filterParam}&page=${page}&limit=9`;

            console.log('🔍 Fetching orders:', { filter: selectedFilter, page, endpoint });

            const response = await axiosJWT.get(endpoint);
            const data = response.data;

            console.log('📊 API Response:', data);

            if (data.status === 'SUCCESS') {
                const ordersArray = data.orders || [];
                setOrders(Array.isArray(ordersArray) ? ordersArray : []);
                setPagination(data.pagination);
                
                console.log(`✅ Loaded ${ordersArray.length} orders (page ${page})`);
            } else {
                throw new Error(data.message || 'Failed to fetch orders');
            }
            
        } catch (err) {
            console.error('❌ Fetch orders error:', err);
            setError(err.response?.data?.message || err.message);
            setOrders([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = (order) => {
        console.log('Opening delete modal for order:', order._id);
        setSelectedOrder(order);
        setShowDeleteModal(true);
    };

    const handleOrderDelete = (deletedOrderId) => {
        console.log('Removing order from list:', deletedOrderId);
        setOrders(prevOrders => 
            prevOrders.filter(order => order._id !== deletedOrderId)
        );
        
        // ✅ Update pagination count
        if (pagination) {
            setPagination(prev => ({
                ...prev,
                totalOrders: prev.totalOrders - 1
            }));
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedOrder(null);
    };

    // ✅ Handle filter change (reset to page 1)
    const handleFilterChange = async (newFilter) => {
        console.log('🔄 Filter changing to:', newFilter);
        setFilter(newFilter);
        setCurrentPage(1); // ✅ Reset to first page
        await fetchOrders(newFilter, 1); // ✅ Fetch first page with new filter
    };

    // ✅ Handle page change
    const handlePageChange = async (newPage) => {
        if (newPage < 1 || (pagination && newPage > pagination.totalPages)) {
            return;
        }
        
        console.log('📄 Page changing to:', newPage);
        setCurrentPage(newPage);
        await fetchOrders(filter, newPage);
    };

    const handleUpdateStatus = (order) => {
        console.log('Opening update modal for order:', order._id);
        setSelectedOrder(order);
        setShowUpdateModal(true);
    };

    const handleOrderUpdate = (updatedOrder) => {
        console.log('Updating order in list:', updatedOrder._id);
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order._id === updatedOrder._id ? updatedOrder : order
            )
        );
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedOrder(null);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const PaginationComponent = () => {
        if (!pagination || pagination.totalPages <= 1) return null;

        const { currentPage, totalPages, hasNext, hasPrev, startIndex, endIndex, totalOrders } = pagination;

        const getPageNumbers = () => {
            const pages = [];
            const maxVisible = 5;
            
            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + maxVisible - 1);
                
                if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push('...');
                }
                
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }
                
                if (end < totalPages) {
                    if (end < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                }
            }
            
            return pages;
        };

        return (
            <div className="mt-6 flex flex-col items-center space-y-3">
                {/* ✅ Results info */}
                <div className="text-sm text-gray-600">
                    Showing {startIndex}-{endIndex} of {totalOrders} orders
                    {filter !== 'all' && ` (filtered by: ${filter})`}
                </div>

                {/* ✅ Pagination controls */}
                <div className="flex items-center space-x-2">
                    {/* Previous button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrev || loading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            !hasPrev || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                        <span className="ml-1 hidden sm:inline">Previous</span>
                    </button>

                    {/* Page numbers */}
                    <div className="flex space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                disabled={loading || page === '...'}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    page === currentPage
                                        ? 'bg-black text-white'
                                        : page === '...'
                                        ? 'text-gray-400 cursor-default'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNext || loading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            !hasNext || loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <span className="mr-1 hidden sm:inline">Next</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                {/* ✅ Quick page jump (for large datasets) */}
                {totalPages > 10 && (
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Go to page:</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= totalPages) {
                                    handlePageChange(page);
                                }
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            disabled={loading}
                        />
                        <span className="text-gray-600">of {totalPages}</span>
                    </div>
                )}
            </div>
        );
    };

    // ✅ Debug info component
    const DebugInfo = () => {
        if (process.env.NODE_ENV !== 'development') return null;
        
        return (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <div><strong>Debug Info:</strong></div>
                <div>Filter: <span className="font-mono">{filter}</span></div>
                <div>Page: <span className="font-mono">{currentPage}</span></div>
                <div>Orders: <span className="font-mono">{orders.length}</span></div>
                {pagination && (
                    <div>Pagination: <span className="font-mono">
                        {pagination.currentPage}/{pagination.totalPages} 
                        ({pagination.totalOrders} total)
                    </span></div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>
            
            {/* ✅ Debug info */}
            {/* <DebugInfo /> */}
            
            {/* ✅ Filter dropdown */}
            <div className="mb-6">
                <div className="flex items-center space-x-4">
                    <select 
                        value={filter} 
                        onChange={(e) => handleFilterChange(e.target.value)} 
                        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending Orders</option>
                        <option value="delivering">Delivering Orders</option>
                        <option value="delivered">Delivered Orders</option>
                        <option value="cancelled">Cancelled Orders</option>
                        <option value="returned">Returned Orders</option>
                    </select>
                    
                    {/* ✅ Results summary */}
                    {pagination && !loading && (
                        <span className="text-sm text-gray-600">
                            {pagination.totalOrders} {filter === 'all' ? '' : filter} orders found
                        </span>
                    )}
                </div>
            </div>
            
            {loading ? (
                <div className="text-center text-gray-500 py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading orders...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <i className="fa-solid fa-exclamation-triangle text-red-600 mr-2"></i>
                        <p className="text-red-700">{error}</p>
                    </div>
                    <button 
                        onClick={() => fetchOrders(filter, currentPage)}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* ✅ Orders grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order._id} className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    {/* ✅ Order header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-lg font-semibold">
                                            Order #{order.orderNumber || order._id.slice(-6)}
                                        </h2>

                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'delivering' ? 'bg-purple-100 text-purple-800' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            order.status === 'returned' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status || 'Unknown'}
                                        </span>
                                    </div>
                                    
                                    {/* ✅ Customer info */}
                                        <p className="text-gray-600 mb-2">
                                                <strong>Customer: </strong>
                                                <span className='text-blue-600'>
                                                        {order.user?.name || order.user?.email || 'Unknown User'}
                                                </span>
                                        </p>

                                        {/* ✅ Shipping address */}
                                        <p className="text-gray-600 mb-2">
                                                <strong>Address: </strong>
                                                <span>
                                                        {order.shippingAddress || 'No address provided'}
                                                </span>
                                        </p>

                                         <p className="text-gray-600 mb-2">
                                                <strong>Phone: </strong>
                                                <span>
                                                        {order.phone || 'No phone provided'}
                                                </span>
                                        </p>
                                    
                                    {/* ✅ Products section */}
                                    <div className="mb-3">
                                        <h3 className="font-medium text-gray-800 mb-1"><strong>Products:</strong></h3>
                                        <div className="overflow-y-auto">
                                            <ul className="space-y-2">
                                                {order.products && Array.isArray(order.products) ? (
                                                    order.products.map((item, index) => (
                                                        <li key={item.product?._id || index} className="text-gray-700 bg-gray-50 p-2 rounded">
                                                            <div className="font-medium text-green-700">
                                                                {item.product?.name || `Product ${item.product}`}
                                                            </div>
                                                            
                                                            <div className="flex flex-wrap gap-1 justify-between text-gray-600">
                                                                <span>Qty: {item.quantity}</span>
                                                                {item.price && <span>${item.price.toFixed(2)}</span>}
                                                                {item.size && <span>Size: {item.size}</span>}
                                                                {item.color && <span>Color: {item.color}</span>}
                                                            </div>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-500">No products found</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    {/* ✅ Order summary */}
                                    <div className="space-y-1 border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total:</span>
                                            <span className="font-bold text-green-700">
                                                ${order.totalPrice?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>

                                        <div className="text-gray-600">
                                            <strong>Date:</strong> 
                                            <span className="ml-1">
                                                {order.createdAt 
                                                    ? new Date(order.createdAt).toLocaleDateString()
                                                    : 'Unknown'
                                                }
                                            </span>
                                        </div>

                                        {order.appliedCoupon && order.appliedCoupon.code && (
                                            <div className="text-gray-600">
                                                <strong>Coupon:</strong> 
                                                <span className='ml-1 text-red-500'>
                                                    {order.appliedCoupon.code}
                                                    {order.appliedCoupon.discountAmount && 
                                                        ` (-$${order.appliedCoupon.discountAmount.toFixed(2)})`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ✅ Admin actions */}
                                    {user?.role === 'admin' && (
                                        <div className="mt-3 pt-3 border-t flex gap-2">
                                            <button className="flex-1 bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
                                                onClick={() => handleUpdateStatus(order)}
                                            >
                                                Update Status
                                            </button>
                                            <button className="flex-1 bg-red-800 text-white px-3 py-1 rounded text-xs hover:bg-red-500 transition-colors"
                                                onClick={() => handleDeleteOrder(order)}
                                            >
                                                Delete Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <i className="fa-solid fa-shopping-cart text-gray-400 text-4xl mb-4"></i>
                                <p className="text-gray-500 text-lg">
                                    {filter === 'all' 
                                        ? 'No orders found' 
                                        : `No ${filter} orders found`
                                    }
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {filter === 'all' 
                                        ? 'Orders will appear here once customers place them'
                                        : 'Try selecting a different filter or check back later'
                                    }
                                </p>
                                {filter !== 'all' && (
                                    <button 
                                        onClick={() => handleFilterChange('all')}
                                        className="mt-3 text-blue-500 hover:text-blue-700 underline"
                                    >
                                        Show all orders
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ✅ Pagination component */}
                    <PaginationComponent />

                    <OrderUpdate
                        order={selectedOrder}
                        isOpen={showUpdateModal}
                        onClose={handleCloseModal}
                        onUpdate={handleOrderUpdate}
                    />

                    <OrderDelete
                        order={selectedOrder}
                        isOpen={showDeleteModal}
                        onClose={handleCloseDeleteModal}
                        onDelete={handleOrderDelete}
                    />
                </>
            )}
        </div>
    );
};

export default OrderView;
