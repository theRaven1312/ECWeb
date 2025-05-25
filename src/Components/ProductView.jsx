import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCardMini from './ProductCardMini';

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/products');
        setProducts(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-6 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Products</h2>
      
      {products.length === 0 ? (
        <div className="text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCardMini key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        Total products: {products.length}
      </div>
    </div>
  );
};

export default ProductView;
