import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const CategoryDelete = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosJWT.get("/api/v1/categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories.");
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (categoryId, categoryName) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await axiosJWT.delete(`/api/v1/categories/${categoryId}`);

            // Remove deleted category from state
            setCategories(categories.filter((cat) => cat._id !== categoryId));
            setSuccess(`Category "${categoryName}" deleted successfully!`);
        } catch (err) {
            console.error("Failed to delete category:", err);
            setError(
                "Failed to delete category: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Delete Categories</h2>

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

            {categories.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    No categories found to delete.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                {category.icon && (
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span>{category.icon}</span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="text-sm text-gray-500">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    handleDelete(category._id, category.name)
                                }
                                disabled={loading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Delete Category
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryDelete;
