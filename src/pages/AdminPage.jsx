import { User } from 'lucide-react'
import React from 'react'
import UserQuery from '../Components/ProductQuery'

const AdminPage = () => {
  return (
    <div className='flex flex-col px-8 gap-8'>
        <div className='divider'></div>
        <div className='flex gap-8'>
            <ul className='optionBar flex flex-col w-1/4 border-1 border-gray-300 p-4 gap-4 rounded-lg h-screen'>
                <li className='optionBar__item'>Users</li>
                <li className='optionBar__item'>Products</li>
                <li className='optionBar__item'>Orders</li>
                <li className='optionBar__item'>Sales</li>
            </ul>
            <div className='flex flex-col gap-4 optionContent w-3/4 p-8 border-1 border-gray-300 rounded-lg'>
                <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
                <UserQuery/>
            </div>
        </div>
    </div>
    
  )
}

export default AdminPage
