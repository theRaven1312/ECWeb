import React from "react";
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

const AppContent = () => {
    const location = useLocation();
    const hideLayout = location.pathname === "/login";

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
