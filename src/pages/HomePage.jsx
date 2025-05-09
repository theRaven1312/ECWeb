import React from 'react'
import Navbar from '../Components/Navbar'
import Prompt from '../Components/Prompt'
import { Hero } from '../Components/Hero'
import BlackStripe from '../Components/BlackStripe'
import FourItemDisplay from '../Components/FourItemDisplay'
import GalleryDisplay from '../Components/GalleryDisplay'
import CommentDisplay from '../Components/CommentDisplay'
import Footer from '../Components/Footer'


const HomePage = () => {
  return (
    <div>
        <Prompt/>

        <Navbar/>

        <Hero/>

        <BlackStripe/>

        <div className ='displaySection'>
            <FourItemDisplay heading='New Arrivals'/>
            <div className="w-[90%] h-px bg-gray-300"></div>
            <FourItemDisplay heading='Top Selling'/>
            <GalleryDisplay/>
        </div>
        
        <CommentDisplay/>

        <Footer/>
    </div>
  )
}

export default HomePage
