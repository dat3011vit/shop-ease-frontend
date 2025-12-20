import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {Cart, ICartItem} from "../service/cart/cart.ts";

// Async Thunk to fetch cart items
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        try {
            const response = await Cart.getAll();
            if (response?.data?.isSuccess) {
                return response?.data;
            } else {
               return response?.data;
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }
);

// Initial state
const initialState: {
    cartItems: ICartItem[]; // List of items in the cart
    msg: string;
    loading: boolean;
} = {
    cartItems: [],
    msg: '',
    loading: true,
};

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
            state.msg = 'Cart cleared successfully.';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                console.log("aa",13)
                state.loading = false;
                state.cartItems = [];
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                console.log("aa",12)
                if (action.payload?.isSuccess) {
                    state.cartItems = action.payload?.data?.content || [];
                    state.msg = "Lấy thành công" ;
                } else {
                    state.cartItems = [];
                    state.msg = 'Error occurred.';
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                console.log("aa",14)
                state.cartItems = [];
                state.msg = 'Error occurred.'; // Error message from rejectWithValue
            });
    },
});

// Export actions and reducer
const { actions, reducer } = cartSlice;
export const { clearCart } = actions;
export default reducer;
