import React from "react";

const OrderConfirm = () => {
    return (
        <div>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4">Order Confirm</h1>
                    <p className="text-gray-600 mb-6">
                        Please confirm your order details before proceeding to
                        place the order. If everything looks good, click the{" "}
                        <span className="italic">Confirm</span>.
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirm;
