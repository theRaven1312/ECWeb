import React, {useState} from "react";

const QuantitySelector = ({
    quantity = 1,
    onQuantityChange,
    quannityClassName,
}) => {
    const [qty, setQty] = useState(quantity);

    const handleDecrease = () => {
        if (qty > 1) {
            setQty((prev) => prev - 1);
            onQuantityChange(qty - 1);
        }
    };

    const handleIncrease = () => {
        setQty((prev) => prev + 1);
        onQuantityChange(qty + 1);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value >= 1) {
            setQty(value);
            onQuantityChange(value);
        }
    };

    return (
        <div
            className={`quantity-selector flex-center bg-gray-300 h-full py-1.5 rounded-full w-30% ${quannityClassName}`}
        >
            <button
                onClick={handleDecrease}
                className="text-xl font-bold px-4 cursor-pointer w-1/10 flex-center"
                disabled={qty <= 1}
            >
                <i class="fa-solid fa-minus hover:opacity-80 max-sm:text-xs"></i>
            </button>
            <input
                type="number"
                value={qty}
                onChange={handleInputChange}
                className="quantity-input w-16 text-center py-2 border-none outline-none"
                min="1"
            />
            <button
                onClick={handleIncrease}
                className="text-xl font-bold px-4 cursor-pointer w-1/10 flex-center"
            >
                <i class="fa-solid fa-plus hover:opacity-80 max-sm:text-xs"></i>
            </button>
        </div>
    );
};

export default QuantitySelector;
