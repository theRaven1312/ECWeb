import React from "react";
import star from "../../public/Assets/star.svg";
import RatingStar from "./RatingStar";
import {Link} from "react-router-dom";

const ProductCard = () => {
    return (
        <Link to="/product">
            <div className="productCard" onclick={window.scrollTo(0, 0)}>
                <div className="productImg w-64 h-64 bg-gray-400"></div>
                <div className="productName">Some product</div>
                <div className="productRating">
                    <div className="ratingStar">
                        <RatingStar />
                    </div>
                    <div className="ratingNumber">4/5</div>
                </div>
                <div className="productPrice">$200</div>
            </div>
        </Link>
    );
};

export default ProductCard;
