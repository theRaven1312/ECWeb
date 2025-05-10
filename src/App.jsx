import React from "react";
import HomePage from "./pages/HomePage";
import ProductionPage from "./pages/ProductionPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CartPage from "./pages/CartPage";

export const App = () => {
    return (
        <div>
            <Navbar />
            {/* <HomePage /> */}
            <ProductionPage />
            {/* <CartPage /> */}
            <Footer />
        </div>
    );
};

export default App;
