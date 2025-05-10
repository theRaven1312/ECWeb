import QuanityBtn from "./QuanityBtn";
const CartCard = ({name, size, color, price}) => {
    return (
        <>
            <div className="cart-card">
                <div className="card-detail">
                    <div className="card-detail__img">
                        <div className="bg-gray-400 w-31 h-31 rounded-2xl"></div>
                    </div>
                    <div className="flex flex-col justify-between my-1.5">
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
                    <QuanityBtn quannityClassName="absolute bottom-5 right-5" />
                </div>
            </div>
        </>
    );
};

export default CartCard;
