import React from "react";
import email from "../../public/Assets/email.svg";
import fb from "../../public/Assets/fb.svg";
import ins from "../../public/Assets/ins.svg";
import github from "../../public/Assets/github.svg";
import {useState} from "react";
import axiosJWT from "../utils/axiosJWT";
import {useSelector, useDispatch} from "react-redux";
import {updateUser} from "../redux/UserSliceRedux";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const user = useSelector((state) => state.user);
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            if (email.trim() === "") {
                setError("Please enter a valid email address.");
                setTimeout(() => {
                    setError("");
                }, 5000);
                return;
            }
            if (user.isSubscribe) {
                setError("You are already subscribed.");
                setTimeout(() => {
                    setError("");
                }, 5000);
                return;
            }
            setLoading(true);
            const response = await axiosJWT.post("/api/v1/users/send-coupon", {
                email,
                couponCode: "NEWBIE",
            });

            if (response.data.status === "OK") {
                // Update Redux store with the updated user data from backend
                if (response.data.user) {
                    dispatch(
                        updateUser({
                            ...user,
                            isSubscribe: true,
                            // Include any other updated fields from the backend
                            ...response.data.user,
                        })
                    );
                }
                setMessage("Coupon sent successfully!");
            } else {
                setError("Failed to send coupon. Please try again.");
            }
        } catch (error) {
            setError("Error sending coupon. Please try again later.");
        } finally {
            setLoading(false);
            setEmail("");
            setTimeout(() => {
                setMessage("");
            }, 5000); // Clear message after 5 seconds
            setTimeout(() => {
                setError("");
            }, 5000); // Clear error after 5 seconds
        }
    };

    return (
        <div className="footer">
            <div className="emailPrompt">
                <div className="textPromt">
                    stay upto date about our latest offers
                </div>

                {message ? (
                    <div className="text-green-500 text-lg font-bold">
                        {message}
                    </div>
                ) : (
                    <div className="submitField">
                        <div className="inputEmail flex-center">
                            <i class="fa-solid fa-envelope text-lg"></i>

                            <input
                                className="w-full "
                                placeholder="Enter your email address"
                                type="text"
                                onChange={handleEmailChange}
                                value={email}
                            ></input>
                        </div>
                        <button
                            className="submitEmail"
                            onClick={handleEmailSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </div>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mainFooter">
                <div className="infoList">
                    <div className="shopInfo">
                        <div className="navbarLogo">T3.SHAUR</div>
                        <p className="text-sub">
                            We are a tutor to your high fashion life style. We
                            are a tutor to your high fashion life style
                        </p>
                        <div className="socialList">
                            <div className="iconHolder">
                                <img className="socialIcon" src={fb} />
                            </div>
                            <div className="iconHolder">
                                <img className="socialIcon" src={ins} />
                            </div>
                            <a
                                className="iconHolder"
                                href="https://github.com/theRaven1312/ECWeb"
                                target="_blank"
                            >
                                <img className="socialIcon" src={github} />
                            </a>
                        </div>
                    </div>

                    <div class="otherInfo">
                        <div class="infoHead">HELP</div>
                        <div class="infoItemList">
                            <div class="infoItem">Customer Support</div>
                            <div class="infoItem">Delivery Details</div>
                            <div class="infoItem">Terms & Conditions</div>
                            <div class="infoItem">Privacy Policy</div>
                        </div>
                    </div>

                    <div class="otherInfo">
                        <div class="infoHead">FAQ</div>
                        <div class="infoItemList">
                            <div class="infoItem">Account</div>
                            <div class="infoItem">Manage Delivery</div>
                            <div class="infoItem">Orders</div>
                            <div class="infoItem">Payments</div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-300 self-center mt-10 mb-4"></div>

                <div className="text-sub text-xs">Copy right T3.SAHUR 2024</div>
            </div>
        </div>
    );
};

export default Footer;
