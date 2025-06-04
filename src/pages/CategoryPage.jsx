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
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    const productsPerPage = 12;
    const { categoryId } = useParams();
    const location = useLocation();

    // ✅ Handle window resize for mobile detection
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            
            // Auto-close filters when switching to desktop
            if (!mobile && showFilters) {
                setShowFilters(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [showFilters]);

    // ✅ Prevent body scroll when filter modal is open on mobile
    useEffect(() => {
        if (isMobile && showFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, showFilters]);

    // ✅ Close filters when clicking outside on mobile
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowFilters(false);
        }
    };

    // ✅ Toggle filter visibility
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Determine what products to fetch based on heading
    const getProductsEndpoint = () => {
        const headingLower = heading.toLowerCase();
        
        if (headingLower.includes('shop') || headingLower === 'shop') {
            return '/api/v1/products';
        } else if (headingLower.includes('sale') || headingLower.includes('on sales')) {
            return '/api/v1/products?sale=true';
        } else if (headingLower.includes('new') || headingLower.includes('arrivals')) {
            return '/api/v1/products?sort=newest';
        } else if (headingLower.includes('top') || headingLower.includes('selling') || headingLower.includes('featured')) {
            return '/api/v1/products?featured=true';
        } else if (categoryId) {
            return `/api/v1/products?category=${categoryId}`;
        } else {
            return '/api/v1/products';
        }
    };

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                
                if (categories.length === 0) {
                    const categoriesResponse = await axios.get('/api/v1/categories');
                    setCategories(categoriesResponse.data);
                }
                
                const endpoint = getProductsEndpoint();
                const productsResponse = await axios.get(endpoint);
                setProducts(productsResponse.data);
                
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
    }, [heading]);

    // Filter products based on selected filters
    useEffect(() => {
        if (!products || products.length === 0) {
            setFilteredProducts([]);
            setTotalProducts(0);
            return;
        }

        let filtered = [...products];

        if (selectedCategory && selectedCategory !== '') {
            filtered = filtered.filter(product => {
                const matches = product.category?._id === selectedCategory || 
                               product.category === selectedCategory;
                return matches;
            });
        }

        const beforePriceFilter = filtered.length;
        filtered = filtered.filter(product => {
            const price = parseFloat(product.price);
            const inRange = price >= priceRange[0] && price <= priceRange[1];
            return inRange;
        });

        if (selectedColors && selectedColors.length > 0) {
            filtered = filtered.filter(product => {
                if (!product.colors || product.colors.length === 0) {
                    return false;
                }
                const hasMatchingColor = product.colors.some(color =>
                    selectedColors.includes(color.toLowerCase())
                );
                return hasMatchingColor;
            });
        }

        if (selectedSizes && selectedSizes.length > 0) {
            filtered = filtered.filter(product => {
                if (!product.sizes || product.sizes.length === 0) {
                    return false;
                }
                const hasMatchingSize = product.sizes.some(size =>
                    selectedSizes.includes(size)
                );
                return hasMatchingSize;
            });
        }

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

    // ✅ Clear all filters function
    const clearAllFilters = () => {
        setSelectedCategory('');
        setPriceRange([0, 1000]);
        setSelectedColors([]);
        setSelectedSizes([]);
        
        // Close filters on mobile after clearing
        if (isMobile) {
            setShowFilters(false);
        }
    };

    // ✅ Apply filters and close on mobile
    const applyFilters = () => {
        if (isMobile) {
            setShowFilters(false);
        }
    };

    if (loading) {
        return (
            <div className="main-container">
                <div className="flex-center-around h-screen">
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

            <div className="flex w-full gap-16">
                {/* ✅ Desktop Filters Sidebar */}
                <div className='w-1/5 hidden sm:block'>
                    <div className="filter flex flex-col gap-4 p-4 text-gray-500 border-1 border-gray-300 rounded-3xl">
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

                        {/* Color Filter */}
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
                            onClick={clearAllFilters}
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>

                {/* ✅ Mobile Filter Modal */}
                {isMobile && (
                    <div 
                        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
                            showFilters 
                                ? 'opacity-100 visible' 
                                : 'opacity-0 invisible'
                        }`}
                        onClick={handleOverlayClick}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/50"></div>
                        
                        {/* Filter Panel */}
                        <div 
                            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden transition-transform duration-300 ease-in-out ${
                                showFilters 
                                    ? 'transform translate-y-0' 
                                    : 'transform translate-y-full'
                            }`}
                        >
                            {/* ✅ Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                    <button 
                                        onClick={() => setShowFilters(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <i className="fa-solid fa-times text-gray-600"></i>
                                    </button>
                                </div>
                                
                                {/* ✅ Active Filters Count */}
                                {(selectedCategory || selectedColors.length > 0 || selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                                    <div className="mt-2 text-sm text-black">
                                        {[
                                            selectedCategory && '1 category',
                                            selectedColors.length > 0 && `${selectedColors.length} colors`,
                                            selectedSizes.length > 0 && `${selectedSizes.length} sizes`,
                                            (priceRange[0] > 0 || priceRange[1] < 1000) && 'price range'
                                        ].filter(Boolean).join(', ')} selected
                                    </div>
                                )}
                            </div>

                            {/* ✅ Scrollable Content */}
                            <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(85vh - 140px)' }}>
                                {/* Categories Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <button
                                                key={category._id}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                    selectedCategory === category._id 
                                                        ? 'bg-black text-white font-bold' 
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                                onClick={() => handleCategoryFilter(category._id)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{category.name}</span>
                                                    {selectedCategory === category._id && (
                                                        <i className="fa-solid fa-check text-white"></i>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                                    <div className="px-2">
                                        <PriceSlider 
                                            value={priceRange}
                                            onChange={setPriceRange}
                                            min={0}
                                            max={1000}
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Color Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
                                    <ColorPicker
                                        classColorPicker="mx-auto"
                                        colors={COLORS}
                                        selectedColors={selectedColors}
                                        onColorSelect={setSelectedColors}
                                    />
                                    {selectedColors.length > 0 && (
                                        <div className="text-xs text-gray-600 mt-2 text-center">
                                            Selected: {selectedColors.join(', ')}
                                        </div>
                                    )}
                                </div>

                                {/* Size Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Sizes</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['S', 'M', 'L', 'XL'].map(size => (
                                            <button 
                                                key={size}
                                                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                                    selectedSizes.includes(size) 
                                                        ? 'bg-black text-white border-black' 
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                                }`}
                                                onClick={() => handleSizeFilter(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                                <div className="flex gap-3">
                                    <button 
                                        className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        onClick={clearAllFilters}
                                    >
                                        Clear All
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Display */}
                <div className="category-display flex flex-col w-full gap-8 sm:w-3/4">
                    <div className="category-heading flex justify-between items-center w-full">
                        <div className="heading">{getPageTitle()}</div>

                        {/* ✅ Mobile Filter Button */}
                        <button 
                            className="sm:hidden py-2 px-4 bg-gray-200 rounded-full relative"
                            onClick={toggleFilters}
                        >
                            <i className="fa-solid fa-sliders cursor-pointer"></i>
                            
                            {/* ✅ Filter Badge */}
                            {(selectedCategory || selectedColors.length > 0 || selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {[
                                        selectedCategory ? 1 : 0,
                                        selectedColors.length,
                                        selectedSizes.length,
                                        (priceRange[0] > 0 || priceRange[1] < 1000) ? 1 : 0
                                    ].reduce((sum, count) => sum + count, 0)}
                                </span>
                            )}
                        </button>

                        <div className="category-heading-detail flex gap-4 max-sm:hidden">
                            <div>
                                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} Products
                            </div>
                        </div>
                    </div>

                    <div className="category-main flex flex-col w-full gap-8">
                        {/* Products Grid */}
                        <div className="category-main-productList grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
