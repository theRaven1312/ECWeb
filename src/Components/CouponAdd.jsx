import {useState} from "react";
import axiosJWT from "../utils/axiosJWT";

const CouponAdd = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minPurchaseAmount: "",
        maxDiscountAmount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        isActive: true,
    });
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.discountValue || formData.discountValue <= 0) {
            setError("Discount value is required and must be greater than 0");
            return;
        }

        if (
            formData.discountType === "percentage" &&
            formData.discountValue > 100
        ) {
            setError("Percentage discount cannot exceed 100%");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const submitData = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchaseAmount: formData.minPurchaseAmount
                    ? parseFloat(formData.minPurchaseAmount)
                    : 0,
                maxDiscountAmount: formData.maxDiscountAmount
                    ? parseFloat(formData.maxDiscountAmount)
                    : 0,
            };

            // Convert date strings to Date objects if provided
            if (formData.startDate) {
                submitData.startDate = new Date(formData.startDate);
            }
            if (formData.endDate) {
                submitData.endDate = new Date(formData.endDate);
            }

            const res = await axiosJWT.post(
                "/api/v1/coupons/create-coupon",
                submitData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccess("Coupon created successfully!");
            setFormData({
                code: "",
                discountType: "percentage",
                discountValue: "",
                minPurchaseAmount: "",
                maxDiscountAmount: "",
                startDate: "",
                endDate: "",
                isActive: true,
            });
        } catch (err) {
            setError(
                "Failed to create coupon: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Leave empty for auto-generation"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave empty to auto-generate a 6-character code
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Type *
                        </label>
                        <select
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Value *
                        </label>
                        <input
                            type="number"
                            name="discountValue"
                            value={formData.discountValue}
                            onChange={handleChange}
                            placeholder={
                                formData.discountType === "percentage"
                                    ? "10"
                                    : "100"
                            }
                            step="0.01"
                            min="0"
                            max={
                                formData.discountType === "percentage"
                                    ? "100"
                                    : undefined
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.discountType === "percentage"
                                ? "Max 100%"
                                : "Amount in currency"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Purchase Amount
                        </label>
                        <input
                            type="number"
                            name="minPurchaseAmount"
                            value={formData.minPurchaseAmount}
                            onChange={handleChange}
                            placeholder="0"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>{" "}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Discount Amount
                        </label>
                        <input
                            type="number"
                            name="maxDiscountAmount"
                            value={formData.maxDiscountAmount}
                            onChange={handleChange}
                            placeholder="0"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave 0 for no limit
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usage Limit
                        </label>
                        <input
                            type="number"
                            name="usageLimit"
                            value={formData.usageLimit}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Number of times coupon can be used. Leave 0 for
                            unlimited
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                        Active Coupon
                    </label>
                </div>

                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                    {loading ? "Creating..." : "Create Coupon"}
                </button>
            </form>
        </div>
    );
};

export default CouponAdd;
