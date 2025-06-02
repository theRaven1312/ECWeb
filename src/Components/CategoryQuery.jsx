import React, { useState } from 'react';
import CategoryView from './CategoryView';
import CategoryAdd from './CategoryAdd';
import CategoryUpdate from './CategoryUpdate';
import CategoryDelete from './CategoryDelete';

const CategoryQuery = () => {
  const [activeTab, setActiveTab] = useState('view');

  const renderContent = () => {
    switch (activeTab) {
      case 'view':
        return <CategoryView />;
      case 'add':
        return <CategoryAdd />;
      case 'update':
        return <CategoryUpdate />;
      case 'delete':
        return <CategoryDelete />;
      default:
        return <CategoryView />;
    }
  };

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'view'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('view')}
        >
          View Categories
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'add'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add Category
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'update'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('update')}
        >
          Update Category
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'delete'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('delete')}
        >
          Delete Category
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default CategoryQuery;
