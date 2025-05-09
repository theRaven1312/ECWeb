import React from 'react'
import HomePage from './pages/HomePage'
import ProductionPage from './pages/ProductionPage'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'


export const App = () => {
  return (
    <div>
      <Navbar/>
      <HomePage/>
      <Footer/>
    </div>
  )
}

export default App
