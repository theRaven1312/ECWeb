import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux"; // ✅ Add useDispatch
import DirectLink from "../Components/DirectLink";
import CartList from "../Components/CartList";
import CartPrice from "../Components/CartPrice";
import axiosJWT from "../utils/axiosJWT";
import OrderConfirm from "../Components/OrderConfirm";
import {set} from "mongoose";
import {setCartQuantity, removeFromCart} from "../redux/CartSliceRedux"; // ✅ Import Redux actions

const CartPage = () => {
    const [cartData, setCartData] = useState({
        items: [],
        totalPrice: 0,
        totalItems: 0,
        loading: true,
        error: null,
    });

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch(); // ✅ Initialize useDispatch

    // Fetch cart data when component mounts or user changes
    useEffect(() => {
        if (user?.access_token || user?._id) {
            fetchCartData();
        } else {
            setCartData((prev) => ({
                ...prev,
                loading: false,
                items: [],
                totalPrice: 0,
                totalItems: 0,
            }));
        }
    }, [user]);
    const fetchCartData = async () => {
        try {
            setCartData((prev) => ({...prev, loading: true, error: null}));

            const response = await axiosJWT.get("/api/v1/cart");
            const cart = response.data.cart;
            const items = cart?.products || [];
            const totalItems = items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            setCartData({
                items: items,
                totalPrice: cart?.totalPrice || 0,
                totalItems: totalItems,
                loading: false,
                error: null,
            });

            // ✅ Update Redux cart quantity
            dispatch(setCartQuantity(totalItems));
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartData((prev) => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || "Failed to load cart",
            }));
        }
    };

    const handleUpdateQuantity = async (
        productId,
        newQuantity,
        size = "",
        color = ""
    ) => {
        try {
            if (newQuantity <= 0) {
                await handleRemoveItem(productId, size, color);
                return;
            }
            const response = await axiosJWT.put(
                `/api/v1/cart/update/${productId}`,
                {
                    quantity: newQuantity,
                    size,
                    color,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            const cart = response.data.cart;
            const items = cart?.products || [];
            const totalItems = items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setCartData((prev) => ({
                ...prev,
                items: items,
                totalPrice: cart?.totalPrice || 0,
                totalItems: totalItems,
            }));

            // ✅ Update Redux cart quantity
            dispatch(setCartQuantity(totalItems));
        } catch (error) {
            console.error(
                "Error updating quantity:",
                error.response?.data.message || error
            );
            setCartData((prev) => ({
                ...prev,
                error:
                    error.response?.data?.message ||
                    "Failed to update quantity",
            }));
        }
    };

    const handleRemoveItem = async (productId, size = "", color = "") => {
        try {
            const response = await axiosJWT.delete(
                `/api/v1/cart/remove/${productId}`,
                {
                    data: {size, color},
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            const cart = response.data.cart;
            const items = cart?.products || [];
            const totalItems = items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setCartData((prev) => ({
                ...prev,
                items: items,
                totalPrice: cart?.totalPrice || 0,
                totalItems: totalItems,
            }));

            // ✅ Update Redux cart quantity
            dispatch(setCartQuantity(totalItems));
        } catch (error) {
            console.error("Error removing item:", error);
            setCartData((prev) => ({
                ...prev,
                error: "Failed to remove item",
            }));
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) {
            return;
        }
        try {
            await axiosJWT.delete("/api/v1/cart/clear", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                    )}`,
                },
            });

            setCartData((prev) => ({
                ...prev,
                items: [],
                totalPrice: 0,
                totalItems: 0,
            }));

            dispatch(setCartQuantity(0));
        } catch (error) {
            console.error("Error clearing cart:", error);
            setCartData((prev) => ({
                ...prev,
                error: "Failed to clear cart",
            }));
        }
    };

    const clearError = () => {
        setCartData((prev) => ({...prev, error: null}));
    };

    //Show Order Confirm when click on procceed to checkout

    // Check if user is logged in
    if (!user?.access_token && !user?._id) {
        return (
            <>
                <div className="flex flex-col flex-center">
                    <div className="w-[80%] h-px bg-gray-300"></div>
                </div>
                <div className="cart-page min-h-[60vh] flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="mb-6">
                            <i className="fa-solid fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Please Login
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You need to be logged in to view your cart and make
                            purchases.
                        </p>
                        <div className="space-y-3">
                            <a
                                href="/login"
                                className="block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Login to Your Account
                            </a>
                            <a
                                href="/"
                                className="block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Underline-navbar */}
            <div className="flex flex-col flex-center">
                <div className="w-[80%] h-px bg-gray-300"></div>
            </div>

            <div className="cart-page px-4 py-8">
                {/* Cart-heading */}
                <div className=" mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 font-integral">
                        YOUR CART
                    </h1>
                    {!cartData.loading && (
                        <p className="text-gray-600">
                            {cartData.totalItems === 0
                                ? "Your cart is empty"
                                : `${cartData.totalItems} item${
                                      cartData.totalItems > 1 ? "s" : ""
                                  } in your cart`}
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {cartData.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <i className="fa-solid fa-exclamation-circle mr-2"></i>
                            <span>{cartData.error}</span>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-800 hover:text-red-900"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {cartData.loading ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Loading your cart...
                        </div>
                    </div>
                ) : cartData.items.length === 0 ? (
                    /* Empty Cart */
                    <div className="text-center py-12">
                        <div className="mb-6">
                            <i className="fa-solid fa-shopping-cart text-8xl text-gray-300 mb-4"></i>
                        </div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart
                            yet. Start shopping to fill it up!
                        </p>
                        <div className="space-y-4">
                            <a
                                href="/"
                                className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Continue Shopping
                            </a>
                            <div className="text-sm text-gray-500">
                                <p>
                                    Browse our latest collections and find
                                    something you love!
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Cart Content */
                    <>
                        {/* Progress indicator */}

                        <div className="flex flex-col gap-8 md:flex-row">
                            {/* Cart Items - Takes 2/3 of the space */}
                            <div className="w-full">
                                <CartList
                                    items={cartData.items}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                />
                            </div>

                            {/* Cart Summary - Takes 1/3 of the space */}
                            <div className="min-w-1/3">
                                <CartPrice
                                    items={cartData.items}
                                    totalPrice={cartData.totalPrice}
                                    totalItems={cartData.totalItems}
                                    onClearCart={handleClearCart}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CartPage;
