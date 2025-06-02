import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const CouponView = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isCouponExpired = (endDate) => {
        if (!endDate) return false;
        return new Date(endDate) < new Date();
    };

    const isCouponActive = (coupon) => {
        if (isCouponExpired(coupon.endDate)) {
            return false;
        }
        return coupon.isActive;
    };

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axiosJWT.get("/api/v1/coupons");
                setCoupons(response.data.data || response.data);
            } catch (err) {
                console.error("Failed to fetch coupons:", err);
                setError("Failed to load coupons.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const activeCoupons = coupons.filter(
        (coupon) => isCouponActive(coupon) && !isCouponExpired(coupon.endDate)
    );

    if (loading) return <div className="p-4">Loading coupons...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
                All Coupons Active ({activeCoupons.length}/{coupons.length})
            </h2>

            {coupons.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    No coupons found. Add some coupons to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {" "}
                            <div className="text-center mb-4">
                                <div
                                    className={`font-bold text-lg px-4 py-2 rounded-lg ${
                                        isCouponActive(coupon)
                                            ? "bg-black text-white"
                                            : "bg-gray-400 text-gray-700"
                                    }`}
                                >
                                    {coupon.code}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {" "}
                                <div className="text-center">
                                    <div
                                        className={`text-2xl font-bold ${
                                            isCouponActive(coupon)
                                                ? "text-black"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {coupon.discountType === "percentage"
                                            ? `${coupon.discountValue}% OFF`
                                            : `$${coupon.discountValue} OFF`}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {coupon.discountType === "percentage"
                                            ? "Percentage Discount"
                                            : "Fixed Amount Discount"}
                                    </div>
                                </div>
                                {coupon.minPurchaseAmount > 0 && (
                                    <div className="bg-yellow-50 p-2 rounded-md">
                                        <div className="text-xs font-medium text-yellow-800">
                                            Min Purchase: $
                                            {coupon.minPurchaseAmount}
                                        </div>
                                    </div>
                                )}{" "}
                                {coupon.maxDiscountAmount > 0 && (
                                    <div className="bg-orange-50 p-2 rounded-md">
                                        <div className="text-xs font-medium text-orange-800">
                                            Max Discount: $
                                            {coupon.maxDiscountAmount}
                                        </div>
                                    </div>
                                )}
                                {coupon.usageLimit > 0 && (
                                    <div className="bg-purple-50 p-2 rounded-md">
                                        <div className="text-xs font-medium text-purple-800">
                                            Uses Left: {coupon.usageLimit}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            isCouponActive(coupon)
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {isCouponActive(coupon)
                                            ? "Active"
                                            : isCouponExpired(coupon.endDate)
                                            ? "Expired"
                                            : "Inactive"}
                                    </span>
                                </div>
                                <div className="border-t pt-3 space-y-1">
                                    {coupon.startDate && (
                                        <div className="text-xs text-gray-600">
                                            <span className="font-medium">
                                                Start:
                                            </span>{" "}
                                            {new Date(
                                                coupon.startDate
                                            ).toLocaleDateString()}
                                        </div>
                                    )}{" "}
                                    {coupon.endDate && (
                                        <div className="text-xs text-gray-600">
                                            <span className="font-medium">
                                                Expires:
                                            </span>{" "}
                                            {new Date(
                                                coupon.endDate
                                            ).toLocaleDateString()}
                                            {isCouponExpired(
                                                coupon.endDate
                                            ) && (
                                                <span className="ml-2 text-red-500 font-medium">
                                                    (Expired)
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 border-t pt-2">
                                    ID: {coupon._id}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CouponView;
