import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDelete = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/v1/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products.');
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.delete(`/api/v1/products/${productId}`);
      console.log('Delete response:', response.data);

      // Remove the deleted product from the state
      setProducts(products.filter(product => product._id !== productId));
      setSuccess('Product deleted successfully!');
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Products</h1>

      {error && <div className="text-red-500 p-2 bg-red-50 rounded mb-4">{error}</div>}
      {success && <div className="text-green-600 p-2 bg-green-50 rounded mb-4">{success}</div>}

      {loading && <div className="text-gray-500">Loading...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product._id} className="border p-4 rounded shadow-sm">
            <img 
              src={`http://localhost:3000${product.image_url}`} 
              alt={product.name} 
              className="h-32 w-full object-cover mb-2 rounded"
            />

            <h2 className="text-lg font-medium">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-2">${product.price}</p>
            <button 
              onClick={() => handleDelete(product._id)} 
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDelete;
