import {User} from "lucide-react";
import React, {useState} from "react";
import ProductQuery from "../Components/ProductQuery";
import CategoryQuery from "../Components/CategoryQuery";
import UserQuery from "../Components/UserQuery";
import CouponQuery from "../Components/CouponQuery";

const AdminPage = () => {
    const [option, setOption] = useState("products");

    const renderContent = () => {
        switch (option) {
            case "users":
                return <UserQuery />;
            case "products":
                return <ProductQuery />;
            case "orders":
                return <div>Orders Management - Coming Soon</div>;
            case "sales":
                return <div>Sales Analytics - Coming Soon</div>;
            case "categories":
                return <CategoryQuery />;
            case "coupons":
                return <CouponQuery />;
            default:
                return <ProductQuery />;
        }
    };

    return (
        <div className="flex flex-col px-8 gap-8">
            <div className="divider"></div>
            <div className="flex gap-8">
                <ul className="optionBar flex flex-col w-1/4 border-1 border-gray-300 p-4 gap-4 rounded-lg h-screen">
                    <li
                        className={`optionBar__item cursor-pointer p-2 rounded ${
                            option === "users"
                                ? "bg-gray-200 "
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => setOption("users")}
                    >
                        Users
                    </li>
                    <li
                        className={`optionBar__item cursor-pointer p-2 rounded ${
                            option === "products"
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => setOption("products")}
                    >
                        Products
                    </li>
                    <li
                        className={`optionBar__item cursor-pointer p-2 rounded ${
                            option === "orders"
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => setOption("orders")}
                    >
                        Orders
                    </li>
                    <li
                        className={`optionBar__item cursor-pointer p-2 rounded ${
                            option === "sales"
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => setOption("sales")}
                    >
                        Sales
                    </li>
                    <li
                        className={`optionBar__item cursor-pointer p-2 rounded ${
                            option === "categories"
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => setOption("categories")}
                    >
                        Categories
                    </li>
                    <li
                        className={`optionBar__item cursor-pointer p-2 rounded ${
                            option === "categories"
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => setOption("coupons")}
                    >
                        Coupons
                    </li>
                </ul>
                <div className="flex flex-col gap-4 optionContent w-3/4 p-8 border-1 border-gray-300 rounded-lg">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
