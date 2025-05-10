import PriceDiscount from "./PriceDiscount";

const CartPrice = () => {
    return (
        <div className="cart-price">
            <div className="p-5 flex flex-col gap-5 max-sm:gap-3">
                <h1 className="cart-price__heading">Order Summary</h1>
                <ol className="cart-price__detail">
                    <li className="price-item ">
                        <p className="price-item__desc ">Subtotal</p>
                        <p className="price-item__price ">$700</p>
                    </li>
                    <PriceDiscount discount={20} priceDiscount={115} />
                    <PriceDiscount discount={20} priceDiscount={115} />
                    <PriceDiscount discount={20} priceDiscount={115} />
                    <li className="price-item ">
                        <p className="price-item__desc ">Delivery Fee</p>
                        <p className="price-item__price ">$15</p>
                    </li>
                </ol>
                <div className="w-[90%] h-px bg-gray-300 mx-auto"></div>
                <div className="cart-price__total">
                    <p className="cart-price__total--desc">Total</p>
                    <p className="cart-price__total--price">$467</p>
                </div>
                <div className="cart-price__promocode">
                    <input
                        type="text"
                        placeholder="Add promo code"
                        className="cart-price__promocode--input"
                    />
                    <i class="fa-solid fa-tag"></i>
                    <button className=" cart-price__promocode--sumbit">
                        Apply
                    </button>
                </div>
                <button className=" cart-price__btn">
                    Go to Checkout <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};

export default CartPrice;
