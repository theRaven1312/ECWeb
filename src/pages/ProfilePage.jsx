import {useNavigate} from "react-router-dom";
import {ProfileInfo} from "../Components/ProfileInfo";
import {useDispatch, useSelector} from "react-redux";
import {resetUser} from "../redux/UserSlice";
import axios from "axios";

export const ProfilePage = () => {
    //email, phone, pass, address
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    console.log(user);
    const handleLogout = async () => {
        await axios.post(`/api/v1/users/log-out`);
        dispatch(resetUser());
        localStorage.removeItem("access_token");
        navigate("/");
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-left">
                    <i class="fa-solid fa-user p-5 bg-gray-200 text-9xl rounded-2xl"></i>
                    <div className="profile-left__info">
                        <h1 className="heading profile-left__name text-4xl">
                            {user.name}
                        </h1>
                        <h1 className="profile-left__rank">Diamon</h1>
                    </div>
                </div>
                <div className="profile-right">
                    <div className="relative">
                        <i class="fa-solid fa-pen-to-square absolute right-0 top-0 cursor-pointer"></i>
                        <h1 className="heading profile-right__heading">
                            Information
                        </h1>
                    </div>
                    <div className="flex flex-col gap-3">
                        <ProfileInfo heading="Email" data={user.email} />
                        <ProfileInfo heading="Phone" data={user.phone} />
                        <ProfileInfo heading="Address" data={user.address} />
                    </div>
                    <div className="flex flex-center-between">
                        <p className="profile-right__change-password">
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
        </div>
    );
};
