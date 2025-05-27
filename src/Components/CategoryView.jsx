import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/v1/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="p-4">Loading categories...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Categories ({categories.length})</h2>
      
      {categories.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No categories found. Add some categories to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                {category.icon && (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">{category.icon}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                <span>ID: {category._id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryView;
