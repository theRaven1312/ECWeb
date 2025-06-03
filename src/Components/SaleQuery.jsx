import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import axiosJWT from "../utils/axiosJWT";

const SaleQuery = () => {
    const user = useSelector((state) => state.user);

    const [revenueData, setRevenueData] = useState({
        loading: true,
        error: null,
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        topProducts: [],
        recentOrders: [],
        statusBreakdown: {},
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    });
    const [filteredData, setFilteredData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        topProducts: [],
        recentOrders: [],
        statusBreakdown: {},
    });

    const [showFiltered, setShowFiltered] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false); // Fetch revenue data
    const fetchRevenueData = async () => {
        try {
            setRevenueData((prev) => ({...prev, loading: true, error: null}));

            const ordersResponse = await axiosJWT.get("/api/v1/orders", {
                params: {
                    page: 1,
                    limit: 1000,
                    filter: "all",
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                },
            });

            if (ordersResponse.data.status === "SUCCESS") {
                const orders = ordersResponse.data.orders || [];
                const metrics = calculateRevenueMetrics(orders);
                const filtered = filterDataByDateRange(orders, dateRange);

                setRevenueData((prev) => ({
                    ...prev,
                    ...metrics,
                    loading: false,
                    allOrders: orders, // Store all orders for filtering
                }));

                setFilteredData(filtered);
            }
        } catch (error) {
            console.error("Error fetching revenue data:", error);
            setRevenueData((prev) => ({
                ...prev,
                loading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to fetch revenue data",
            }));
        }
    };

    // Calculate revenue metrics from orders
    const calculateRevenueMetrics = (orders) => {
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        let totalRevenue = 0;
        let todayRevenue = 0;
        let monthlyRevenue = 0;
        let pendingOrders = 0;
        let completedOrders = 0;
        const statusBreakdown = {};
        const productSales = {};
        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderValue = order.totalPrice || 0;

            const todayDateOnly = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            if (
                now.getFullYear() === todayDateOnly.getFullYear() &&
                now.getMonth() === todayDateOnly.getMonth() &&
                now.getDate() === todayDateOnly.getDate() &&
                order.status === "delivered"
            ) {
                todayRevenue += orderValue;
            }

            // Monthly revenue - check if order is from current month
            if (
                orderDate.getFullYear() === now.getFullYear() &&
                orderDate.getMonth() === now.getMonth() &&
                order.status === "delivered"
            ) {
                monthlyRevenue += orderValue;
            }

            const status = order.status || "unknown";
            statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;

            if (status === "pending") {
                pendingOrders++;
            } else if (status === "delivered") {
                completedOrders++;
                totalRevenue += orderValue;
            }

            if (order.products && Array.isArray(order.products)) {
                order.products.forEach((item) => {
                    const productName = item.product?.name || "Unknown Product";
                    if (!productSales[productName]) {
                        productSales[productName] = {quantity: 0, revenue: 0};
                    }
                    productSales[productName].quantity += item.quantity;
                    productSales[productName].revenue +=
                        item.price * item.quantity;
                });
            }
        });

        // Get top 5 products by revenue
        const topProducts = Object.entries(productSales)
            .map(([name, data]) => ({name, ...data}))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Get recent orders (last 5)
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        const averageOrderValue =
            completedOrders > 0 ? totalRevenue / completedOrders : 0;

        console.log("Revenue Metrics Debug:", {
            totalOrders: orders.length,
            totalRevenue,
            todayRevenue,
            monthlyRevenue,
            completedOrders,
            pendingOrders,
            averageOrderValue,
            currentDate: now.toISOString(),
            todayDate: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            ).toISOString(),
        });

        return {
            totalRevenue,
            totalOrders: orders.length,
            averageOrderValue,
            pendingOrders,
            completedOrders,
            todayRevenue,
            monthlyRevenue,
            topProducts,
            recentOrders,
            statusBreakdown,
        };
    };

    // Filter data by date range
    const filterDataByDateRange = (orders, dateRange) => {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Include full end date

        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
        });

        return calculateRevenueMetrics(filteredOrders);
    }; // Handle date range change
    const handleDateRangeChange = (field, value) => {
        const newDateRange = {...dateRange, [field]: value};
        setDateRange(newDateRange);

        // Re-filter data with new date range if we have orders
        if (revenueData.allOrders && revenueData.allOrders.length > 0) {
            setFilterLoading(true);
            setTimeout(() => {
                const filtered = filterDataByDateRange(
                    revenueData.allOrders,
                    newDateRange
                );
                setFilteredData(filtered);
                setFilterLoading(false);
            }, 300); // Small delay to show loading state
        }
    }; // Reset date range to default (last 30 days)
    const resetDateRange = () => {
        const newDateRange = {
            startDate: new Date(new Date().setDate(new Date().getDate() - 30))
                .toISOString()
                .split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
        };
        setDateRange(newDateRange);
    }; // Set preset date ranges
    const setPresetDateRange = (preset) => {
        const today = new Date();
        let startDate, endDate;

        switch (preset) {
            case "today":
                startDate = endDate = today;
                break;
            case "yesterday":
                startDate = endDate = new Date(
                    today.setDate(today.getDate() - 1)
                );
                break;
            case "last7days":
                startDate = new Date(today.setDate(today.getDate() - 7));
                endDate = new Date();
                break;
            case "last30days":
                startDate = new Date(today.setDate(today.getDate() - 30));
                endDate = new Date();
                break;
            case "thisMonth":
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date();
                break;
            case "lastMonth":
                const lastMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1
                );
                startDate = lastMonth;
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            default:
                return;
        }

        const newDateRange = {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
        };

        setDateRange(newDateRange);

        // Auto-apply filter when preset is selected
        if (revenueData.allOrders && revenueData.allOrders.length > 0) {
            setFilterLoading(true);
            setShowFiltered(true);
            setTimeout(() => {
                const filtered = filterDataByDateRange(
                    revenueData.allOrders,
                    newDateRange
                );
                setFilteredData(filtered);
                setFilterLoading(false);
            }, 300);
        }
    };
    useEffect(() => {
        if (user?.access_token) {
            fetchRevenueData();
        }
    }, [user]); // Remove dateRange dependency to avoid infinite loop

    // Separate effect for updating filtered data when date range changes
    useEffect(() => {
        if (revenueData.allOrders && revenueData.allOrders.length > 0) {
            const filtered = filterDataByDateRange(
                revenueData.allOrders,
                dateRange
            );
            setFilteredData(filtered);
        }
    }, [dateRange, revenueData.allOrders]); // Get current data based on filter toggle
    const getCurrentData = () => {
        return showFiltered ? filteredData : revenueData;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            delivering: "bg-blue-100 text-blue-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
            returned: "bg-orange-100 text-orange-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (!user?.access_token) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                    <i className="fa-solid fa-lock text-4xl text-gray-400 mb-4"></i>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">
                        Authentication Required
                    </h2>
                    <p className="text-gray-500">
                        Please log in to view revenue data.
                    </p>
                </div>
            </div>
        );
    }

    if (revenueData.loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                <p className="text-gray-600">Loading revenue data...</p>
            </div>
        );
    }

    if (revenueData.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <i className="fa-solid fa-exclamation-triangle text-red-600 mr-3"></i>
                    <div>
                        <h3 className="text-red-800 font-semibold">
                            Error Loading Data
                        </h3>
                        <p className="text-red-700">{revenueData.error}</p>
                        <button
                            onClick={fetchRevenueData}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {" "}
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Revenue Statement
                </h1>
                <p className="text-gray-600">
                    Comprehensive overview of sales performance and revenue
                    metrics
                </p>
            </div>{" "}
            {/* Date Range Filter */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col space-y-4">
                    {/* Preset Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setPresetDateRange("today")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setPresetDateRange("yesterday")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Yesterday
                        </button>
                        <button
                            onClick={() => setPresetDateRange("last7days")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setPresetDateRange("last30days")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setPresetDateRange("thisMonth")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setPresetDateRange("lastMonth")}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Last Month
                        </button>
                    </div>

                    {/* Custom Date Range */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) =>
                                        handleDateRangeChange(
                                            "startDate",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) =>
                                        handleDateRangeChange(
                                            "endDate",
                                            e.target.value
                                        )
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={resetDateRange}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-solid fa-refresh mr-2"></i>
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFiltered(!showFiltered)}
                                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                    showFiltered
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                <i
                                    className={`fa-solid ${
                                        showFiltered
                                            ? "fa-eye-slash"
                                            : "fa-filter"
                                    } mr-2`}
                                ></i>
                                {showFiltered
                                    ? "Show All Time"
                                    : "Apply Date Filter"}
                            </button>
                        </div>
                    </div>

                    {showFiltered && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-800">
                                <i className="fa-solid fa-info-circle mr-2"></i>
                                Showing data from{" "}
                                {new Date(
                                    dateRange.startDate
                                ).toLocaleDateString()}{" "}
                                to{" "}
                                {new Date(
                                    dateRange.endDate
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>{" "}
            {/* Key Metrics Cards */}
            <div className="space-y-4">
                {/* Header with current view indicator */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Revenue Metrics
                        {showFiltered && (
                            <span className="ml-2 px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
                                Filtered View
                            </span>
                        )}
                    </h2>
                    {filterLoading && (
                        <div className="flex items-center text-black">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                            <span className="text-sm">Filtering...</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium uppercase tracking-wide">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-green-800">
                                    {formatCurrency(
                                        getCurrentData().totalRevenue
                                    )}
                                </p>
                            </div>
                            <div className="bg-green-200 p-3 rounded-full">
                                <i className="fa-solid fa-dollar-sign text-green-700 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium uppercase tracking-wide">
                                    Total Orders
                                </p>
                                <p className="text-2xl font-bold text-blue-800">
                                    {getCurrentData().totalOrders.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-blue-200 p-3 rounded-full">
                                <i className="fa-solid fa-shopping-cart text-blue-700 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    {/* Average Order Value */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium uppercase tracking-wide">
                                    Avg Order Value
                                </p>
                                <p className="text-2xl font-bold text-purple-800">
                                    {formatCurrency(
                                        getCurrentData().averageOrderValue
                                    )}
                                </p>
                            </div>
                            <div className="bg-purple-200 p-3 rounded-full">
                                <i className="fa-solid fa-chart-line text-purple-700 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 text-sm font-medium uppercase tracking-wide">
                                    This Month
                                </p>
                                <p className="text-2xl font-bold text-orange-800">
                                    {formatCurrency(
                                        getCurrentData().monthlyRevenue
                                    )}
                                </p>
                            </div>
                            <div className="bg-orange-200 p-3 rounded-full">
                                <i className="fa-solid fa-calendar text-orange-700 text-xl"></i>
                            </div>{" "}
                        </div>
                    </div>
                </div>
            </div>
            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Revenue */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Today's Revenue
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(getCurrentData().todayRevenue)}
                            </p>
                        </div>
                        <i className="fa-solid fa-calendar-day text-gray-400 text-lg"></i>
                    </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Pending Orders
                            </p>
                            <p className="text-xl font-bold text-yellow-600">
                                {getCurrentData().pendingOrders}
                            </p>
                        </div>
                        <i className="fa-solid fa-clock text-yellow-400 text-lg"></i>
                    </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Completed Orders
                            </p>
                            <p className="text-xl font-bold text-green-600">
                                {getCurrentData().completedOrders}
                            </p>
                        </div>
                        <i className="fa-solid fa-check-circle text-green-400 text-lg"></i>
                    </div>
                </div>
            </div>
            {/* Charts and Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {" "}
                {/* Order Status Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Order Status Breakdown
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(getCurrentData().statusBreakdown).map(
                            ([status, count]) => (
                                <div
                                    key={status}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                status
                                            )}`}
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {count}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
                {/* Top Products */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Top Products by Revenue
                    </h3>
                    <div className="space-y-3">
                        {getCurrentData().topProducts.length > 0 ? (
                            getCurrentData().topProducts.map(
                                (product, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                                    >
                                        {" "}
                                        <div>
                                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Sold: {product.quantity} units
                                            </p>
                                        </div>
                                        <span className="font-bold text-green-600">
                                            {formatCurrency(product.revenue)}
                                        </span>
                                    </div>
                                )
                            )
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No product data available
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        Recent Orders
                    </h3>
                    <button
                        onClick={fetchRevenueData}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        <i className="fa-solid fa-refresh mr-1"></i>
                        Refresh
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                    Order ID
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                    Customer
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                    Date
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                                    Amount
                                </th>
                            </tr>
                        </thead>{" "}
                        <tbody>
                            {getCurrentData().recentOrders.length > 0 ? (
                                getCurrentData().recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
                                            <span className="font-mono text-sm">
                                                {order.orderNumber ||
                                                    order._id?.slice(-6)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-gray-900">
                                                {order.user?.name ||
                                                    order.user?.email ||
                                                    "Unknown"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status
                                                    ?.charAt(0)
                                                    .toUpperCase() +
                                                    order.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                                            {formatCurrency(order.totalPrice)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No recent orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Summary Footer */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="text-center">
                    <p className="text-gray-600 mb-2">
                        Last updated: {new Date().toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                        Revenue data is calculated based on all orders in the
                        system
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SaleQuery;
