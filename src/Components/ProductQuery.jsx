import React from 'react'
import ProductAdd from './ProductAdd'

const UserQuery = () => {
  return (
    <div>
        <ul className='w-full flex flex-justify-between bg-gray-100'>
            <li className='adminActions__item'>Add</li>
            <li className='adminActions__item'>Update</li>
            <li className='adminActions__item'>Delete</li>
            <li className='adminActions__item'>View</li>
        </ul>
        <ProductAdd/>
    </div>
  )
}

export default UserQuery
