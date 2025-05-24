import React from 'react'
import ProductCard from './ProductCard'
import { Link } from 'react-router-dom'

const FourItemDisplay = ({heading, links}) => {
  return (
    <div className='fourDisplay'>
        <div className='heading'>{heading}</div>
        <div className='itemList'>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
        </div>
        <Link to = {`category/${links}`}><button className='viewAllButton'>View all</button></Link>

    </div>
  )
}

export default FourItemDisplay
