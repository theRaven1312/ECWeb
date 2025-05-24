import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../redux/UserSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
