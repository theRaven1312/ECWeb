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
            const {name, email, access_token} = actions.payload;
            state.name = name;
            state.email = email;
            state.access_token = access_token;
            console.log(actions);
        },
    },
});

export const {updateUser} = userSlice.actions;

export default userSlice.reducer;
