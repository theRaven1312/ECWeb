import ChooseSizeBtn from "./ChooseSizeBtn";
import QuantitySelector from "./QuanityBtn";
import RatingStar from "./RatingStar";

const ProductInfo = () => {
    const score = 4.5;
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
                <p className="price">$260</p>
                <p className="priceDiscount text-[#B3B3B3] line-through mr-4 ml-4">
                    $300
                </p>
                <div className="product-content__discount primary-btn">
                    -40%
                </div>
            </div>
            <div className="product-content__desc desc">
                This graphic t-shirt which is perfect for any occasion. Crafted
                from a soft and breathable fabric, it offers superior comfort
                and style.
            </div>
            <div className="product-content__choose desc">Select Color</div>
            <div className="product-content__choose-color ">
                <div className="color-chooser bg-red-500"></div>
                <div className="color-chooser bg-blue-400"></div>
                <div className="color-chooser bg-gray-400"></div>
            </div>
            <div className="product-content__choose desc">Choose Size</div>
            <div className="product-content__choose-size">
                <ChooseSizeBtn size="Small" />
                <ChooseSizeBtn size="Medium" />
                <ChooseSizeBtn size="Large" />
                <ChooseSizeBtn size="XLarge" />
            </div>
            <div className="product-content__choose-quanity">
                <QuantitySelector />
                <button className="primary-btn bg-black text-white  w-[400px] h-[52px] rounded-full cursor-pointer hover:opacity-80 ">
                    Add to Cart
                </button>
            </div>
        </>
    );
};

export default ProductInfo;
