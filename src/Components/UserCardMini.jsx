import React from "react";
import axios from "axios";

const UserCardMini = ({id, username, email, role, onDelete, onChangeRole}) => {
    const handleDelete = () => {
        if (onDelete) onDelete(id);
    };

    const handleChangeRole = (newRole) => {
        if (onChangeRole) onChangeRole(id, newRole);
    };

    return (
        <div className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
            <div className="flex-center gap-10">
                <div className="font-semibold text-gray-900">{username}</div>
                <div className="text-sm text-gray-600">{email}</div>
            </div>
            <div className="flex-center">
                <button
                    className="ml-4 p-2 rounded cursor-pointer hover:bg-red-100"
                    onClick={handleDelete}
                    title="Delete user"
                >
                    <i className="fa-solid fa-trash-can cursor-pointer text-red-500"></i>
                </button>
                <select
                    className="ml-4 p-2 rounded-md  cursor-pointer hover:bg-gray-100"
                    value={role}
                    onChange={(e) => handleChangeRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </div>
    );
};

export default UserCardMini;
