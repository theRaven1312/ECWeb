import React from 'react'
import {Link} from 'react-router-dom'
import heroImg from '../../public/Assets/hero.jpg'


export const Hero = () => {
  return (
    <div className = 'hero'>
        <div className = 'heroText'>
            <div className='heroMaintext'>
                <div>FIND CLOTHES</div>
                <div>THAT MATCHES</div>
                <div>YOUR STYLE</div>
            </div>

            <div className ='heroSubtext'>
                Explore a diverse world of fashion to find your ideal self
            </div>

            <Link to ='/category'><button className='heroButton'>Shop now</button></Link>

            <div className ='heroStats'>
                <div className='Stat'>
                    <p className='statNum'>200+</p>
                    <p>High-Quality Products</p>
                </div>

                <div className="w-[2px] bg-gray-300"></div>

                <div className='Stat'>
                    <p className='statNum'>1000+</p>
                    <p>Happy Customer</p>
                </div>
            </div>
        </div>
        <div className=' w-1/2 max-sm:w-full h-full overflow-hidden'>
            <img src={heroImg}/>
        </div>
    </div>
  )
}

