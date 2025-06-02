import React from 'react'
import { useState } from 'react';
import OrderView from './OrderView';


const OrderQuery = () => {
  const [activeTab, setActiveTab] = useState('view');

  const renderContent = () => {
    switch (activeTab) {
      case 'view':
        return <OrderView/>;
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
          View Orders
        </button>

      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderQuery
