import React, {useState} from "react";
import CouponAdd from "./CouponAdd";
import CouponView from "./CouponView";
import CouponUpdate from "./CouponUpdate";
import CouponDelete from "./CouponDelete";
import CouponSend from "./CouponSend";

const CouponQuery = () => {
    const [activeTab, setActiveTab] = useState("view");

    const renderContent = () => {
        switch (activeTab) {
            case "view":
                return <CouponView />;
            case "add":
                return <CouponAdd />;
            case "update":
                return <CouponUpdate />;
            case "delete":
                return <CouponDelete />;
            case "send":
                return <CouponSend />;
            default:
                return <CouponView />;
        }
    };

    return (
        <div className="w-full">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "view"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("view")}
                >
                    View Coupons
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "add"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("add")}
                >
                    Add Coupon
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "update"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("update")}
                >
                    Update Coupon
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "delete"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("delete")}
                >
                    Delete Coupon
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "send"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("send")}
                >
                    Send Coupon
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm">
                {renderContent()}
            </div>
        </div>
    );
};

export default CouponQuery;
