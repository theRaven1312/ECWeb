import React from "react";
import HomePage from "./pages/HomePage";
import ProductionPage from "./pages/ProductionPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";

export const App = () => {
    return (
        <div>
            <LoginPage />
            {/* <Navbar />
            <HomePage />
            <ProductionPage />
            <CartPage />
            <CategoryPage />
            <Footer /> */}
        </div>
    );
};

export default App;
