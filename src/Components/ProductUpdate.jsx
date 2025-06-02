import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const ProductUpdate = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        colors: "",
        brand: "",
        sizes: "",
        isFeatured: false,
        isSale: false,
        images: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    axiosJWT.get("/api/v1/products"),
                    axiosJWT.get("/api/v1/categories"),
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                setError(
                    "Failed to load data: " +
                        (err.response?.data?.message || err.message)
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProductSelect = (e) => {
        const productId = e.target.value;
        setSelectedProduct(productId);
        if (!productId) {
            setFormData({
                name: "",
                category: "",
                description: "",
                price: "",
                discount: "",
                stock: "",
                colors: "",
                brand: "",
                sizes: "",
                isFeatured: false,
                isSale: false,
                images: [],
            });
            return;
        }
        const product = products.find((p) => p._id === productId);
        if (product) {
            setFormData({
                name: product.name || "",
                category: product.category?._id || product.category || "",
                description: product.description || "",
                price: product.price || "",
                discount: product.discount || "",
                stock: product.stock || "",
                colors: product.colors ? product.colors.join(", ") : "",
                brand: product.brand || "",
                sizes: product.sizes ? product.sizes.join(", ") : "",
                isFeatured: product.isFeatured || false,
                isSale: product.isSale || false,
                images: [],
            });
        }
    };
    const handleChange = (e) => {
        const {name, value, type, checked, files} = e.target;

        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                images: files,
            }));
        } else if (type === "checkbox") {
            setFormData((prev) => {
                const newFormData = {
                    ...prev,
                    [name]: checked,
                };

                // If isSale is being checked to true and no discount is set, set default 20%
                if (
                    name === "isSale" &&
                    checked &&
                    (prev.discount === "" ||
                        prev.discount === "0" ||
                        prev.discount === 0)
                ) {
                    newFormData.discount = "20";
                }

                return newFormData;
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProduct) {
            setError("Please select a product to update");
            return;
        }

        if (!formData.name.trim()) {
            setError("Product name is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = new FormData();

            // Append regular form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "images") return; // Handle images separately

                if (key === "colors" && value) {
                    // Handle colors array
                    const colorsArray = value
                        .split(",")
                        .map((color) => color.trim())
                        .filter((color) => color !== "");
                    colorsArray.forEach((color) => {
                        data.append("colors", color);
                    });
                } else if (key === "sizes" && value) {
                    // Handle sizes array
                    const sizesArray = value
                        .split(",")
                        .map((size) => size.trim())
                        .filter((size) => size !== "");
                    sizesArray.forEach((size) => {
                        data.append("sizes", size);
                    });
                } else if (key === "isFeatured" || key === "isSale") {
                    // Handle boolean values
                    data.append(key, value.toString());
                } else if (value !== "") {
                    // Handle other fields
                    data.append(key, value);
                }
            });

            // Handle images - THIS IS THE KEY FIX
            if (formData.images && formData.images.length > 0) {
                console.log(
                    "Adding images to FormData:",
                    formData.images.length
                );
                for (let i = 0; i < formData.images.length; i++) {
                    data.append("images", formData.images[i]);
                    console.log(`Added image ${i}:`, formData.images[i].name);
                }
            }

            // Log FormData contents for debugging
            console.log("FormData contents:");
            for (let pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }
            const response = await axiosJWT.put(
                `/api/v1/products/${selectedProduct}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Update response:", response.data);
            setSuccess("Product updated successfully!");
            // Refresh products list
            const refreshedProducts = await axiosJWT.get("/api/v1/products");
            setProducts(refreshedProducts.data);

            // Update current product in the form
            const updatedProduct = refreshedProducts.data.find(
                (p) => p._id === selectedProduct
            );
            if (updatedProduct) {
                setFormData((prev) => ({
                    ...prev,
                    images: [], // Clear the file input
                }));
            }
        } catch (err) {
            console.error("Update error:", err.response || err);
            setError(
                "Update failed: " + (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Product</h2>

            <div className="max-w-2xl space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Product to Update
                    </label>
                    <select
                        value={selectedProduct}
                        onChange={handleProductSelect}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select a product --</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>
                                {product.name} (${product.price})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedProduct && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>{" "}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Colors (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    placeholder="red, blue, green"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sizes (comma separated)
                            </label>
                            <input
                                type="text"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="S, M, L, XL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                />
                                <span className="text-sm">
                                    Featured Product
                                </span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isSale"
                                    checked={formData.isSale}
                                    onChange={handleChange}
                                />
                                <span className="text-sm">On Sale</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Update Images
                            </label>
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to keep current images
                            </p>
                        </div>
                        {selectedProduct &&
                            products.find((p) => p._id === selectedProduct)
                                ?.image_url && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium mb-2">
                                        Current Image:
                                    </p>
                                    <img
                                        src={`http://localhost:3000${
                                            products.find(
                                                (p) => p._id === selectedProduct
                                            ).image_url
                                        }`}
                                        alt="Current product"
                                        className="h-24 w-24 object-cover border rounded"
                                    />
                                </div>
                            )}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                                {success}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductUpdate;
