import React from 'react'
import email from '../../public/Assets/email.svg'
import fb from '../../public/Assets/fb.svg'
import ins from '../../public/Assets/ins.svg'
import github from '../../public/Assets/github.svg'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='emailPrompt'>
            <div className='textPromt'>stay upto date about our latest offers</div>
            <div className='submitField'>
              <div className='inputEmail'>
                  <img src={email}/>
                  <input className = 'w-full ' placeholder='Enter your email address' type='text'></input>
              </div>
              <button className='submitEmail'>Subscribe</button>
            </div>
        </div>

        <div className='mainFooter'>
          <div className='infoList'>
            <div className='shopInfo'>
              <div className='navbarLogo'>T3.SHAUR</div>
              <p className='text-sub'>
                We are a tutor to your high fashion life style.
                We are a tutor to your high fashion life style
              </p>
              <div className='socialList'>
                <div className='iconHolder'>
                  <img className='socialIcon' src={fb}/>
                </div>
                <div className='iconHolder'>
                  <img className='socialIcon' src={ins}/>
                </div >
                <a className='iconHolder' href='https://github.com/theRaven1312/ECWeb' target='_blank'>
                  <img className='socialIcon' src={github}/>
                </a>
              </div>
            </div>

            <div class='otherInfo'>
              <div class='infoHead'>HELP</div>
              <div class='infoItemList'>
                <div class='infoItem'>Customer Support</div>
                <div class='infoItem'>Delivery Details</div>
                <div class='infoItem'>Terms & Conditions</div>
                <div class='infoItem'>Privacy Policy</div>
              </div>
            </div>

            <div class='otherInfo'>
              <div class='infoHead'>FAQ</div>
              <div class='infoItemList'>
                <div class='infoItem'>Account</div>
                <div class='infoItem'>Manage Delivery</div>
                <div class='infoItem'>Orders</div>
                <div class='infoItem'>Payments</div>
              </div>
            </div>
          </div>

          <div className='w-full h-px bg-gray-300 self-center mt-10 mb-4'></div>

          <div className='text-sub text-xs'>Copy right T3.SAHUR 2024</div>
        </div>
    </div>
  )
}

export default Footer
