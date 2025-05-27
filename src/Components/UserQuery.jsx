import React, {useEffect, useState} from "react";
import UserCardMini from "./UserCardMini";
import axios from "axios";
import {useSelector} from "react-redux";

const UserQuery = () => {
    const [users, setUsers] = useState([]);
    const user = useSelector((state) => state.user);
    useEffect(() => {
        axios
            .get("http://localhost:3000/api/v1/users", {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            })
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="container mx-auto p-4">
            {users.map((user) => (
                <UserCardMini
                    key={user._id}
                    username={user.username}
                    email={user.email}
                    lastOnline={user.lastOnline || "N/A"}
                    state={user.state || "offline"}
                />
            ))}
        </div>
    );
};

export default UserQuery;
