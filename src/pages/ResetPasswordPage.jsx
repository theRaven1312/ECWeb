import {useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {set} from "mongoose";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const user = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Confirm password is not the same as new password");
            return;
        }

        try {
            const res = await axios.post(
                `/api/v1/users/reset-password/${user.token}`,
                {
                    password: newPassword,
                }
            );
            if (res.data.status === "OK") {
                setSuccess(res.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Unexpected Error");
        }
    };

    return (
        <div className="w-screen h-screen flex-center bg-linear-to-r from-[#e2e2e2] to-[#c9d6ff]">
            <div className="w-[50%] h-[50%] relative flex-center flex-col gap-5  bg-white rounded-3xl shadow-2xl overflow-hidden md:w-[70%] max-sm:w-[95%] max-sm:h-[97%]">
                <div className="login-form w-full px-40">
                    <h2 className="login-form__heading heading text-center mb-5">
                        RESET PASSWORD
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="login-form__input">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="login-form__input">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        {error && (
                            <div className="text-red-600 font-sans font-bold text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-green-600 font-sans font-bold text-center">
                                {success}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full primary-btn bg-black text-white hover:opacity-80 rounded-lg"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
