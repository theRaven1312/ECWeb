import React from 'react'
import Navbar from './Components/Navbar'
import Prompt from './Components/Prompt'
import { Hero } from './Components/Hero'
import BlackStripe from './Components/BlackStripe'
import FourItemDisplay from './Components/FourItemDisplay'

export const App = () => {
  return (
    <div>
      <Prompt/>

      <Navbar/>

      <Hero/>

      <BlackStripe/>

      <div className ='DisplaySection'>
          <FourItemDisplay heading='New Arrivals'/>
          <div className="w-[90%] h-px bg-gray-300"></div>
          <FourItemDisplay heading='Top Selling'/>
        </div>
    </div>
  )
}

export default App
