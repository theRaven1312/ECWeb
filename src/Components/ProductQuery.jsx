import React, { useState } from 'react';
import ProductAdd from './ProductAdd';
import ProductView from './ProductView';
import ProductUpdate from './ProductUpdate';

const ProductQuery = () => {
  const [activeTab, setActiveTab] = useState('view');

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <ProductAdd />;
      case 'update': 
        return <ProductUpdate/>;
      case 'view':
      default:
        return <ProductView />;
      // Add other cases for update and delete when implemented
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ul className="w-full flex border-b mb-4">
        <li 
          className={`px-4 py-2 cursor-pointer ${activeTab === 'add' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('add')}
        >
          Add
        </li>
        <li 
          className={`px-4 py-2 cursor-pointer ${activeTab === 'update' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('update')}
        >
          Update
        </li>
        <li 
          className={`px-4 py-2 cursor-pointer ${activeTab === 'delete' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('delete')}
        >
          Delete
        </li>
        <li 
          className={`px-4 py-2 cursor-pointer ${activeTab === 'view' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('view')}
        >
          View
        </li>
      </ul>

      {renderContent()}
    </div>
  );
};

export default ProductQuery;
