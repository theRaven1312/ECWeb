import React from 'react'
import UserAdd from './ProductAdd'

const UserQuery = () => {
  return (
    <div>
        <ul className='w-full flex flex-justify-between bg-gray-100'>
            <li className='adminActions__item'>Add</li>
            <li className='adminActions__item'>Update</li>
            <li className='adminActions__item'>Delete</li>
            <li className='adminActions__item'>View</li>
        </ul>
        <UserAdd/>
    </div>
  )
}

export default UserQuery
