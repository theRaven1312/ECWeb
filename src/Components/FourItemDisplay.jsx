import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FourItemDisplay = ({ heading, links }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        
        if (heading.toLowerCase().includes('top') || heading.toLowerCase().includes('featured')) {
          response = await axios.get('/api/v1/products?featured=true&limit=4');
        } else if (heading.toLowerCase().includes('new') || heading.toLowerCase().includes('arrivals')) {
          response = await axios.get('/api/v1/products?sort=newest&limit=4');
        } else {
          response = await axios.get('/api/v1/products?limit=4');
        }
        
        setProducts(response.data.slice(0, 4)); // Đảm bảo chỉ lấy 4 sản phẩm
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [heading]);

  if (loading) {
    return (
      <div className='fourDisplay'>
        <div className='heading'>{heading}</div>
        <div className='itemList'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='fourDisplay'>
        <div className='heading'>{heading}</div>
        <div className='text-red-500 text-center py-8'>{error}</div>
      </div>
    );
  }

  return (
    <div className='fourDisplay'>
      <div className='heading'>{heading}</div>
      <div className="grid grid-cols-2 sm:grid-cols-2  md:grid-cols-4 gap-4 auto-rows-fr">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product}/>
          ))
        ) : (
          <div className='text-gray-500 text-center py-8 col-span-4'>
            No products found
          </div>
        )}
      </div>
      
      {products.length > 0 && (
        <Link to={`/category/${links}`}>
          <button className='viewAllButton'>View all</button>
        </Link>
      )}
    </div>
  );
};

export default FourItemDisplay;
