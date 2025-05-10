import DirectLink from "../Components/DirectLink";
import CartList from "../Components/CartList";
import CartPrice from "../Components/CartPrice";

const CartPage = () => {
    return (
        <>
            {/* Underline-navbar */}
            <div class="flex flex-col flex-center">
                <div className="w-[80%] h-px bg-gray-300"></div>
            </div>

            {/* Direction Link */}
            <ol className="direction">
                <a href="#!">Home</a>
                <DirectLink link="Cart" linkClassName="activeLink" />
            </ol>

            {/* Cart-heading */}
            <h1 className="cart-heading heading">YOUR CART</h1>

            {/* Cart */}
            <div className="cart">
                <CartList />
                <CartPrice />
            </div>
        </>
    );
};

export default CartPage;
