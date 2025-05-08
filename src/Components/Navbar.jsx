import React from 'react'
import arrowDown from '../../public/Assets/arrowdown.svg'
import searchIcon from '../../public/Assets/searchIcon.svg'
import cartIcon from '../../public/Assets/cart.svg'
import profile from '../../public/Assets/profile.svg'
import menu from '../../public/Assets/menu.svg'

const Navbar = () => {
  return (
    <div className = 'navbar'>
        <img src={menu} alt='menu' className='navbarMenu'/>
        <div className = 'navbarLogo'>T3.SAHUR</div>
        <ul className = 'navbarList'>
            <li className = 'navbarListSub'>
                <span>Shop</span>
                <img src ={arrowDown}/>
            </li>
            <li>On Sale</li>
            <li>New Arrivals</li>
            <li>Categories</li>
        </ul>
        <div className='navbarSearch'>
            <img src={searchIcon} alt="search" />
            <input type="text" placeholder='Search for products' />
        </div>
        <div className = 'navbarCartProfile'>
            <img src = {cartIcon} />
            <img src = {profile} />
        </div>
    </div>
  )
}

export default Navbar
