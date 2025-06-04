import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    access_token: "",
    isSubscribe: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, actions) => {
            const {
                name,
                email,
                phone,
                address,
                role,
                access_token,
                isSubscribe,
            } = actions.payload;
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.role = role;
            state.access_token = access_token;
            state.isSubscribe = isSubscribe || false;
        },
        resetUser: (state, actions) => {
            state.name = "";
            state.email = "";
            state.phone = "";
            state.address = "";
            state.role = "";
            state.access_token = "";
            state.isSubscribe = false;
        },
    },
});

export const {updateUser, resetUser} = userSlice.actions;

export default userSlice.reducer;
