import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../redux/UserSliceRedux.js";
import cartReducer from "../redux/CartSliceRedux.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
});
