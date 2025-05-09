import {useState} from "react";

const QuantitySelector = () => {
    const [quantity, setQuantity] = useState(1);

    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex items-center space-x-4 mt-5">
            <div className="flex-center bg-gray-100 w-[170px] h-[52px] rounded-full">
                <button
                    onClick={decrease}
                    className="text-xl font-bold px-2 cursor-pointer"
                >
                    -
                </button>
                <span className="mx-4 w-4 text-center">{quantity}</span>
                <button
                    onClick={increase}
                    className="text-xl font-bold px-2 cursor-pointer"
                >
                    +
                </button>
            </div>
            <button className="primary-btn bg-black text-white  w-[400px] h-[52px] rounded-full cursor-pointer hover:opacity-80 ">
                Add to Cart
            </button>
        </div>
    );
};

export default QuantitySelector;
