import React, {useState, useEffect} from "react";
import HomePage from "./pages/HomePage";
import ProductionPage from "./pages/ProductionPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
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
import axios from "axios";
import {updateUser} from "./redux/UserSlice";

const AppContent = () => {
    const location = useLocation();
    const hideLayout = location.pathname === "/login";

    //Xử lí token khi reload lại trang
    const dispatch = useDispatch();
    const axiosJWT = axios.create();
    useEffect(() => {
        const {decode, storageData} = handleDecode();
        if (decode.id) {
            handleGetDetailUser(decode.id, storageData);
        }
    }, []);

    const handleDecode = () => {
        const storageData = localStorage.getItem("access_token");
        let decode = {};
        if (storageData) {
            decode = jwtDecode(storageData);
        }
        console.log(storageData);
        return {storageData, decode};
    };

    axiosJWT.interceptors.request.use(
        async (config) => {
            const currentTime = new Date();
            const {decode, storageData} = handleDecode();
            if (decode.exp < currentTime.getTime() / 1000) {
                const newData = await axios.post(
                    "/api/v1/users/refresh-token",
                    {withCredentials: true}
                );

                config.headers[
                    "Authorization"
                ] = `Bearer ${newData.data.accessToken}`;
            } else {
                config.headers["Authorization"] = `Bearer ${storageData}`;
            }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

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
                {/* <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/product" element={<ProductionPage />} />
                    <Route path="/category" element={<CategoryPage />} />
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
                {!hideLayout && <Footer />} */}
            {/* <ProfilePage></ProfilePage> */}
            <AdminPage/>
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
