import {useEffect, useState, useCallback} from "react";
import UserCardMini from "./UserCardMini";
import axiosJWT from "../utils/axiosJWT";

const USERS_PER_PAGE = 4;

const UserQuery = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axiosJWT.get("/api/v1/users");
            setUsers(response.data.data);
        } catch (err) {
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userId, userName) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${userName}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await axiosJWT.delete(`/api/v1/users/delete-user/${userId}`);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            setSuccess(`${userName} deleted successfully!`);
        } catch (err) {
            console.error("Failed to delete  user:", err);
            setError(
                "Failed to delete user: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        if (
            !window.confirm(
                `Are you sure you want to change the role of this user to "${newRole}"?`
            )
        ) {
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await axiosJWT.put(
                `/api/v1/users/update-user/${userId}`,
                {
                    role: newRole,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                        )}`,
                    },
                }
            );
            const updatedUser = response.data.data;
            setUsers((prev) =>
                prev.map((user) => (user._id === userId ? updatedUser : user))
            );
            setSuccess(`Role changed to "${newRole}" successfully!`);
        } catch (err) {
            console.error("Failed to change user role:", err);
            setError(
                "Failed to change user role: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        }
    };

    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const startIdx = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = users.slice(startIdx, startIdx + USERS_PER_PAGE);

    return (
        <div className="container mx-auto p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">
                All Users ({users.length})
            </h2>

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

            {currentUsers.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    No users found.
                </div>
            ) : (
                <>
                    {" "}
                    {currentUsers.map((user) => (
                        <UserCardMini
                            key={user._id}
                            id={user._id}
                            username={user.name}
                            email={user.email}
                            role={user.role}
                            lastOnline={"N/A"}
                            state={"online"}
                            onDelete={() => handleDelete(user._id, user.name)}
                            onChangeRole={(userId, newRole) =>
                                handleChangeRole(userId, newRole)
                            }
                        />
                    ))}
                    <div className="flex gap-2 mt-4 justify-center">
                        {Array.from({length: totalPages}, (_, idx) => (
                            <button
                                key={idx + 1}
                                className={`px-3 py-1 rounded cursor-pointer hover:opacity-80 ${
                                    currentPage === idx + 1
                                        ? "bg-black text-white"
                                        : "bg-gray-200"
                                }`}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserQuery;
