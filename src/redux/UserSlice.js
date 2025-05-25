import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: "",
    email: "",
    access_token: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, actions) => {
            const {name, email, phone, address, password, access_token} =
                actions.payload;
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.password = password;
            state.access_token = access_token;
        },

        resetUser: (state, actions) => {
            state.name = "";
            state.email = "";
            state.access_token = "";
        },
    },
});

export const {updateUser, resetUser} = userSlice.actions;

export default userSlice.reducer;
