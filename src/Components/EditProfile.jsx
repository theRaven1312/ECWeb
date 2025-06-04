import axiosJWT from "../utils/axiosJWT";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {updateUser} from "../redux/UserSliceRedux";

const EditProfile = ({onClose}) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        // Gán thông tin user ban đầu vào form
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

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
            const res = await axiosJWT.put(
                `/api/v1/users/update-user/${decode.id}`,
                formData
            );
            dispatch(
                updateUser({
                    ...res.data.data,
                    access_token: user.access_token,
                })
            );
            onClose();
        } catch (err) {
            const data = err.response.data;
            setError(data.message || data.messages[0]);
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black/20 backdrop-blur-md
 flex items-center justify-center z-50 overflow-hidden"
        >
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4 font-sans">
                    CHANGE INFOMATION
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 font-sans font-bold"
                >
                    <input
                        type="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full p-2 rounded bg-gray-200"
                    />
                    {error && (
                        <p className="text-red-500 shake border-none">
                            {error}
                        </p>
                    )}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-black hover:text-white cursor-pointer"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
