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
        <div className="w-full flex items-center p-4 bg-white rounded-lg shadow-md">
            <div
                className={`w-3 h-3 rounded-full mr-4 ${
                    statusColors[state] || statusColors.offline
                }`}
                title={state}
            ></div>
            <div className="flex-1">
                <div className="font-semibold text-gray-900">{username}</div>
                <div className="text-sm text-gray-600">{email}</div>
                <div className="text-xs text-gray-400">
                    Last online: {lastOnline}
                </div>
            </div>
            <span
                className={`ml-4 px-2 py-1 text-xs rounded ${
                    state === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                }`}
            >
                {state.charAt(0).toUpperCase() + state.slice(1)}
            </span>
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
