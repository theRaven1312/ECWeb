import React, {useState, useEffect} from "react";
import HomePage from "./pages/HomePage";
import ProductionPage from "./pages/ProductionPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ScrollToTop from "./Components/ScrollToTop";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import {ProfilePage} from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import {useDispatch} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {updateUser} from "./redux/UserSliceRedux.js";
import axiosJWT from "../backend/utils/aixosJWT.js";

const AppContent = () => {
    const location = useLocation();
    const hideLayout = location.pathname === "/login";

    const dispatch = useDispatch();
    useEffect(() => {
        const storageData = localStorage.getItem("access_token");
        const decode = storageData ? jwtDecode(storageData) : null;

        if (decode && decode.id) {
            handleGetDetailUser(decode.id, storageData);
        }
    }, []);

    const handleGetDetailUser = async (id, token) => {
        const res = await axiosJWT.get(`/api/v1/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(updateUser({...res.data.data, access_token: token}));
    };

    return (
        <>
            <Navbar />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product/:id" element={<ProductionPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                />
                <Route
                    path="/category/sales"
                    element={<CategoryPage heading={"On Sales"} />}
                />
                <Route
                    path="/category/new-arrivals"
                    element={<CategoryPage heading={"New arrivals"} />}
                />
                <Route
                    path="/category/top"
                    element={<CategoryPage heading={"Top Selling"} />}
                />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
            {!hideLayout && <Footer />}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
