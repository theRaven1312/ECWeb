import React from "react";
import HomePage from "./pages/HomePage";
import ProductionPage from "./pages/ProductionPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import {BrowserRouter as Router, Routes, Route,} from 'react-router-dom';


export const App = () => {
    return (
        <Router>
            <div>
                <Navbar/>
                    <Routes>
                        <Route path='/' element={<HomePage/>}/>
                        <Route path='/login' element={<LoginPage/>}/>
                        <Route path='/products' element={<ProductionPage/>}/>
                        <Route path='/category' element={<CategoryPage/>}/>
                        <Route path='/cart' element={<CartPage/>}/>
                    </Routes>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;
