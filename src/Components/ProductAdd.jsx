import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductAdd = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '', // This will store the category ID
        description: '',
        price: '',
        stock: '',
        colors: '',
        brand: '',
        images: [],
        sizes: '' // Added sizes field
    });
    
    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/v1/categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                images: files
            }));
        } else if (name === 'colors' || name === 'sizes') {
            // Store colors and sizes as comma-separated values
            setFormData(prev => ({
                ...prev,
                [name]: value
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
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    Array.from(value).forEach(file => data.append('images', file));
                } else {
                    data.append(key, value);
                }
            });
            const res = await axios.post('/api/v1/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Product added successfully!');
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                stock: '',
                colors: '',
                brand: '',
                images: [],
                sizes: '' // Reset sizes field
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex gap-2 flex-col bg-gray-100 p-4 rounded-b-xl'>
            <h1 className='text-2xl font-bold'>Add Product</h1>
            <form className='flex flex-col gap-4 bg-gray-200 p-2 rounded-lg' onSubmit={handleSubmit}>
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Name</span>
                    <input
                        type="text"
                        name="name"
                        placeholder='...'
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
                            className="form-control input-field"
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
                    <input
                        type="text"
                        name="description"
                        placeholder='...'
                        className='input-field'
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Price</span>
                    <input
                        type="number"
                        name="price"
                        placeholder='...'
                        className='input-field'
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Stock</span>
                    <input
                        type="number"
                        name="stock"
                        placeholder='...'
                        className='input-field'
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Colors</span>
                    <input
                        type="text"
                        name="colors"
                        placeholder='...'
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
                        placeholder='...'
                        className='input-field'
                        value={formData.brand}
                        onChange={handleChange}
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    <span className='text-lg'>Images</span>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        className='input-field'
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

                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
                <button type="submit" className='primary-btn' disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductAdd;
