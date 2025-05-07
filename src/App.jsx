import React from 'react'
import Navbar from './Components/Navbar'
import Prompt from './Components/Prompt'
import { Hero } from './Components/Hero'

export const App = () => {
  return (
    <div>
      <Prompt/>

      <Navbar/>

      <Hero/>
    </div>
  )
}

export default App
