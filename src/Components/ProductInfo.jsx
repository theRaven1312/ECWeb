import React, {useState} from "react";
import ChooseSizeBtn from "./ChooseSizeBtn";
import ColorPicker from "./ColorPicker";
import QuantitySelector from "./QuanityBtn";
import RatingStar from "./RatingStar";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import axiosJWT from "../utils/axiosJWT";
import {useDispatch} from "react-redux";
import {addToCart} from "../redux/CartSliceRedux"; // ✅ Import Redux action

const ProductInfo = ({
    heading,
    price,
    discount = 0,
    desc,
    colors,
    sizes,
    rating,
    numReviews,
    productId,
    isSold = 0,
}) => {
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState(""); // ✅ Add size state
    const [quantity, setQuantity] = useState(1); // ✅ Add quantity state
    const dispatch = useDispatch();
    const [isAddingToCart, setIsAddingToCart] = useState(false); // ✅ Add loading state
    const [addToCartMessage, setAddToCartMessage] = useState(""); // ✅ Add message state

    const location = useLocation();
    const user = useSelector((state) => state.user); // ✅ Fix selector
    const navigate = useNavigate();
    const COLORS = colors;

    // Handler to convert single color selection to array format for ColorPicker
    const handleColorSelect = (colorsArray) => {
        if (colorsArray.length > 0) {
            const newColor = colorsArray[colorsArray.length - 1];
            setSelectedColor(newColor);
        } else {
            setSelectedColor("");
        }
    };

    // ✅ Handler for size selection
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    }; // ✅ Handler for quantity change
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    // Calculate discounted price using the discount prop
    const discountPrice =
        discount > 0 ? price - (price * discount) / 100 : price;

    // ✅ Complete handleAddToCart function
    const handleAddToCart = async () => {
        // Check if user is logged in
        if (!user?.access_token) {
            navigate("/login", {state: {from: location.pathname}});
            return;
        }

        // Validation
        if (colors && colors.length > 0 && !selectedColor) {
            setAddToCartMessage("Please select a color");
            setTimeout(() => setAddToCartMessage(""), 3000);
            return;
        }

        if (sizes && sizes.length > 0 && !selectedSize) {
            setAddToCartMessage("Please select a size");
            setTimeout(() => setAddToCartMessage(""), 3000);
            return;
        }

        if (quantity <= 0) {
            setAddToCartMessage("Please select a valid quantity");
            setTimeout(() => setAddToCartMessage(""), 3000);
            return;
        }
        try {
            setIsAddingToCart(true);
            setAddToCartMessage("");

            const response = await axiosJWT.post("/api/v1/cart/add", {
                productId: productId,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor,
            });
            if (response.data.status === "SUCCESS") {
                setAddToCartMessage("Product added to cart successfully!");
                setTimeout(() => setAddToCartMessage(""), 3000);

                // ✅ Update Redux cart quantity
                dispatch(addToCart(quantity));

                // Optional: Reset selections after successful add
                // setSelectedColor("");
                // setSelectedSize("");
                // setQuantity(1);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);

            if (error.response?.status === 401) {
                setAddToCartMessage("Please login again");
                navigate("/login", {state: {from: location.pathname}});
            } else {
                setAddToCartMessage(
                    error.response?.data?.message ||
                        "Failed to add product to cart"
                );
            }
            setTimeout(() => setAddToCartMessage(""), 5000);
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (numReviews > 1000) {
        numReviews = (numReviews / 1000).toFixed(1) + "K";
    }

    if (isSold > 1000) {
        isSold = (isSold / 1000).toFixed(1) + "K";
    }

    return (
        <>
            <h1 className="product-content__heading font-sans uppercase font-extrabold heading">
                {heading}
            </h1>
            <div className="flex-center-between">
                <div className="flex gap-5">
                    <div className="product-content__feedback">
                        <RatingStar rating={rating} />
                        <p className="product-content__feedback-score desc">
                            {rating}/5
                        </p>
                    </div>
                    <div className="product-content__feedback">
                        <p className="product-content__feedback-score desc">
                            ({numReviews} Reviews)
                        </p>
                    </div>
                </div>
                <div className="product-content__feedback">
                    <p className="product-content__feedback-score desc mr-15">
                        Have sold: {isSold}
                    </p>
                </div>
            </div>
            <div className="product-content__price">
                {discount > 0 ? (
                    <>
                        <p className="price">${discountPrice.toFixed(2)}</p>
                        <p className="priceDiscount text-[#B3B3B3] line-through mr-4 ml-4">
                            ${price.toFixed(2)}
                        </p>
                        <div className="product-content__discount primary-btn">
                            -{discount}%
                        </div>
                    </>
                ) : (
                    <p className="price">${price.toFixed(2)}</p>
                )}
            </div>
            <div className="product-content__desc desc">{desc}</div>
            {/* Color Selection */}
            {colors && colors.length > 0 && (
                <>
                    <div className="product-content__choose desc">
                        Select Color
                        {selectedColor && (
                            <span className="ml-2 text-sm text-gray-600">
                                (Selected: {selectedColor})
                            </span>
                        )}
                    </div>
                    <ColorPicker
                        colors={COLORS}
                        selectedColors={selectedColor ? [selectedColor] : []}
                        onColorSelect={handleColorSelect}
                    />
                </>
            )}
            {/* Size Selection */}
            {sizes && sizes.length > 0 && (
                <>
                    <div className="product-content__choose desc">
                        Choose Size
                        {selectedSize && (
                            <span className="ml-2 text-sm text-gray-600">
                                (Selected: {selectedSize})
                            </span>
                        )}
                    </div>
                    <div className="product-content__choose-size">
                        {sizes.map((size) => (
                            <ChooseSizeBtn
                                key={size}
                                size={size}
                                isSelected={selectedSize === size}
                                onSelect={() => handleSizeSelect(size)}
                            />
                        ))}
                    </div>
                </>
            )}
            {/* Add to Cart Message */}
            {addToCartMessage && (
                <div
                    className={`mt-4 p-3 rounded-lg text-sm ${
                        addToCartMessage.includes("successfully")
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {addToCartMessage}
                </div>
            )}
            {/* Quantity and Add to Cart */}
            <div className="product-content__choose-quanity flex-center-between gap-5 mt-5">
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                />
                <button
                    className={`product-content__cartbtn primary-btn w-full ${
                        isAddingToCart ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                >
                    {isAddingToCart ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            Adding...
                        </>
                    ) : (
                        "Add to Cart"
                    )}
                </button>
            </div>
        </>
    );
};

export default ProductInfo;
