import React from "react";
import CartCard from "./CartCard";
import QuantitySelector from "./QuanityBtn";

const CartList = ({items = [], onUpdateQuantity, onRemoveItem}) => {
    const handleQuantityChange = (item, newQuantity) => {
        onUpdateQuantity(item.product._id, newQuantity, item.size, item.color);
    };

    const handleRemove = (item) => {
        onRemoveItem(item.product._id, item.size, item.color);
    };

    if (items.length === 0) {
        return (
            <div className="cart-list">
                <p className="text-gray-500 text-center py-8">
                    No items in cart
                </p>
            </div>
        );
    }

    return (
        <div className="cart-list w-full space-y-4 max-w-full">
            {items.map((item, index) => (
                <div
                    key={`${item.product._id}-${item.size}-${item.color}-${index}`}
                    className="cart-card"
                >
                    {/* Product Image */}
                    <div className="w-30 h-30 flex-shrink-0 border-1 border-gray-200 rounded-3xl overflow-hidden shadow-lg">
                        <img
                            src={
                                item.product.image_url ||
                                item.product.images?.[0] ||
                                "/placeholder-image.jpg"
                            }
                            alt={item.product.name}
                            className="w-full h-full object-contain rounded"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                            {item.product.name}
                        </h3>
                        {item.size && (
                            <p className="text-sm text-gray-600">
                                Size: {item.size}
                            </p>
                        )}{" "}
                        {item.color && (
                            <p className="text-sm text-gray-600">
                                Color: {item.color}
                            </p>
                        )}
                        <p className="text-lg font-bold">
                            $
                            {item.product.discount > 0
                                ? (
                                      item.product.price -
                                      (item.product.price *
                                          item.product.discount) /
                                          100
                                  ).toFixed(2)
                                : item.product.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex flex-col-reverse max-sm:self-end items-end gap-4">
                        <div className="quantity-selector flex-center bg-gray-300 p-2 rounded-full w-30%">
                            <button
                                onClick={() =>
                                    handleQuantityChange(
                                        item,
                                        item.quantity - 1
                                    )
                                }
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                                -
                            </button>

                            <span className="px-3 py-1 border border-gray-300 rounded text-center min-w-12">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() =>
                                    handleQuantityChange(
                                        item,
                                        item.quantity + 1
                                    )
                                }
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => handleRemove(item)}
                            className="text-red-500 hover:text-red-700 p-2"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CartList;
