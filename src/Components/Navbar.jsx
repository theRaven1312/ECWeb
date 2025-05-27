import {useState} from "react";
import arrowDown from "../../public/Assets/arrowdown.svg";
import searchIcon from "../../public/Assets/searchIcon.svg";
import cartIcon from "../../public/Assets/cart.svg";
import profile from "../../public/Assets/profile.svg";
import menu from "../../public/Assets/menu.svg";
import {Link, Navigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {resetUser} from "../redux/UserSliceRedux";
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
                            className="profile-img"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-menu__name">
                                    <i className="fa-solid fa-user mr-2"></i>
                                    {user.name}
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="dropdown-menu__info"
                                >
                                    User Info
                                </Link>
                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setDropdownOpen(false)}
                                        className="dropdown-menu__info"
                                    >
                                        Store Management
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="dropdown-menu__logout"
                                >
                                    Log Out
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
            </div>
        </div>
    );
};

export default Navbar;
