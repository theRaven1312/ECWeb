import React from "react";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import PriceDiscount from "./PriceDiscount";

const CartPrice = ({items = [], totalPrice = 0, onClearCart}) => {
    const user = useSelector((state) => state.user);

    const subtotal = totalPrice;
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal + shipping;

    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [showConfirmed, setShowConfirmed] = useState(false);

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
                <div className="flex justify-between py-2">
                    <span>Subtotal ({items.length} products)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2">
                    <span>Shipping</span>
                    <span>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-3">
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
