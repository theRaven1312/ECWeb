import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const CouponDelete = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            }
        };

        fetchCoupons();
    }, []);
    const handleDelete = async (couponId, couponCode) => {
        if (
            !window.confirm(
                `Are you sure you want to delete coupon "${couponCode}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await axiosJWT.delete(`/api/v1/coupons/delete-coupon/${couponId}`);

            setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
            setSuccess(`Coupon "${couponCode}" deleted successfully!`);
        } catch (err) {
            console.error("Failed to delete coupon:", err);
            setError(
                "Failed to delete coupon: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Delete Coupons</h2>
            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">
                    {success}
                </div>
            )}
            {loading && <div className="text-gray-500 mb-4">Processing...</div>}{" "}
            {coupons.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    No coupons found to delete.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="mb-3">
                                <h3 className="font-bold text-gray-900 text-xl ">
                                    {coupon.code}
                                </h3>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Type:
                                        </span>{" "}
                                        {coupon.discountType === "percentage"
                                            ? "Percentage"
                                            : "Fixed Amount"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Value:
                                        </span>{" "}
                                        {coupon.discountType === "percentage"
                                            ? `${coupon.discountValue}%`
                                            : `$${coupon.discountValue}`}
                                    </p>
                                    {coupon.minPurchaseAmount > 0 && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Min Purchase:
                                            </span>{" "}
                                            ${coupon.minPurchaseAmount}
                                        </p>
                                    )}{" "}
                                    {coupon.maxDiscountAmount > 0 && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Max Discount:
                                            </span>{" "}
                                            ${coupon.maxDiscountAmount}
                                        </p>
                                    )}
                                    {coupon.usageLimit > 0 && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                Uses Left:
                                            </span>{" "}
                                            {coupon.usageLimit}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Status:
                                        </span>{" "}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                isCouponActive(coupon)
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {isCouponActive(coupon)
                                                ? "Active"
                                                : isCouponExpired(
                                                      coupon.endDate
                                                  )
                                                ? "Expired"
                                                : "Inactive"}
                                        </span>
                                    </p>
                                    {coupon.endDate && (
                                        <p className="text-xs text-gray-500">
                                            <span className="font-medium">
                                                Expires:
                                            </span>{" "}
                                            {new Date(
                                                coupon.endDate
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    handleDelete(coupon._id, coupon.code)
                                }
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Delete Coupon
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CouponDelete;
