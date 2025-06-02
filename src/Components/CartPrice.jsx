import React from "react";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import PriceDiscount from "./PriceDiscount";
import axiosJWT from "../utils/axiosJWT";
import {set} from "mongoose";

const CartPrice = ({items = [], totalPrice = 0, onClearCart}) => {
    const user = useSelector((state) => state.user);

    const subtotal = totalPrice;
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [showConfirmed, setShowConfirmed] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        const savedCoupon = localStorage.getItem("appliedCoupon");
        return savedCoupon ? JSON.parse(savedCoupon) : null;
    });
    const [couponCode, setCouponCode] = useState(() => {
        return localStorage.getItem("couponCode") || "";
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleProceedToCheckout = () => {
        if (items.length > 0) {
            setShowOrderConfirm(true);
        } else {
            alert("Your cart is empty. Please add items to proceed.");
        }
    };
    const handleConfirmOrder = () => {
        setShowOrderConfirm(false);
        setShowConfirmed(true);

        setAppliedCoupon(null);
        setCouponCode("");
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("couponCode");
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

    // useEffect(() => {
    //     if (showConfirmed) {
    //         const placeOrder = async () => {
    //             try {
    //                 const response = await axios.post('/api/orders', {
    //                     items,
    //                     total,
    //                     shipping,
    //                     user: {
    //                         address: user.address,
    //                         phone: user.phone
    //                     }
    //                 });
    //                 if (response.status === 200) {
    //                     setConfirmed(true);
    //                     onClearCart(); // Clear cart after successful order
    //                 } else {
    //                     alert("Failed to place order. Please try again.");
    //                 }
    //             } catch (error) {
    //                 console.error("Error placing order:", error);
    //                 alert("An error occurred while placing your order. Please try again.");
    //             }
    //         };
    //         placeOrder();
    //     }
    // }, [showConfirmed, items, total, shipping, user.address, user.phone, onClearCart]);

    return (
        <div className="border-2 border-gray-200 p-6 rounded-3xl h-fit w-full">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex mb-4 justify-between">
                <div>Order delivery details:</div>
                <ul className="">
                    <li>Address: {user.address}</li>
                    <li>Phone: {user.phone}</li>
                </ul>
            </div>
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
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Enter coupon code and press Enter"
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
                        {error && (
                            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                                {error}
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

                                        // Xóa khỏi localStorage
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
                    disabled={items.length === 0}
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
            {showOrderConfirm && (
                <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Order Confirm
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Please review your order details before proceeding.
                            If everything looks good, click "Confirm" to place
                            your order.
                        </p>
                        <div className="flex justify-center items-center gap-6">
                            <button
                                onClick={() => setShowOrderConfirm(false)}
                                className="border-1 border-black px-4 py-2 rounded-3xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleConfirmOrder()}
                                className="bg-black text-white px-8 py-2 rounded-3xl hover:bg-gray-800 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmed && (
                <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black/50 z-10 ">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center bounce-in">
                        <h1 className="text-2xl font-bold mb-4">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order! Your items will be shipped
                            soon.
                        </p>
                        <button
                            onClick={() => setShowConfirmed(false)}
                            className="bg-green-600 text-white px-8 py-2 rounded-3xl hover:bg-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPrice;
