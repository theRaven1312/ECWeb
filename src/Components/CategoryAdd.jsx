import React, {useState} from "react";
import axiosJWT from "../utils/axiosJWT";

const CategoryAdd = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Category name is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await axiosJWT.post(
                "/api/v1/categories",
                formData
            );
            console.log("Category created:", response.data);

            setSuccess("Category created successfully!");
            setFormData({name: "", description: ""});
        } catch (err) {
            console.error("Failed to create category:", err);
            setError(
                "Failed to create category: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>

            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                        placeholder="Enter category description (optional)"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                    {loading ? "Creating..." : "Create Category"}
                </button>
            </form>
        </div>
    );
};

export default CategoryAdd;
