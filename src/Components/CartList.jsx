import CartCard from "./CartCard";
const CartList = () => {
    return (
        <div className="cart-list">
            <CartCard
                size="Large"
                name="Gradien Graphic T-shirt"
                color="White"
                price="$145"
            />
            <CartCard
                size="Large"
                name="Gradien Graphic T-shirt"
                color="White"
                price="$145"
            />
            <CartCard
                size="Large"
                name="Gradien Graphic T-shirt"
                color="White"
                price="$145"
            />
        </div>
    );
};

export default CartList;
