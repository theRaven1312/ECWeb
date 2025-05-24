import React from "react";
import arrowDown from "../../public/Assets/arrowdown.svg";
import searchIcon from "../../public/Assets/searchIcon.svg";
import cartIcon from "../../public/Assets/cart.svg";
import profile from "../../public/Assets/profile.svg";
import menu from "../../public/Assets/menu.svg";
import {Link} from "react-router-dom";
import {Search} from "lucide-react";
import SearchBar from "./SearchBar";
import {useSelector} from "react-redux";

const Navbar = () => {
    const user = useSelector((state) => state.user);

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
                <Link to="/login">
                    <img src={profile} />
                </Link>
                {user.name ? <span>{user.name}</span> : ""}
            </div>
        </div>
    );
};

export default Navbar;
