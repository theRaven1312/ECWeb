import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No product data</span>
      </div>
    );
  }

  // Handle different image URL formats
  const getImageUrl = (url) => {
    if (!url) return "/placeholder-image.jpg";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card block h-full">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
        {/* Fixed height image container */}
        <div className="w-full h-48 overflow-hidden flex-shrink-0">
          <img
            src={
              imageError
                ? "/placeholder-image.jpg"
                : getImageUrl(product.image_url)
            }
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Content area with flex-grow to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {product.category && (
            <p className="text-xs text-blue-600 mt-1">
              {product.category.name}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold text-gray-900">
              ${product.price}
            </span>

            {product.isFeatured && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {product.brand && (
            <p className="text-sm text-gray-500 mt-1 truncate">{product.brand}</p>
          )}

          {/* Push this to bottom with margin-top auto */}
          <div className="flex items-center justify-between mt-auto pt-2 text-xs text-gray-500">
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
            {product.colors && product.colors.length > 0 && (
              <span>{product.colors.length} colors</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
