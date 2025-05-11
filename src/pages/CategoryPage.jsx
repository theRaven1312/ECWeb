import React from "react";
import Navbar from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import DirectLink from "../Components/DirectLink";
import PriceSlider from "../Components/PriceSlider";
import ColorPicker from "../Components/ColorPicker";

const CategoryPage = () => {
    const COLORS = [
        "#4CAF50",
        "#F44336",
        "#FFEB3B",
        "#FF9800",
        "#03A9F4",
        "#1E40AF",
        "#8B5CF6",
        "#EC4899",
        "#F9FAFB",
        "#000000",
    ];
    return (
        <div className="main-container items-baseline">
            <div className="divider"></div>
            <DirectLink />
            <div className="flex w-full gap-12 ">
                <div className="filter flex flex-col gap-4 p-4 w-1/4 text-gray-500 border-1 border-gray-300 rounded-3xl max-sm:hidden">
                    <div className="filter-heading flex justify-between items-center">
                        <div className="">Filters</div>
                        <i class="fa-solid fa-sliders"></i>
                    </div>

                    <div className="divider"></div>

                    <div className="filter-productTypeList flex flex-col gap-2">
                        <div className="filter-productTypeList-item">
                            <div>T-shirts</div>
                            <i class="fa-solid fa-angle-right"></i>
                        </div>
                        <div className="filter-productTypeList-item">
                            <div>Shorts</div>
                            <i class="fa-solid fa-angle-right"></i>
                        </div>
                        <div className="filter-productTypeList-item">
                            <div>Shirts</div>
                            <i class="fa-solid fa-angle-right"></i>
                        </div>
                        <div className="filter-productTypeList-item">
                            <div>Hoodie</div>
                            <i class="fa-solid fa-angle-right"></i>
                        </div>
                        <div className="filter-productTypeList-item">
                            <div>Jeans</div>
                            <i class="fa-solid fa-angle-right"></i>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="filter-price flex flex-col gap-4">
                        <div className="filter-price-heading flex justify-between items-center">
                            <div className="filter-heading">Price</div>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>
                        <PriceSlider />
                    </div>

                    <div className="divider"></div>

                    <div className="filter-color flex flex-col gap-4">
                        <div className="filter-color-heading flex justify-between items-center">
                            <div className="filter-heading">Colors</div>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>
                        <ColorPicker
                            classColorPicker={"mx-auto"}
                            colors={COLORS}
                        />
                    </div>

                    <div className="divider"></div>

                    <div className="filter-size flex flex-col gap-4">
                        <div className="filter-size-heading flex justify-between items-center">
                            <div className="filter-heading">Size</div>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>
                        <div className="filter-size-list flex flex-wrap gap-2">
                            <button className="primary-btn">Small</button>
                            <button className="primary-btn">Medial</button>
                            <button className="primary-btn">Large</button>
                            <button className="primary-btn">X-Large</button>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="filter-style flex flex-col gap-4">
                        <div className="filter-size-heading flex justify-between items-center">
                            <div className="filter-heading">Dress Style</div>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>

                        <div className="filter-productTypeList flex flex-col gap-2">
                            <div className="filter-productTypeList-item">
                                <div>T-shirts</div>
                                <i class="fa-solid fa-angle-right"></i>
                            </div>
                            <div className="filter-productTypeList-item">
                                <div>Shorts</div>
                                <i class="fa-solid fa-angle-right"></i>
                            </div>
                            <div className="filter-productTypeList-item">
                                <div>Shirts</div>
                                <i class="fa-solid fa-angle-right"></i>
                            </div>
                            <div className="filter-productTypeList-item">
                                <div>Hoodie</div>
                                <i class="fa-solid fa-angle-right"></i>
                            </div>
                            <div className="filter-productTypeList-item">
                                <div>Jeans</div>
                                <i class="fa-solid fa-angle-right"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="category-display flex flex-col w-full gap-8">
                    <div className="category-heading flex justify-between w-full">
                        <div className="heading">Category</div>
                        <div className="category-heading-detail flex gap-4">
                            <div>Showing 1-10 of 100 Products</div>
                            <div>
                                Short by: <span>Most Popular</span>
                            </div>
                        </div>
                    </div>

                    <div className="category-main flex flex-col w-full gap-8">
                        <div className="category-main-productList flex flex-wrap gap-6 justify-between max-sm:flex-col items-center">
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                            <ProductCard />
                        </div>

                        <div className="category-main-pages flex justify-between">
                            <div className="page-bth flex-center-between gap-2 py-2 px-4 rounded-2xl border-1 border-gray-300">
                                <i class="fa-solid fa-arrow-left"></i>
                                <div>Previous</div>
                            </div>

                            <ul className="category-main-pages-list flex justify-around w-1/3">
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>...</li>
                                <li>8</li>
                                <li>9</li>
                                <li>10</li>
                            </ul>

                            <div className="page-bth flex-center-between gap-2 gap-2 py-2 px-4 rounded-2xl border-1 border-gray-300">
                                <div>Next</div>
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
