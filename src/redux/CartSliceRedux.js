import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    quantity: 0,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartQuantity: (state, action) => {
            state.quantity = action.payload;
        },
        addToCart: (state, actions) => {
            state.quantity += actions.payload;
        },
        removeFromCart: (state, actions) => {
            if (state.quantity - actions.payload < 0) {
                state.quantity = 0;
                return;
            }
            state.quantity -= actions.payload;
        },
    },
});

export const {setCartQuantity, addToCart, removeFromCart} = cartSlice.actions;

export default cartSlice.reducer;
