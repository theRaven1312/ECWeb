import React from 'react';
import PriceDiscount from "./PriceDiscount";

const CartPrice = ({ items = [], totalPrice = 0, onClearCart }) => {
    const subtotal = totalPrice;
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal + shipping;

    const handleCheckout = () => {
        // Navigate to checkout page
        alert('Proceeding to checkout...');
        // window.location.href = '/checkout';
    };

    return (
        <div className="border-2 border-gray-200 p-6 rounded-3xl h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
                <div className="flex justify-between py-2">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="space-y-3">
                <button 
                    onClick={handleCheckout}
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
                        Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                </div>
            )}
        </div>
    );
};

export default CartPrice;
