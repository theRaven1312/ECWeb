import React from 'react'

const GalleryDisplay = () => {
  return (
    <div className='galleryDisplay'>
        <div className='heading'>BROWSE BY ...</div>
        <div className='galleryItemList'>
            <div className='galleryItem'>
                <div className='itemTitle'>Something</div>
                <div className='itemBG'></div>
            </div>
            <div className='galleryItem col-span-2'>
                <div className='itemTitle'>Something</div>
                <div className='itemBG'></div>
            </div>
            <div className='galleryItem col-span-2'>
                <div className='itemTitle'>Something</div>
                <div className='itemBG'></div>
            </div>
            <div className='galleryItem'>
                <div className='itemTitle'>Something</div>
                <div className='itemBG'></div>
            </div>
        </div>
    </div>
  )
}

export default GalleryDisplay
