import {useState} from "react";

const QuantitySelector = ({quannityClassName}) => {
    const [quantity, setQuantity] = useState(1);

    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div
            className={`flex-center bg-gray-300 min-h-[52px] rounded-full w-30% ${quannityClassName}`}
        >
            <button
                onClick={decrease}
                className="text-xl font-bold px-4 cursor-pointer w-1/10 flex-center"
            >
                <i class="fa-solid fa-minus hover:opacity-80"></i>
            </button>
            <span className="mx-4 text-center font-bold">{quantity}</span>
            <button
                onClick={increase}
                className="text-xl font-bold px-4 cursor-pointer w-1/10 flex-center"
            >
                <i class="fa-solid fa-plus hover:opacity-80"></i>
            </button>
        </div>
    );
};

export default QuantitySelector;
