import React from "react";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux"; // ✅ Add useDispatch
import PriceDiscount from "./PriceDiscount";
import axiosJWT from "../utils/axiosJWT";
import axios from "axios";
import {setCartQuantity} from "../redux/CartSliceRedux"; // ✅ Import Redux action

const CartPrice = ({items = [], totalPrice = 0, onClearCart}) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const subtotal = totalPrice;
    const shipping = subtotal > 100 ? 0 : 15;
    let total = subtotal + shipping;

    const [showOrderConfirm, setShowOrderConfirm] = useState(false);

    const [showConfirmed, setShowConfirmed] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    const [error, setError] = useState(null);

    const [orderData, setOrderData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        const savedCoupon = localStorage.getItem("appliedCoupon");
        return savedCoupon ? JSON.parse(savedCoupon) : null;
    });

    const [couponCode, setCouponCode] = useState(() => {
        return localStorage.getItem("couponCode") || "";
    });

    const handleProceedToCheckout = () => {
        if (!user.address || !user.phone) {
            alert(
                "Please update your address and phone number in your profile before placing an order."
            );
            return;
        }

        if (items.length > 0) {
            setShowOrderConfirm(true);
            setError(null);
        }
    };

    const calculateDynamicDiscount = (coupon, currentSubtotal) => {
        if (!coupon) return null;

        let discountPrice = 0;

        if (coupon.discountType === "percentage") {
            discountPrice = (coupon.discountValue / 100) * currentSubtotal;
            if (
                coupon.maxDiscountAmount &&
                discountPrice > coupon.maxDiscountAmount
            ) {
                discountPrice = coupon.maxDiscountAmount;
            }
        } else if (coupon.discountType === "fixed") {
            discountPrice = coupon.discountValue;
            if (
                coupon.maxDiscountAmount &&
                discountPrice > coupon.maxDiscountAmount
            ) {
                discountPrice = coupon.maxDiscountAmount;
            }
        }
        return {
            discountPrice,
            discountName:
                coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`,
            appliedCoupon: coupon.code,
        };
    };

    const currentDiscount = calculateDynamicDiscount(appliedCoupon, subtotal);

    useEffect(() => {
        if (appliedCoupon) {
            const validateCoupon = async () => {
                try {
                    const response = await axiosJWT.get(`/api/v1/coupons`);
                    const coupons = response.data.data;
                    const currentCoupon = coupons.find(
                        (c) =>
                            c.code.toUpperCase() ===
                            appliedCoupon.code.toUpperCase()
                    );
                    if (
                        !currentCoupon ||
                        !currentCoupon.isActive ||
                        currentCoupon.usageLimit === 0
                    ) {
                        setAppliedCoupon(null);
                        setCouponCode("");

                        localStorage.removeItem("appliedCoupon");
                        localStorage.removeItem("couponCode");

                        let errorMessage =
                            "The applied coupon is no longer valid";
                        if (currentCoupon && currentCoupon.usageLimit === 0) {
                            errorMessage =
                                "Coupon usage limit has been reached";
                        }
                        setError(errorMessage);
                    } else {
                        setAppliedCoupon(currentCoupon);
                        localStorage.setItem(
                            "appliedCoupon",
                            JSON.stringify(currentCoupon)
                        );
                    }
                } catch (error) {
                    setError(
                        error.response?.data?.message ||
                            "Failed to validate coupon"
                    );
                }
            };

            validateCoupon();
        }
    }, []);

    const handleConfirmOrder = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            await createOrder();
        } catch (error) {
            console.error("Error in handleConfirmOrder:", error);
            setError("Failed to place order. Please try again.");
        } finally {
            if (appliedCoupon) {
                await axiosJWT.post("/api/v1/coupons/use-coupon", {
                    code: appliedCoupon.code,
                });
            }

            setIsProcessing(false);
        }
    };

    const handleCoupon = async (couponCode) => {
        try {
            setLoading(true);
            const response = await axiosJWT.post(
                "/api/v1/coupons/apply-coupon",
                {
                    code: couponCode,
                }
            );
            if (response.data.status === "OK") {
                const couponResponse = await axiosJWT.get(`/api/v1/coupons`);
                const coupons = couponResponse.data.data;
                const couponInfo = coupons.find(
                    (c) => c.code.toUpperCase() === couponCode.toUpperCase()
                );
                if (couponInfo) {
                    setAppliedCoupon(couponInfo);
                    setError("");
                    setCouponCode(couponCode);

                    localStorage.setItem(
                        "appliedCoupon",
                        JSON.stringify(couponInfo)
                    );
                    localStorage.setItem("couponCode", couponCode);
                }
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Something went wrong";
            console.log("Error applying coupon:", message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async () => {
        try {
            console.log("Creating order...");
            console.log("Items:", items);
            console.log("Total price:", total);
            console.log("User address:", user.address);
            console.log("User phone:", user.phone);

            const token = localStorage.getItem("access_token");

            if (!token) {
                throw new Error("No authentication token found");
            }

            const finalTotal = total - (currentDiscount?.discountPrice || 0);

            const response = await axiosJWT.post(
                "/api/v1/orders",
                {
                    shippingAddress: user.address,
                    phone: user.phone,
                    appliedCoupon: appliedCoupon
                        ? {
                              code: appliedCoupon.code,
                              discountAmount:
                                  currentDiscount?.discountPrice || 0,
                          }
                        : null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 201 && response.data.status === "SUCCESS") {
                console.log("Order created successfully:", response.data.order);

                setOrderData(response.data.order);
                setShowOrderConfirm(false);
                setShowConfirmed(true);

                // ✅ Reset Redux cart quantity after successful order
                dispatch(setCartQuantity(0));
            } else {
                throw new Error(
                    response.data.message || "Failed to place order"
                );
            }
        } catch (error) {
            console.error("Error creating order:", error);

            // ✅ Handle different error types
            if (error.response?.status === 401) {
                setError("Please login again to place your order.");
            } else if (error.response?.status === 400) {
                setError(error.response.data.message || "Invalid order data.");
            } else {
                setError(
                    error.response?.data?.message ||
                        "An error occurred while placing your order. Please try again."
                );
            }

            throw error; // Re-throw to be caught by handleConfirmOrder
        } finally {
            await axiosJWT.delete("/api/v1/cart/clear");

            setIsProcessing(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowConfirmed(false);
        setError(null);
        setCouponCode("");
        setAppliedCoupon(null);
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("couponCode");
    };

    return (
        <div className="border-2 border-gray-200 p-6 rounded-3xl h-fit w-full">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex mb-4 justify-between">
                <div>Order delivery details:</div>
                <ul className="">
                    <li>Address: {user.address || "Not provided"}</li>
                    <li>Phone: {user.phone || "Not provided"}</li>
                </ul>
            </div>
            {/* ✅ Show warning if address/phone missing */}
            {(!user.address || !user.phone) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <i className="fa-solid fa-exclamation-triangle text-yellow-600 mr-2"></i>
                        <p className="text-sm text-yellow-800">
                            Please update your address and phone in your profile
                            to place an order.
                        </p>
                    </div>
                </div>
            )}
            <div className="space-y-2 mb-4">
                {" "}
                <div className="flex justify-between py-2">
                    <span>Subtotal ({items.length} products)</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {currentDiscount && (
                    <PriceDiscount
                        name={currentDiscount.discountName}
                        price={currentDiscount.discountPrice}
                    />
                )}
                <div className="flex justify-between py-2">
                    <span>Shipping</span>
                    <span className="font-bold">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
                <hr className="my-4" />{" "}
                <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total</span>
                    <span>
                        $
                        {(
                            total - (currentDiscount?.discountPrice || 0)
                        ).toFixed(2)}
                    </span>
                </div>
            </div>{" "}
            <div className="space-y-3">
                {!appliedCoupon ? (
                    <div className="flex flex-col ">
                        <label
                            htmlFor="couponCode"
                            className="text-sm font-medium ml-3"
                        >
                            Press Enter to confirm
                        </label>
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyPress={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    couponCode.trim() &&
                                    !loading
                                ) {
                                    handleCoupon(couponCode);
                                }
                            }}
                            className="border border-gray-300 pl-6 p-3 rounded-3xl w-full"
                            disabled={loading}
                        />
                        {loading && (
                            <div className="text-black text-sm p-2 rounded text-center">
                                Applying coupon...
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-green-800">
                                        Coupon Applied: {appliedCoupon.code}
                                    </div>
                                    <div className="text-sm text-green-600">
                                        {appliedCoupon.discountType ===
                                        "percentage"
                                            ? `${appliedCoupon.discountValue}% discount`
                                            : `$${appliedCoupon.discountValue} off`}
                                    </div>{" "}
                                    <div className="text-sm text-green-600">
                                        Current discount: $
                                        {currentDiscount?.discountPrice.toFixed(
                                            2
                                        )}
                                    </div>
                                </div>{" "}
                                <button
                                    onClick={() => {
                                        setAppliedCoupon(null);
                                        setCouponCode("");
                                        setError("");
                                        localStorage.removeItem(
                                            "appliedCoupon"
                                        );
                                        localStorage.removeItem("couponCode");
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleProceedToCheckout}
                    disabled={
                        items.length === 0 || !user.address || !user.phone
                    }
                    className="w-full bg-black text-white py-3 rounded-3xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Checkout
                </button>

                <button
                    onClick={onClearCart}
                    disabled={items.length === 0}
                    className="w-full border border-gray-300 py-2 rounded-3xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear Cart
                </button>
            </div>
            {subtotal < 100 && subtotal > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">
                        Add ${(100 - subtotal).toFixed(2)} more for free
                        shipping!
                    </p>
                </div>
            )}
            {/* ✅ Order Confirmation Modal */}
            {showOrderConfirm && (
                <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Confirm Your Order
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Please review your order details before proceeding.
                            If everything looks good, click "Confirm" to place
                            your order.
                        </p>

                        {/* ✅ Order summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h3 className="font-semibold mb-2">
                                Order Details:
                            </h3>
                            <p className="text-sm">
                                Items: {items.length} products
                            </p>
                            <p className="text-sm">
                                Subtotal: ${subtotal.toFixed(2)}
                            </p>
                            {currentDiscount && (
                                <p className="text-sm text-red-500">
                                    Discount: -$
                                    {currentDiscount?.discountPrice.toFixed(2)}
                                </p>
                            )}
                            <p className="text-sm">
                                Shipping:{" "}
                                {shipping === 0
                                    ? "Free"
                                    : `$${shipping.toFixed(2)}`}
                            </p>{" "}
                            <p className="text-sm font-bold">
                                Total: $
                                {(
                                    total -
                                    (currentDiscount?.discountPrice || 0)
                                ).toFixed(2)}
                            </p>
                            <hr className="my-2" />
                            <p className="text-sm">
                                Delivery to: {user.address}
                            </p>
                            <p className="text-sm">Phone: {user.phone}</p>
                        </div>

                        <div className="flex justify-center items-center gap-6">
                            <button
                                onClick={() => setShowOrderConfirm(false)}
                                disabled={isProcessing}
                                className="border border-black px-4 py-2 rounded-3xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmOrder}
                                disabled={isProcessing}
                                className="bg-black text-white px-8 py-2 rounded-3xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center"
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                        Processing...
                                    </>
                                ) : (
                                    "Confirm Order"
                                )}
                            </button>
                        </div>

                        {/* ✅ Show error in modal */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* ✅ Success Modal */}
            {showConfirmed && orderData && (
                <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                        {/* ✅ Success icon */}
                        <div className="mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                <i className="fa-solid fa-check text-green-600 text-2xl"></i>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-4 text-green-600">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order! Your items will be
                            processed and shipped soon.
                        </p>

                        {/* ✅ Order details */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h3 className="font-semibold mb-2">
                                Order Information:
                            </h3>
                            <p className="text-sm">
                                Order Number:{" "}
                                <span className="font-mono font-bold">
                                    {orderData.orderNumber}
                                </span>
                            </p>{" "}
                            <p className="text-sm">
                                Total Amount: $
                                {(
                                    total -
                                    (currentDiscount?.discountPrice || 0)
                                ).toFixed(2)}
                            </p>
                            <p className="text-sm">
                                Status:{" "}
                                <span className="capitalize">
                                    {orderData.status}
                                </span>
                            </p>
                            <p className="text-sm">
                                Date:{" "}
                                {new Date(
                                    orderData.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <button
                            onClick={handleCloseSuccess}
                            className="bg-black text-white px-8 py-2 rounded-3xl hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
            {/* ✅ Error display outside modals */}
            {error && !showOrderConfirm && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPrice;
