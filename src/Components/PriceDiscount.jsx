const PriceDiscount = ({name, price}) => {
    return (
        <li className="price-item ">
            <p className="price-item__desc ">Discount (-{name})</p>
            <p className="price-item__price text-red-500">
                -${price.toFixed(2)}
            </p>
        </li>
    );
};

export default PriceDiscount;
