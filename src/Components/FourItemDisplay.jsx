import React from 'react'
import ProductCard from './ProductCard'

const FourItemDisplay = ({heading = 'Some Heading'} = heading) => {
  return (
    <div className='fourDisplay'>
        <div className='displayHeading'>{heading}</div>
        <div className='itemList'>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
        </div>
        <button className='viewAllButton'>View all</button>
    </div>
  )
}

export default FourItemDisplay
