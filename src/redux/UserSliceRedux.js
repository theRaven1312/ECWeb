import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: "",
    email: "",
    phone: " ",
    address: "",
    access_token: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, actions) => {
            const {name, email, phone, address, access_token} = actions.payload;
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.access_token = access_token;
        },

        resetUser: (state, actions) => {
            state.name = "";
            state.email = "";
            state.phone = "";
            state.address = "";
            state.access_token = "";
        },
    },
});

export const {updateUser, resetUser} = userSlice.actions;

export default userSlice.reducer;
