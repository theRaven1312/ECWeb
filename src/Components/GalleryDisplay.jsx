import React from 'react'
import hoodie from '../../public/Assets/Hoodies.jpeg'
import tshirt from '../../public/Assets/T-Shirt.jpeg'
import pants from '../../public/Assets/Pants.jpeg'
import shirts from '../../public/Assets/Shirts.jpeg'
import {Link} from 'react-router-dom'

const GalleryDisplay = () => {
  return (
    <div className='galleryDisplay'>
        <div className='heading'>OUR CATEGORIES</div>
        <div className='galleryItemList'>
                <div className='galleryItem bg-cover bg-[20%_30%]' style={{backgroundImage: `url(${shirts})`}}>
                    <div className='itemTitle'>Shirts</div>
                </div>

                <div className='galleryItem col-span-2 bg-cover bg-[20%_60%]' style={{backgroundImage: `url(${pants})`}}>
                    <div className='itemTitle'>Pants</div>
                </div>

                <div className="galleryItem col-span-2 bg-cover bg-[20%_30%]" style={{backgroundImage: `url(${hoodie})`}}>
                    <div className='itemTitle absolute'>Hoodies</div>
                </div>

                <div className='galleryItem bg-cover bg-[20%_40%]' style={{backgroundImage: `url(${tshirt})`}}>
                    <div className='itemTitle'>T-Shirts</div>
                </div>
        </div>
    </div>
  )
}

export default GalleryDisplay
