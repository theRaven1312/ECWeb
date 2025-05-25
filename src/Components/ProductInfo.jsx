import ChooseSizeBtn from "./ChooseSizeBtn";
import ColorPicker from "./ColorPicker";
import QuantitySelector from "./QuanityBtn";
import RatingStar from "./RatingStar";

const ProductInfo = () => {
    const score = 4.5;
    const price = 300;
    const discountPrice = 200;
    const discount = 40;
    const COLORS = ["gray", "blue", "red"];
    
    return (
        <>
            <h1 className="product-content__heading heading">
                ONE LIFE GRAPHIC T SHIRT
            </h1>
            <div className="product-content__feedback">
                <RatingStar />
                <p className="product-content__feedback-score desc">
                    {score}/5
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
            <div className="product-content__desc desc">
                This graphic t-shirt which is perfect for any occasion. Crafted
                from a soft and breathable fabric, it offers superior comfort
                and style.
            </div>
            <div className="product-content__choose desc">Select Color</div>
            <ColorPicker colors={COLORS} />
            <div className="product-content__choose desc">Choose Size</div>
            <div className="product-content__choose-size">
                <ChooseSizeBtn size="Small" />
                <ChooseSizeBtn size="Medium" />
                <ChooseSizeBtn size="Large" />
                <ChooseSizeBtn size="XLarge" />
            </div>
            <div className="product-content__choose-quanity flex gap-5 mt-5">
                <QuantitySelector />
                <button className="product-content__cartbtn primary-btn">
                    Add to Cart
                </button>
            </div>
        </>
    );
};

export default ProductInfo;
