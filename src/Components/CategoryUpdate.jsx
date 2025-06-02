import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";

const CategoryUpdate = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
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
            }
        };

        fetchCategories();
    }, []);

    const handleCategorySelect = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);

        if (categoryId) {
            const category = categories.find((cat) => cat._id === categoryId);
            if (category) {
                setFormData({
                    name: category.name || "",
                    description: category.description || "",
                });
            }
        } else {
            setFormData({name: "", description: ""});
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            setError("Please select a category to update");
            return;
        }

        if (!formData.name.trim()) {
            setError("Category name is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await axiosJWT.put(
                `/api/v1/categories/${selectedCategory}`,
                formData
            );
            console.log("Category updated:", response.data);

            setSuccess("Category updated successfully!");

            // Refresh categories list
            const refreshedCategories = await axiosJWT.get(
                "/api/v1/categories"
            );
            setCategories(refreshedCategories.data);
        } catch (err) {
            console.error("Failed to update category:", err);
            setError(
                "Failed to update category: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Category</h2>

            <div className="max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Category to Update
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategorySelect}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select a category --</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.icon} {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCategory && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter category name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter category description"
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

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
                            {loading ? "Updating..." : "Update Category"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CategoryUpdate;
