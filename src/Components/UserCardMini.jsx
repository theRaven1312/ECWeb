import React from "react";
import axios from "axios";

const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
};

const UserCardMini = ({
    id,
    username,
    email,
    role,
    lastOnline,
    state,
    onDelete,
}) => {
    const handleDelete = () => {
        if (onDelete) onDelete(id);
    };

    return (
        <div className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
            <div className="flex-center gap-10">
                <div className="font-semibold text-gray-900">{username}</div>
                <div className="text-sm text-gray-600">{email}</div>
            </div>
            {role === "user" ? (
                <button
                    className="ml-4 p-2 rounded cursor-pointer hover:bg-red-100"
                    onClick={handleDelete}
                    title="Delete user"
                >
                    <i className="fa-solid fa-trash-can cursor-pointer text-red-500"></i>
                </button>
            ) : (
                ""
            )}
        </div>
    );
};

export default UserCardMini;
