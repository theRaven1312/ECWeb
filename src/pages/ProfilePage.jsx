import {useNavigate} from "react-router-dom";
import {ProfileInfo} from "../Components/ProfileInfo";
import {useDispatch} from "react-redux";
import {resetUser} from "../redux/UserSlice";
import axios from "axios";

export const ProfilePage = () => {
    //email, phone, pass, address
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
                            Someone
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
                        <ProfileInfo
                            heading="Email"
                            data="tranhoanghai260805@gmail.com"
                        />
                        <ProfileInfo heading="Phone" data="somedata" />
                        <ProfileInfo
                            heading="Address"
                            data="gdgadgadgdgadgadgadg"
                        />
                        <ProfileInfo heading="Password" data="somedata" />
                    </div>
                    <button
                        className="primary-btn btn-signout"
                        onClick={handleLogout}
                    >
                        Log Out
                        <i class="fa-solid fa-right-from-bracket ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
