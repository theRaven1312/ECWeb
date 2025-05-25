import {useState} from "react";
import arrowDown from "../../public/Assets/arrowdown.svg";
import searchIcon from "../../public/Assets/searchIcon.svg";
import cartIcon from "../../public/Assets/cart.svg";
import profile from "../../public/Assets/profile.svg";
import menu from "../../public/Assets/menu.svg";
import {Link, Navigate} from "react-router-dom";
import {ImageOff, Search} from "lucide-react";
import SearchBar from "./SearchBar";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {resetUser} from "../redux/UserSlice";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const user = useSelector((state) => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post(`/api/v1/users/log-out`);
        dispatch(resetUser());
        localStorage.removeItem("access_token");
        navigate("/");
    };

    return (
        <div className="navbar">
            <img src={menu} alt="menu" className="navbarMenu" />
            <div className="navbarLogo">
                <Link to="/">T3.SAHUR</Link>
            </div>
            <ul className="navbarList">
                <Link to="/category">
                    <li className="navbarListSub">
                        <span>Shop</span>
                        <img src={arrowDown} />
                    </li>
                </Link>
                <li>
                    <Link to="/category/sales">On Sales</Link>
                </li>
                <li>
                    <Link to="/category/new-arrivals">New Arrivals</Link>
                </li>
                <li>
                    <Link to="/category/top">Top Selling</Link>
                </li>
            </ul>

            <SearchBar />
            <div className="navbarCartProfile">
                <Link to="/cart">
                    <img src={cartIcon} />
                </Link>
                {user.name ? (
                    <div className="relative">
                        <img
                            src={profile}
                            alt="Profile"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="px-4 py-2 font-semibold border-b border-gray-100">
                                    <i className="fa-solid fa-user mr-2"></i>
                                    {user.name}
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block px-4 py-2 hover:bg-gray-100 font-satoshi"
                                >
                                    Thông tin người dùng
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 font-satoshi cursor-pointer"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="relative">
                        <img
                            src={profile}
                            alt="Profile"
                            className="w-6 h-6 cursor-pointer"
                        />
                    </Link>
                )}
                {user.name ? <>{user.name}</> : ""}
            </div>
        </div>
    );
};

export default Navbar;
