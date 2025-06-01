import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>
      
      {products.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No products found. Add some products to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <img 
                  src={`http://localhost:3000${product.image_url}`} 
                  alt={product.name} 
                  className="w-full max-h-64 object-contain rounded-md mb-2"
                />
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">${product.price}</p>
                
                {/* Hiển thị Category */}
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  {product.category?.name || 'No category'}
                </div>
                
                {product.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Brand: {product.brand || 'No brand'}</span>
                  <span>Stock: {product.stock}</span>
                </div>
                
                {product.colors && product.colors.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Colors: {product.colors.join(', ')}
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Sizes: {product.sizes.join(', ')}
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  ID: {product._id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductView;
