import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCardMini = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!product) return null;

  // Handle different image URL formats
  const getImageUrl = (url) => {
    if (!url) return '';
    
    // If it's already a full URL
    if (url.startsWith('http')) {
      return url;
    }
    
    // Add the base URL for relative paths
    return `http://localhost:3000/api/v1${url}`;
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="h-40 bg-gray-100 relative">
          {product.image_url && !imageError ? (
            <img 
              src={getImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                console.error('Image failed to load:', getImageUrl(product.image_url));
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>No image</span>
            </div>
          )}
          
          {/* Sale badge */}
          {product.isSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
        
        <div className="p-3">
          {/* Name and price in the same row */}
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium truncate" title={product.name}>
              {product.name}
            </h3>
            <span className="text-sm font-bold text-gray-900">${product.price}</span>
          </div>
          
          {/* Brand and stock */}
          <div className="flex justify-between text-xs text-gray-500">
            <span className="truncate">{product.brand || 'No brand'}</span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>
          
          {/* Display sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Sizes: {product.sizes.join(', ')}
            </div>
          )}
          
          {/* Color indicators if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex mt-2 gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div 
                  key={index}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                ></div>
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardMini;
