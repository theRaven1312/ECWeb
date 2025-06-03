import {useNavigate} from "react-router-dom";
import {ProfileInfo} from "../Components/ProfileInfo";
import {useDispatch, useSelector} from "react-redux";
import {resetUser} from "../redux/UserSliceRedux";
import axiosJWT from "../utils/axiosJWT";
import {useState} from "react";
import EditProfile from "../Components/EditProfile";
import EditPassword from "../Components/EditPassword";
import UserOrderHistory from "../Components/UserOrderHistory";
import {useEffect} from "react";

export const ProfilePage = () => {
    //email, phone, pass, address
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const handleLogout = async () => {
        await axiosJWT.post(`/api/v1/users/log-out`);
        dispatch(resetUser());
        localStorage.removeItem("access_token");
        navigate("/");
    };

    //Thay đổi thông tin
    const [isChanged, setIsChanged] = useState(false);

    //Thay đổi mật khẩu
    const [isChangePass, setIsChangePass] = useState(false);

    const [content, setContent] = useState("info");

    useEffect(() => {
        if (isChanged || isChangePass) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isChanged, isChangePass]);

    return (
        <div className="profile-page">
            <div className="w-[80%] h-[80%] relative flex-center flex-col bg-white rounded-3xl shadow-2xl overflow-hidden md:w-[70%] max-sm:w-[95%] max-sm:h-[97%]">
                <div className="flex-center-between w-full ">
                    <button
                        className={`w-full p-4  rounded-tl-md cursor-pointer hover:bg-gray-300 transition-colors duration-300 active:bg-gray-300 ${
                            content === "info"
                                ? "bg-gray-300 shadow-md"
                                : "bg-white"
                        }`}
                        onClick={() => setContent("info")}
                    >
                        <i className="fa-solid fa-user mr-2"></i>
                        Edit Profile
                    </button>
                    <button
                        className={`w-full p-4  rounded-tr-md cursor-pointer hover:bg-gray-300 transition-colors duration-300 active:bg-gray-300 ${
                            content === "orderHistory"
                                ? "bg-gray-300 shadow-md"
                                : "bg-white"
                        }`}
                        onClick={() => setContent("orderHistory")}
                    >
                        <i className="fa-solid fa-box mr-2"></i>
                        Order History
                    </button>
                </div>
                {content === "info" && (
                    <div className="flex-center-between w-full h-full max-sm:flex-col">
                        <div className="profile-left">
                            <i class="fa-solid fa-user p-5 bg-gray-200 text-9xl rounded-2xl max-sm:text-6xl"></i>
                            <div className="profile-left__info">
                                <h1 className="heading profile-left__name text-4xl">
                                    {user.name}
                                </h1>
                            </div>
                        </div>
                        <div className="profile-right">
                            <div className="relative">
                                <i
                                    class="fa-solid fa-pen-to-square absolute right-0 top-0 cursor-pointer"
                                    onClick={() => setIsChanged(true)}
                                ></i>
                                <h1 className="heading profile-right__heading max-sm:hidden">
                                    Information
                                </h1>
                            </div>
                            <div className="flex flex-col gap-3">
                                <ProfileInfo
                                    heading="Email"
                                    data={user.email}
                                />
                                <ProfileInfo
                                    heading="Phone"
                                    data={user.phone}
                                />
                                <ProfileInfo
                                    heading="Address"
                                    data={user.address}
                                />
                            </div>
                            <div className="flex flex-center-between max-sm:my-5">
                                <p
                                    className="profile-right__change-password"
                                    onClick={() => setIsChangePass(true)}
                                >
                                    Change password ?
                                </p>
                                <button
                                    className="right-10 bottom-10 text-lg text-red-600 underline cursor-pointer mr-2 hover:opacity-80 group transition-all duration-300"
                                    onClick={handleLogout}
                                >
                                    <span>Log Out</span>
                                    <i class="fa-solid fa-right-from-bracket ml-2 transform transition-transform duration-300 group-hover:translate-x-1 "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {content === "orderHistory" && <UserOrderHistory />}
            </div>
            {isChanged && <EditProfile onClose={() => setIsChanged(false)} />}
            {isChangePass && (
                <EditPassword onClose={() => setIsChangePass(false)} />
            )}
        </div>
    );
};
