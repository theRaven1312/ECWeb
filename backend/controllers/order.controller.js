import express from 'express';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

//View all orders for admin
export const getAllOrders = async (req, res) => {
    try {
        // ✅ Add pagination support
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'products.product',
                model: 'products',
                select: 'name'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // ✅ Get total count for pagination
        const totalOrders = await Order.countDocuments();

        console.log(`Found ${orders.length} orders out of ${totalOrders} total`);

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders: totalOrders,
                hasNext: page < Math.ceil(totalOrders / limit),
                hasPrev: page > 1
            },
            status: 'SUCCESS'
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            message: 'Error retrieving orders',
            error: error.message,
            status: 'ERROR'
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        //Get user ID from token
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized: User not found in token',
                status: 'ERROR'
            });
        }

        

        const userId = req.user.id || req.user._id;
        
        if (!userId) {
            return res.status(400).json({
                message: 'User ID not found in token',
                status: 'ERROR'
            });
        }

        const { shippingAddress, phone } = req.body;

        if (!shippingAddress || !phone) {
            return res.status(400).json({
                message: 'Shipping address and phone are required',
                status: 'ERROR'
            });
        }

        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty',
                status: 'ERROR'
            });
        }

        const orderProducts = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findById(item.product._id);
            if (!product) {
                throw new Error(`Product ${item.product._id} not found`);
            }

            return {
                product: item.product._id,
                quantity: item.quantity,
                size: item.size || '',
                color: item.color || '',
                price: product.price 
            };
        }));

        let totalPrice = 0;
        orderProducts.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        const shipping = totalPrice > 100 ? 0 : 15;
        totalPrice += shipping;

        const newOrder = new Order({
            user: userId,
            products: orderProducts,
            totalPrice: totalPrice,
            shippingAddress: shippingAddress,
            phone: phone,
            orderNumber: generateOrderNumber(),
            status: 'pending',
            paymentStatus: 'pending'
        });

        await newOrder.save();

        await newOrder.populate('products.product');
        await newOrder.populate('user', 'name email');

        await Cart.findOneAndUpdate(
            { user: userId },
            { 
                products: [],
                totalPrice: 0,
                coupon: null
            }
        );

        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder,
            status: 'SUCCESS'
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message,
            status: 'ERROR'
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        const orders = await Order.find({ user: userId })
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: orders,
            status: 'SUCCESS'
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            message: 'Error retrieving orders',
            error: error.message,
            status: 'ERROR'
        });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id || req.user._id;

        const order = await Order.findOne({ 
            _id: orderId, 
            user: userId 
        }).populate('products.product');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
                status: 'ERROR'
            });
        }

        res.status(200).json({
            message: 'Order retrieved successfully',
            order: order,
            status: 'SUCCESS'
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            message: 'Error retrieving order',
            error: error.message,
            status: 'ERROR'
        });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        updateData.updatedAt = new Date();

        const order = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate('products.product');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
                status: 'ERROR'
            });
        }

        res.status(200).json({
            message: 'Order updated successfully',
            order: order,
            status: 'SUCCESS'
        });

    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            message: 'Error updating order',
            error: error.message,
            status: 'ERROR'
        });
    }
};
