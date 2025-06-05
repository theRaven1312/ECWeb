import {useEffect, useState} from "react";
import arrowDown from "../../public/Assets/arrowdown.svg";
import cartIcon from "../../public/Assets/cart.svg";
import profile from "../../public/Assets/profile.svg";
import menu from "../../public/Assets/menu.svg";
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar";
import {useDispatch, useSelector} from "react-redux";
import axiosJWT from "../utils/axiosJWT";
import {resetUser} from "../redux/UserSliceRedux";
import {useNavigate} from "react-router-dom";
import {setCartQuantity} from "../redux/CartSliceRedux";

const Navbar = () => {
    const user = useSelector((state) => state.user);
    const quantity = useSelector((state) => state.cart.quantity);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Fetch cart quantity when user changes
    useEffect(() => {
        const fetchCartQuantity = async () => {
            if (user?.access_token || user?._id) {
                try {
                    const response = await axiosJWT.get("/api/v1/cart");
                    const cart = response.data.cart;
                    const items = cart?.products || [];
                    const totalItems = items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    );
                    dispatch(setCartQuantity(totalItems));
                } catch (error) {
                    console.error("Error fetching cart quantity:", error);
                    dispatch(setCartQuantity(0));
                }
            } else {
                dispatch(setCartQuantity(0));
            }
        };

        fetchCartQuantity();
    }, [user, dispatch]);

    const handleLogout = async () => {
        await axiosJWT.post(`/api/v1/users/log-out`);
        dispatch(resetUser());
        dispatch(setCartQuantity(0)); // ✅ Reset cart quantity on logout
        localStorage.removeItem("access_token");
        navigate("/");
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <div className="navbar">
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <img src={menu} alt="menu" className="w-6 h-6" />
                </button>{" "}
                <div className="navbarLogo">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo(0, 0)}
                        className="navbar-logo"
                    >
                        T3.SAHUR
                    </Link>
                </div>{" "}
                {/* Desktop Navigation */}
                <ul className="navbarList">
                    <Link to="/category">
                        <li className="navbarListSub">
                            <span className="navbar-link">Shop</span>
                        </li>
                    </Link>
                    <li>
                        <Link to="/category/sales" className="navbar-link">
                            On Sales
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/category/new-arrivals"
                            className="navbar-link"
                        >
                            New Arrivals
                        </Link>
                    </li>
                    <li>
                        <Link to="/category/top" className="navbar-link">
                            Top Selling
                        </Link>
                    </li>
                </ul>
                {/* Desktop SearchBar */}
                <div className="hidden md:block">
                    <SearchBar />
                </div>{" "}
                <div className="navbarCartProfile">
                    <Link to="/cart" className="navbar-icon">
                        <div className="relative">
                            {quantity > 0 && (
                                <div className="navbar-cart-badge">
                                    {quantity}
                                </div>
                            )}
                            <img src={cartIcon} alt="cart" />
                        </div>
                    </Link>

                    {user.name ? (
                        <div className="relative">
                            <img
                                src={profile}
                                alt="Profile"
                                className="profile-img navbar-profile max-sm:hidden"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            />
                            {dropdownOpen && (
                                <div className="dropdown-menu max-sm:hidden">
                                    <div className="dropdown-menu__name">
                                        <i className="fa-solid fa-user mr-2"></i>
                                        {user.name}
                                    </div>{" "}
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
                                            onClick={() =>
                                                setDropdownOpen(false)
                                            }
                                            className="dropdown-menu__info"
                                        >
                                            Store Management
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="dropdown-menu__logout dropdown-logout"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="relative navbar-icon">
                            <img
                                src={profile}
                                alt="Profile"
                                className="w-6 h-6 cursor-pointer"
                            />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Menu Dropdown */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="text-2xl font-bold font-integral">
                            T3.SAHUR
                        </div>
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <i className="fa-solid fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Mobile SearchBar */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <SearchBar onSearch={closeMobileMenu} />
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 py-6">
                        <ul className="space-y-2">
                            {" "}
                            <li>
                                <Link
                                    to="/category"
                                    className="flex items-center justify-between px-6 py-4 text-lg font-medium mobile-nav-link"
                                    onClick={closeMobileMenu}
                                >
                                    <span>Shop</span>
                                    <img
                                        src={arrowDown}
                                        alt="arrow"
                                        className="mobile-nav-arrow"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/category/sales"
                                    className="block px-6 py-4 text-lg mobile-nav-link"
                                    onClick={closeMobileMenu}
                                >
                                    On Sales
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/category/new-arrivals"
                                    className="block px-6 py-4 text-lg mobile-nav-link"
                                    onClick={closeMobileMenu}
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/category/top"
                                    className="block px-6 py-4 text-lg mobile-nav-link"
                                    onClick={closeMobileMenu}
                                >
                                    Top Selling
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-200 p-6">
                        {user.name ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                    <img
                                        src={profile}
                                        alt="Profile"
                                        className="w-10 h-10"
                                    />
                                    <div>
                                        <div className="font-medium">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Welcome back!
                                        </div>
                                    </div>
                                </div>{" "}
                                <Link
                                    to="/profile"
                                    className="mobile-user-link"
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fa-solid fa-user w-5"></i>
                                    <span>User Info</span>
                                </Link>
                                <Link
                                    to="/cart"
                                    className="mobile-user-link"
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fa-solid fa-shopping-cart w-5"></i>
                                    <span>Cart</span>
                                </Link>
                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="mobile-user-link"
                                        onClick={closeMobileMenu}
                                    >
                                        <i className="fa-solid fa-cog w-5"></i>
                                        <span>Store Management</span>
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    className="mobile-logout-btn"
                                >
                                    <i className="fa-solid fa-sign-out-alt w-5"></i>
                                    <span>Log Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {" "}
                                <Link
                                    to="/login"
                                    className="mobile-signin-btn"
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/cart"
                                    className="mobile-cart-link"
                                    onClick={closeMobileMenu}
                                >
                                    <i className="fa-solid fa-shopping-cart"></i>
                                    <span>View Cart</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
