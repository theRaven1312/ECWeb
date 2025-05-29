import React, {useState} from "react";
import ChooseSizeBtn from "./ChooseSizeBtn";
import ColorPicker from "./ColorPicker";
import QuantitySelector from "./QuanityBtn";
import RatingStar from "./RatingStar";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";

const ProductInfo = ({
    heading,
    price,
    desc,
    colors,
    sizes,
    rating,
    numReviews,
}) => {
    const [selectedColor, setSelectedColor] = useState("");
    const location = useLocation(); // State to track selected color (single selection)
    const user = useSelector((state) => state.user.user); // Get user from Redux store
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    const COLORS = colors;

    // Handler to convert single color selection to array format for ColorPicker
    const handleColorSelect = (colorsArray) => {
        if (colorsArray.length > 0) {
            const newColor = colorsArray[colorsArray.length - 1]; // Get the last selected color
            setSelectedColor(newColor);
        } else {
            setSelectedColor(""); // No color selected
        }
    };
    const discount = 50; // Example discount percentage
    const discountPrice = price - (price * discount) / 100;

    const handleAddToCart = () => {
        if (!user) {
            navigate("/login", {state: location.pathname}); // Redirect to login if user is not logged in
        }
    };

    return (
        <>
            {" "}
            <h1 className="product-content__heading heading">{heading}</h1>
            <div className="product-content__feedback">
                <RatingStar rating={rating} />
                <p className="product-content__feedback-score desc">
                    {rating}/5
                </p>
            </div>
            <div className="product-content__price">
                <p className="price">${discountPrice}</p>
                <p className="priceDiscount text-[#B3B3B3] line-through mr-4 ml-4">
                    ${price}
                </p>
                <div className="product-content__discount primary-btn">
                    -{discount}%
                </div>
            </div>
            <div className="product-content__desc desc">{desc}</div>
            <div className="product-content__choose desc">
                Select Color
            </div>{" "}
            <ColorPicker
                colors={COLORS}
                selectedColors={selectedColor ? [selectedColor] : []} // Convert single color to array format
                onColorSelect={handleColorSelect} // Use custom handler
            />
            <div className="product-content__choose desc">Choose Size</div>
            <div className="product-content__choose-size">
                {sizes.map((size) => (
                    <ChooseSizeBtn key={size} size={size} />
                ))}
            </div>
            <div className="product-content__choose-quanity flex-center-between gap-5 mt-5">
                <QuantitySelector />
                <button
                    className="product-content__cartbtn primary-btn w-full"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            </div>
        </>
    );
};

export default ProductInfo;
