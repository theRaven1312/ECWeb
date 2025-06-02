import React, { useState } from 'react';
import ProductAdd from './ProductAdd';
import ProductView from './ProductView';
import ProductUpdate from './ProductUpdate';
import ProductDelete from './ProductDelete';

const ProductQuery = () => {
  const [activeTab, setActiveTab] = useState('view');

  const renderContent = () => {
    switch (activeTab) {
      case 'view':
        return <ProductView />;
      case 'add':
        return <ProductAdd />;
      case 'update': 
        return <ProductUpdate />;
      case 'delete':
        return <ProductDelete />;
      default:
        return <ProductView />;
    }
  };

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'view'
              ? 'border-b-2 border-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('view')}
        >
          View Products
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'add'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add Product
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'update'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('update')}
        >
          Update Product
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'delete'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('delete')}
        >
          Delete Product
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProductQuery;
