import axios from "axios";
import {useState} from "react";
import axiosJWT from "../utils/axiosJWT";

const CouponSend = () => {
    const [email, setEmail] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [sendToAll, setSendToAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        if (sendToAll) {
            try {
                const response = await axiosJWT.post(
                    "/api/v1/users/send-all-coupons",
                    {
                        email: sendToAll ? "" : email,
                        couponCode,
                    }
                );

                if (response.data.status === "OK") {
                    setMessage("Coupon sent successfully!");
                    setEmail("");
                    setCouponCode("");
                } else {
                    setMessage("Failed to send coupon. Please try again.");
                }
            } catch (error) {
                setMessage("Error sending coupon");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await axiosJWT.post(
                    "/api/v1/users/send-coupon",
                    {
                        email,
                        couponCode,
                    }
                );

                if (response.data.status === "OK") {
                    setMessage("Coupon sent successfully!");
                    setEmail("");
                    setCouponCode("");
                } else {
                    setMessage("Failed to send coupon. Please try again.");
                }
            } catch (error) {
                setMessage("Error sending coupon");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Send Coupon</h2>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                {/* Send to All Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    {sendToAll ? (
                        <span className="text-sm font-medium text-gray-700">
                            Send to all users
                        </span>
                    ) : (
                        <span className="text-sm font-medium text-gray-700">
                            Send to one user
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setSendToAll(!sendToAll);
                            setEmail("");
                            setCouponCode("");
                            setMessage("");
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors  ${
                            sendToAll ? "bg-black" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                sendToAll ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Input (only show if not sending to all) */}
                    {!sendToAll && (
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={!sendToAll}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md "
                                placeholder="Enter customer email"
                            />
                        </div>
                    )}

                    {/* Coupon Code Input */}
                    <div>
                        <label
                            htmlFor="couponCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Coupon Code *
                        </label>
                        <input
                            type="text"
                            id="couponCode"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter coupon code"
                        />
                    </div>
                </div>

                {message && (
                    <div
                        className={`p-3 rounded-md text-sm ${
                            message.startsWith("")
                                ? "text-green-600 bg-green-50"
                                : "text-red-500 bg-red-50"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                        </div>
                    ) : sendToAll ? (
                        "Send to All Users"
                    ) : (
                        "Send Coupon"
                    )}
                </button>
            </form>
        </div>
    );
};

export default CouponSend;
