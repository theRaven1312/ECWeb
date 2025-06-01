import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const ProductDelete = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosJWT.get("/api/v1/products");
                setProducts(response.data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products.");
            }
        };

        fetchProducts();
    }, []);

    // Handle delete product
    const handleDelete = async (productId, productName) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${productName}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await axiosJWT.delete(`/api/v1/products/${productId}`);

            setProducts(
                products.filter((product) => product._id !== productId)
            );
            setSuccess(`Product "${productName}" deleted successfully!`);
        } catch (err) {
            console.error("Failed to delete product:", err);
            setError(
                "Failed to delete product: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Delete Products</h2>

            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">
                    {success}
                </div>
            )}

            {loading && <div className="text-gray-500 mb-4">Processing...</div>}

            {products.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    No products found to delete.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="mb-3">
                                <img
                                    src={`http://localhost:3000${product.image_url}`}
                                    alt={product.name}
                                    className="w-full max-h-64 object-contain rounded-md mb-2"
                                />
                                <h3 className="font-medium text-gray-900">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    ${product.price}
                                </p>
                                {product.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    handleDelete(product._id, product.name)
                                }
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Delete Product
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductDelete;
