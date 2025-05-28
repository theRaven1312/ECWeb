import React from "react";
import Navbar from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import DirectLink from "../Components/DirectLink";
import PriceSlider from "../Components/PriceSlider";
import ColorPicker from "../Components/ColorPicker";
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = ({ heading = 'Shop' }) => {
    const COLORS = [
        "red", 
        "blue", 
        "green", 
        "black", 
        "white",
        "yellow",
        "purple",
        "pink",
        "gray",
        "orange"
    ];

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const productsPerPage = 12;
    const { categoryId } = useParams();
    const location = useLocation();

    // Determine what products to fetch based on heading
    const getProductsEndpoint = () => {
        const headingLower = heading.toLowerCase();
        
        if (headingLower.includes('shop') || headingLower === 'shop') {
            return '/api/v1/products'; // All products
        } else if (headingLower.includes('sale') || headingLower.includes('on sales')) {
            return '/api/v1/products?sale=true'; // Sale products
        } else if (headingLower.includes('new') || headingLower.includes('arrivals')) {
            return '/api/v1/products?sort=newest'; // Newest products
        } else if (headingLower.includes('top') || headingLower.includes('selling') || headingLower.includes('featured')) {
            return '/api/v1/products?featured=true'; // Featured products
        } else if (categoryId) {
            return `/api/v1/products?category=${categoryId}`; // Specific category
        } else {
            return '/api/v1/products'; // Default to all products
        }
    };

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(''); // Clear previous errors
                
                // Fetch categories only once
                if (categories.length === 0) {
                    console.log('Fetching categories...');
                    const categoriesResponse = await axios.get('/api/v1/categories');
                    console.log('Categories received:', categoriesResponse.data);
                    setCategories(categoriesResponse.data);
                }
                
                // Fetch products based on heading
                const endpoint = getProductsEndpoint();
                console.log('Fetching products from endpoint:', endpoint);
                const productsResponse = await axios.get(endpoint);
                console.log('Products received:', productsResponse.data);
                
                // Kiểm tra xem có sản phẩm isSale không
                if (heading.toLowerCase().includes('sale')) {
                    console.log('Sale products found:', productsResponse.data.filter(p => p.isSale));
                }
                
                setProducts(productsResponse.data);
                // KHÔNG set filteredProducts ở đây, để useEffect filter xử lý
                
                // Reset filters when heading changes
                setSelectedCategory('');
                setSelectedColors([]);
                setSelectedSizes([]);
                setPriceRange([0, 1000]);
                setCurrentPage(1);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [heading]); // Chỉ depend on heading, remove categoryId

    // Separate useEffect for categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResponse = await axios.get('/api/v1/categories');
                setCategories(categoriesResponse.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        if (categories.length === 0) {
            fetchCategories();
        }
    }, []);

    // Filter products based on selected filters
    useEffect(() => {
        console.log('=== FILTER DEBUG ===');
        console.log('Original products:', products.length);
        console.log('Products data:', products);
        console.log('Filters:', {
            selectedCategory,
            priceRange,
            selectedColors,
            selectedSizes
        });

        // Đảm bảo có products trước khi filter
        if (!products || products.length === 0) {
            console.log('No products to filter');
            setFilteredProducts([]);
            setTotalProducts(0);
            return;
        }

        let filtered = [...products];
        console.log('Starting filter with products:', filtered.length);

        // Filter by category - CHỈ KHI CÓ CATEGORY ĐƯỢC CHỌN
        if (selectedCategory && selectedCategory !== '') {
            const beforeFilter = filtered.length;
            filtered = filtered.filter(product => {
                const matches = product.category?._id === selectedCategory || 
                               product.category === selectedCategory;
                return matches;
            });
            console.log(`Category filter: ${beforeFilter} -> ${filtered.length}`);
        }

        // Filter by price range - LUÔN LUÔN APPLY
        const beforePriceFilter = filtered.length;
        filtered = filtered.filter(product => {
            const price = parseFloat(product.price);
            const inRange = price >= priceRange[0] && price <= priceRange[1];
            if (!inRange) {
                console.log(`Product ${product.name} price ${price} outside range ${priceRange[0]}-${priceRange[1]}`);
            }
            return inRange;
        });
        console.log(`Price filter: ${beforePriceFilter} -> ${filtered.length}`);

        // Filter by colors - CHỈ KHI CÓ COLORS ĐƯỢC CHỌN
        if (selectedColors && selectedColors.length > 0) {
            const beforeColorFilter = filtered.length;
            filtered = filtered.filter(product => {
                if (!product.colors || product.colors.length === 0) {
                    console.log(`Product ${product.name} has no colors`);
                    return false;
                }
                const hasMatchingColor = product.colors.some(color =>
                    selectedColors.includes(color.toLowerCase())
                );
                if (!hasMatchingColor) {
                    console.log(`Product ${product.name} colors ${product.colors} don't match selected ${selectedColors}`);
                }
                return hasMatchingColor;
            });
            console.log(`Color filter: ${beforeColorFilter} -> ${filtered.length}`);
        }

        // Filter by sizes - CHỈ KHI CÓ SIZES ĐƯỢC CHỌN
        if (selectedSizes && selectedSizes.length > 0) {
            const beforeSizeFilter = filtered.length;
            filtered = filtered.filter(product => {
                if (!product.sizes || product.sizes.length === 0) {
                    console.log(`Product ${product.name} has no sizes`);
                    return false;
                }
                const hasMatchingSize = product.sizes.some(size =>
                    selectedSizes.includes(size)
                );
                if (!hasMatchingSize) {
                    console.log(`Product ${product.name} sizes ${product.sizes} don't match selected ${selectedSizes}`);
                }
                return hasMatchingSize;
            });
            console.log(`Size filter: ${beforeSizeFilter} -> ${filtered.length}`);
        }

        console.log('Final filtered products:', filtered.length);
        console.log('Filtered products data:', filtered);
        console.log('==================');

        setFilteredProducts(filtered);
        setTotalProducts(filtered.length);
        setCurrentPage(1);
    }, [products, selectedCategory, priceRange, selectedColors, selectedSizes]);

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // Handle category filter
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    };

    // Handle size filter
    const handleSizeFilter = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    // Get page title based on heading
    const getPageTitle = () => {
        const headingLower = heading.toLowerCase();
        if (headingLower.includes('sale')) return 'On Sale';
        if (headingLower.includes('new') || headingLower.includes('arrivals')) return 'New Arrivals';
        if (headingLower.includes('top') || headingLower.includes('selling')) return 'Top Selling';
        return heading;
    };

    useEffect(() => {
        console.log('=== PAGINATION DEBUG ===');
        console.log('Current Page:', currentPage);
        console.log('Products Per Page:', productsPerPage);
        console.log('Total Products:', totalProducts);
        console.log('Filtered Products Length:', filteredProducts.length);
        console.log('Index First Product:', indexOfFirstProduct);
        console.log('Index Last Product:', indexOfLastProduct);
        console.log('Current Products:', currentProducts);
        console.log('Current Products Length:', currentProducts.length);
        console.log('========================');
    }, [currentPage, filteredProducts, currentProducts]);

    if (loading) {
        return (
            <div className="main-container">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading products...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-container">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container items-baseline">
            <div className="divider"></div>

            <div className="flex w-full gap-12">
                {/* Filters Sidebar */}
                <div className="filter flex flex-col gap-4 p-4 w-1/4 text-gray-500 border-1 border-gray-300 rounded-3xl max-sm:hidden">
                    <div className="filter-heading flex justify-between items-center">
                        <div className="">Filters</div>
                        <i className="fa-solid fa-sliders"></i>
                    </div>

                    <div className="divider"></div>

                    {/* Categories Filter */}
                    <div className="filter-productTypeList flex flex-col gap-2">
                        <div className="font-medium mb-2">Categories</div>
                        {categories.map(category => (
                            <div 
                                key={category._id}
                                className={`filter-productTypeList-item cursor-pointer ${
                                    selectedCategory === category._id ? 'text-black font-bold' : ''
                                }`}
                                onClick={() => handleCategoryFilter(category._id)}
                            >
                                <div>{category.name}</div>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                        ))}
                    </div>

                    <div className="divider"></div>

                    {/* Price Filter */}
                    <div className="filter-price flex flex-col gap-4">
                        <div className="filter-price-heading flex justify-between items-center">
                            <div className="filter-heading">Price</div>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <PriceSlider 
                            value={priceRange}
                            onChange={setPriceRange}
                            min={0}
                            max={1000}
                        />
                        <div className="text-sm">
                            ${priceRange[0]} - ${priceRange[1]}
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Color Filter - Fixed */}
                    <div className="filter-color flex flex-col gap-4">
                        <div className="filter-color-heading flex justify-between items-center">
                            <div className="filter-heading">Colors</div>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ColorPicker
                            classColorPicker="mx-auto"
                            colors={COLORS}
                            selectedColors={selectedColors}
                            onColorSelect={setSelectedColors}
                        />
                        {/* Show selected colors */}
                        {selectedColors.length > 0 && (
                            <div className="text-xs text-gray-600">
                                Selected: {selectedColors.join(', ')}
                            </div>
                        )}
                    </div>

                    <div className="divider"></div>

                    {/* Size Filter */}
                    <div className="filter-size flex flex-col gap-4">
                        <div className="filter-size-heading flex justify-between items-center">
                            <div className="filter-heading">Size</div>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <div className="filter-size-list flex flex-wrap gap-2">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <button 
                                    key={size}
                                    className={`primary-btn ${
                                        selectedSizes.includes(size) 
                                            ? 'bg-black text-white' 
                                            : ''
                                    }`}
                                    onClick={() => handleSizeFilter(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Clear Filters */}
                    <button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                        onClick={() => {
                            setSelectedCategory('');
                            setPriceRange([0, 1000]);
                            setSelectedColors([]);
                            setSelectedSizes([]);
                        }}
                    >
                        Clear All Filters
                    </button>
                </div>

                {/* Products Display */}
                <div className="category-display flex flex-col w-full gap-8">
                    <div className="category-heading flex justify-between w-full">
                        <div className="heading">{getPageTitle()}</div>
                        <div className="category-heading-detail flex gap-4 max-sm:hidden">
                            <div>
                                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} Products
                            </div>
                            <div>
                                Sort by: <span>Most Popular</span>
                            </div>
                        </div>
                    </div>

                    <div className="category-main flex flex-col w-full gap-8">
                        {/* Products Grid */}
                        <div className="category-main-productList grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {currentProducts.length > 0 ? (
                                currentProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    No products found matching your filters.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="category-main-pages flex justify-between items-center">
                                <button 
                                    className={`page-btn flex items-center gap-2 py-2 px-4 rounded-2xl border-1 border-gray-300 ${
                                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fa-solid fa-arrow-left"></i>
                                    <div>Previous</div>
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNumber;
                                        if (totalPages <= 5) {
                                            pageNumber = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNumber = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNumber = totalPages - 4 + i;
                                        } else {
                                            pageNumber = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNumber}
                                                className={`w-10 h-10 rounded-lg ${
                                                    currentPage === pageNumber
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                                onClick={() => setCurrentPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button 
                                    className={`page-btn flex items-center gap-2 py-2 px-4 rounded-2xl border-1 border-gray-300 ${
                                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <div>Next</div>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
