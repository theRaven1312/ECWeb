import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductUpdate = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
        colors: '',
        brand: '',
        sizes: '',
        isFeatured: false,
        isSale: false,
        images: []
    });

    // Fetch products and categories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('/api/v1/products'),
                    axios.get('/api/v1/categories')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                setError('Failed to load data: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle product selection change
    const handleProductSelect = (e) => {
        const productId = e.target.value;
        setSelectedProduct(productId);
        
        if (!productId) {
            // Reset form if no product selected
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                stock: '',
                colors: '',
                brand: '',
                sizes: '',
                isFeatured: false,
                isSale: false,
                images: []
            });
            return;
        }

        // Find the selected product
        const product = products.find(p => p._id === productId);
        if (product) {
            // Pre-fill form with product data
            setFormData({
                name: product.name || '',
                category: product.category?._id || product.category || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                colors: product.colors ? product.colors.join(', ') : '',
                brand: product.brand || '',
                sizes: product.sizes ? product.sizes.join(', ') : '',
                isFeatured: product.isFeatured || false,
                isSale: product.isSale || false,
                // Don't set images - they need to be uploaded again if changing
                images: []
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                images: files
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProduct) {
            setError('Please select a product to update');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = new FormData();

            // Append tất cả các trường từ form
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') return; // Xử lý hình ảnh riêng
                if (key === 'colors' && value) {
                    // Chuyển colors thành mảng
                    const colorsArray = value.split(',').map(color => color.trim());
                    colorsArray.forEach(color => data.append('colors', color));
                } else if (key === 'sizes' && value) {
                    // Chuyển sizes thành mảng
                    const sizesArray = value.split(',').map(size => size.trim());
                    sizesArray.forEach(size => data.append('sizes', size));
                } else if (key === 'isFeatured' || key === 'isSale') {
                    // Chuyển boolean thành string
                    data.append(key, value.toString());
                } else if (value !== '') {
                    data.append(key, value);
                }
            });

            // Append hình ảnh (nếu có)
            if (formData.images.length > 0) {
                Array.from(formData.images).forEach(file => {
                    data.append('images', file);
                });
            }

            // Log dữ liệu FormData
            console.log('Submitting data:');
            for (let pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Gửi yêu cầu PUT
            const response = await axios.put(`/api/v1/products/${selectedProduct}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Update response:', response.data);
            setSuccess('Product updated successfully!');

            // Làm mới danh sách sản phẩm
            const refreshedProducts = await axios.get('/api/v1/products');
            setProducts(refreshedProducts.data);

        } catch (err) {
            console.error('Update error:', err.response || err);
            setError('Update failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex gap-2 flex-col bg-gray-100 p-4 rounded-b-xl'>
            <h1 className='text-2xl font-bold'>Update Product</h1>
            
            {/* Product Selection Dropdown */}
            <div className="form-group mb-4">
                <label htmlFor="product-select" className="flex flex-col gap-2">
                    <span className="text-lg font-medium">Select Product to Update</span>
                    <select
                        id="product-select"
                        className="input-field"
                        value={selectedProduct}
                        onChange={handleProductSelect}
                    >
                        <option value="">-- Select a product --</option>
                        {products.map(product => (
                            <option key={product._id} value={product._id}>
                                {product.name} (${product.price})
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            
            {/* Update Form */}
            <form className='flex flex-col gap-4 bg-gray-200 p-4 rounded-lg' onSubmit={handleSubmit}>
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Name</span>
                    <input
                        type="text"
                        name="name"
                        placeholder='Product name'
                        className='input-field'
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="form-group">
                    <label htmlFor="category" className='flex flex-col gap-2'>
                        <span className='text-lg'>Category</span>
                        <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Description</span>
                    <textarea
                        name="description"
                        placeholder='Product description'
                        className='input-field min-h-[100px]'
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className='flex flex-col gap-2'>
                        <span className='text-lg'>Price</span>
                        <input
                            type="number"
                            name="price"
                            placeholder='0.00'
                            className='input-field'
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                        />
                    </label>
                    
                    <label className='flex flex-col gap-2'>
                        <span className='text-lg'>Stock</span>
                        <input
                            type="number"
                            name="stock"
                            placeholder='0'
                            className='input-field'
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </label>
                </div>
                
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Colors (comma separated)</span>
                    <input
                        type="text"
                        name="colors"
                        placeholder='red, blue, green'
                        className='input-field'
                        value={formData.colors}
                        onChange={handleChange}
                    />
                </label>
                
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Brand</span>
                    <input
                        type="text"
                        name="brand"
                        placeholder='Brand name'
                        className='input-field'
                        value={formData.brand}
                        onChange={handleChange}
                    />
                </label>

                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Sizes (comma separated)</span>
                    <input
                        type="text"
                        name="sizes"
                        placeholder='e.g., S, M, L, XL'
                        className='input-field'
                        value={formData.sizes}
                        onChange={handleChange}
                    />
                </label>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />
                        <span>Featured Product</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isSale"
                            checked={formData.isSale}
                            onChange={handleChange}
                        />
                        <span>On Sale</span>
                    </label>
                </div>
                
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Update Images</span>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        className='input-field'
                        onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500">
                        Leave empty to keep current images, or select new images to replace them.
                    </p>
                </label>

                {/* Current Images Preview (if any) */}
                {selectedProduct && products.find(p => p._id === selectedProduct)?.image_url && (
                    <div className="mt-2">
                        <p className="text-sm font-medium mb-2">Current Image:</p>
                        <img 
                            src={`http://localhost:3000/api/v1${products.find(p => p._id === selectedProduct).image_url}`} 
                            alt="Current product"
                            className="h-24 w-24 object-cover border rounded"
                        />
                    </div>
                )}

                {error && <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>}
                {success && <div className="text-green-600 p-2 bg-green-50 rounded">{success}</div>}
                
                <button 
                    type="submit" 
                    className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-400'
                    disabled={loading || !selectedProduct}
                >
                    {loading ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductUpdate;
