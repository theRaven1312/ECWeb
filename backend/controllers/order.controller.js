import express from "express";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";

const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

const calculateTotalPrice = async (products, appliedCoupon) => {
    let total = products.reduce((sum, item) => {
        let price = item.price;
        const itemPrice = price * item.quantity;
        return sum + itemPrice;
    }, 0);

    const shipping = total > 100 ? 0 : 15;
    total += shipping;

    if (appliedCoupon && appliedCoupon.code) {
        let discount = await Coupon.findOne({
            code: appliedCoupon.code.toUpperCase(),
            isActive: true,
        });

        if (discount) {
            let discountAmount = 0;

            if (discount.discountType === "percentage") {
                discountAmount = (total * discount.discountValue) / 100;
                if (
                    discount.maxDiscountAmount &&
                    discountAmount > discount.maxDiscountAmount
                ) {
                    discountAmount = discount.maxDiscountAmount;
                }
            } else if (discount.discountType === "fixed") {
                discountAmount = discount.discountValue;
            }

            total = Math.max(0, total - discountAmount);
        }
    }

    return total;
};

//View all orders for admin
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9; // ✅ 9 items for 3x3 grid
        const skip = (page - 1) * limit;

        const filter = req.query.filter || "";

        // ✅ Build query with filter
        const query = {};
        if (filter && filter !== "all") {
            query.status = filter;
        }

        console.log(
            `Fetching orders with filter: ${filter}, page: ${page}, limit: ${limit}`
        );
        console.log("Query:", query);

        const orders = await Order.find(query)
            .populate({
                path: "user",
                select: "name email",
            })
            .populate({
                path: "products.product",
                model: "products", // ✅ Fix model name
                select: "name price images",
            })
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);

        // ✅ Get total count with same filter
        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        console.log(
            `Found ${orders.length} orders out of ${totalOrders} total (page ${page}/${totalPages})`
        );

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders: orders,
            filter: filter,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalOrders: totalOrders,
                limit: limit,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                startIndex: skip + 1,
                endIndex: Math.min(skip + limit, totalOrders),
            },
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            message: "Error retrieving orders",
            error: error.message,
            status: "ERROR",
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized: User not found in token",
                status: "ERROR",
            });
        }

        const userId = req.user.id || req.user._id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }
        // const {shippingAddress, phone, finalTotal, appliedCoupon} = req.body;

        const {shippingAddress, phone, appliedCoupon} = req.body;

        if (!shippingAddress || !phone) {
            return res.status(400).json({
                message: "Shipping address and phone are required",
                status: "ERROR",
            });
        }

        const cart = await Cart.findOne({user: userId}).populate(
            "products.product"
        );

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
                status: "ERROR",
            });
        }

        //Validate stock
        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                throw new Error(`Product ${item.product._id} not found`);
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${product.name}`,
                    status: "ERROR",
                });
            }
        }

        const orderProducts = await Promise.all(
            cart.products.map(async (item) => {
                const product = await Product.findById(item.product._id);
                if (!product) {
                    throw new Error(`Product ${item.product._id} not found`);
                }

                return {
                    product: item.product._id,
                    quantity: item.quantity,
                    size: item.size || "",
                    color: item.color || "",
                    price:
                        (product.price -=
                            product.price * (product.discount / 100)) ||
                        product.price,
                    discount: product.discount,
                };
            })
        );

        let totalPrice = await calculateTotalPrice(
            orderProducts,
            appliedCoupon
        );

        const newOrder = new Order({
            user: userId,
            products: orderProducts,
            totalPrice: totalPrice,
            appliedCoupon: appliedCoupon || null,
            shippingAddress: shippingAddress,
            phone: phone,
            orderNumber: generateOrderNumber(),
            status: "pending",
            paymentStatus: "pending",
        });

        await newOrder.save();

        await newOrder.populate("products.product");
        await newOrder.populate("user", "name email");

        // Clear the cart after order creation
        await Cart.findOneAndUpdate(
            {user: userId},
            {
                products: [],
                totalPrice: 0,
                coupon: null,
            }
        );

        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message,
            status: "ERROR",
        });
    }
};

// ✅ Also fix getUserOrders for regular users
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        console.log("Fetching orders for user:", userId);
        const orders = await Order.find({user: userId})
            .populate({
                path: "products.product",
                model: "products",
                select: "name price images",
            })
            .sort({createdAt: -1});

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders: orders,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({
            message: "Error retrieving orders",
            error: error.message,
            status: "ERROR",
        });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user.id || req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        }).populate("products.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                status: "ERROR",
            });
        }

        res.status(200).json({
            message: "Order retrieved successfully",
            order: order,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            message: "Error retrieving order",
            error: error.message,
            status: "ERROR",
        });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        // ✅ Validation
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                status: "ERROR",
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                status: "ERROR",
            });
        }

        const validStatuses = [
            "pending",
            "delivering",
            "delivered",
            "cancelled",
            "returned",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Valid statuses: ${validStatuses.join(
                    ", "
                )}`,
                status: "ERROR",
            });
        }

        console.log("Updating order status:", orderId, "to:", status);

        const checkOrder = await Order.findById(orderId);
        if (!checkOrder) {
            return res.status(404).json({
                message: "Order not found",
                status: "ERROR",
            });
        }

        if (checkOrder.status === "delivering" && status === "cancelled") {
            return res.status(400).json({
                message:
                    "Cannot cancel an order that is currently being delivered",
                status: "ERROR",
            });
        }

        if (checkOrder.status === "delivered" && status === "cancelled") {
            return res.status(400).json({
                message:
                    "Cannot cancel an order that has already been delivered",
                status: "ERROR",
            });
        }

        // ✅ Update only status
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                status: status,
                updatedAt: new Date(),
            },
            {new: true}
        ).populate([
            {
                path: "user",
                select: "name email",
            },
            {
                path: "products.product",
                model: "products",
                select: "name price images",
            },
        ]);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                status: "ERROR",
            });
        }

        if (status === "delivering") {
            for (const product of order.products) {
                const productData = await Product.findById(product.product._id);
                if (productData) {
                    productData.stock -= product.quantity;
                    await productData.save();
                    console.log(
                        `Product ${product.product._id} stock updated to ${productData.stock}`
                    );
                } else {
                    console.error(
                        `Product ${product.product._id} not found for stock update`
                    );
                }
            }
        }

        if (status === "returned") {
            for (const product of order.products) {
                const productData = await Product.findById(product.product._id);
                if (productData) {
                    productData.stock += product.quantity;
                    await productData.save();
                    console.log(
                        `Product ${product.product._id} stock updated to ${productData.stock}`
                    );
                } else {
                    console.error(
                        `Product ${product.product._id} not found for stock update`
                    );
                }
            }
        }

        if (status === "delivered") {
            for (const product of order.products) {
                const productData = await Product.findById(product.product._id);
                if (productData) {
                    productData.isSold += product.quantity;
                    await productData.save();
                    console.log(
                        `Product ${product.product._id} isSold updated to ${productData.isSold}`
                    );
                } else {
                    console.error(
                        `Product ${product.product._id} not found for isSold update`
                    );
                }
            }
        }

        // Log the update
        console.log("✅ Order status updated successfully:", {
            orderId: order._id,
            orderNumber: order.orderNumber,
            newStatus: status,
            updatedBy: req.user?.email || req.user?.name,
            timestamp: new Date(),
        });

        res.status(200).json({
            message: "Order status updated successfully",
            order: order,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("❌ Update order status error:", error);
        res.status(500).json({
            message: "Error updating order status",
            error: error.message,
            status: "ERROR",
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const {orderId} = req.params;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                status: "ERROR",
            });
        }

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                status: "ERROR",
            });
        }

        if (order.status === "delivering")
            res.status(400).json({
                message:
                    "Cannot delete an order that is currently being delivered",
                status: "ERROR",
            });

        console.log(
            `✅ Order ${orderId} deleted successfully by ${
                req.user?.email || req.user?.name
            }`
        );

        res.status(200).json({
            message: "Order deleted successfully",
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("❌ Delete order error:", error);
        res.status(500).json({
            message: "Error deleting order",
            error: error.message,
            status: "ERROR",
        });
    }
};
