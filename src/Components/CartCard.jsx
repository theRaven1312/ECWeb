import QuanityBtn from "./QuanityBtn";

import img1 from "../../public/Assets/ProductionAssets/t-shirt1.png";
const CartCard = ({name, size, color, price}) => {
    return (
        <>
            <div className="cart-card">
                <div className="card-detail">
                    <div className="card-detail__img flex-center">
                        <img
                            src={img1}
                            alt=""
                            className="w-31 h-auto rounded-2xl max-sm:w-25"
                        />
                        {/* <div className="bg-gray-400 w-31 h-full rounded-2xl"></div> */}
                    </div>
                    <div className="flex flex-col justify-between my-1.5 max-sm:my-0">
                        <div className="cart-detail__info">
                            <h1 className="cart-detail__name">{name}</h1>
                            <p className="cart-detail__size">
                                <strong>Size:</strong> {size}
                            </p>
                            <p className="cart-detail__color">
                                <strong>Color:</strong> {color}
                            </p>
                        </div>
                        <p className="cart-detail__price">{price}</p>
                    </div>
                </div>
                <div className="card-action">
                    <button className="card-action__remove">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <QuanityBtn quannityClassName="absolute bottom-5 right-5 max-sm: w-auto max-sm:text-xs max-sm:h-2" />
                </div>
            </div>
        </>
    );
};

export default CartCard;
