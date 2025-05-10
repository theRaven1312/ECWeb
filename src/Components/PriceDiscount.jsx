const PriceDiscount = ({discount, priceDiscount}) => {
    return (
        <li className="price-item ">
            <p className="price-item__desc ">Discount (-{discount}%)</p>
            <p className="price-item__price text-red-500">-${priceDiscount}</p>
        </li>
    );
};

export default PriceDiscount;
