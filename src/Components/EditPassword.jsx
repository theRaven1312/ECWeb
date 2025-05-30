import axiosJWT from "../utils/axiosJWT";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";

const EditPassword = ({onClose}) => {
    const user = useSelector((state) => state.user);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setError("");
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const decode = jwtDecode(user.access_token);
            const res = await axiosJWT.post(
                `/api/v1/users/change-password/${decode.id}`,
                formData
            );
            onClose();
        } catch (err) {
            const data = err.response.data;
            const errorMsg =
                data.message || data.messages?.[0] || "Lỗi không xác định";
            setError(errorMsg);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4 font-sans">
                    CHANGE PASSWORD
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 font-sans font-bold"
                >
                    <input
                        type="text"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Current Password"
                        className="w-full p-2 rounded bg-gray-200"
                        required
                    />
                    <input
                        type="text"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        className="w-full p-2 rounded bg-gray-200"
                        required
                    />
                    <input
                        type="text"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        className="w-full p-2 rounded bg-gray-200"
                        required
                    />
                    {error && <p className="text-red-500 shake">{error}</p>}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-red-500 hover:text-white"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-black hover:text-white"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPassword;
