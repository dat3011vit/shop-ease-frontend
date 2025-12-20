import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getListAddressByUser, {IAddress} from "../service/address/getListAddressByUser.ts";

// Async Thunk to fetch cart items
export const fetchListAddress = createAsyncThunk(
    'cart/fetchCart',
    async (userId:string) => {
        try {
            const response =  await getListAddressByUser(userId);
            if (response.data.isSuccess && response?.data?.data) {
                return response?.data;
            }
            else{
                return null;
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }
);

// Initial state
const initialState: {
    address: IAddress[]; // List of items in the cart
    addressDefault:IAddress|null|undefined;
    msg: string;
    loading: boolean;
} = {
    address: [],
    addressDefault:null,
    msg: '',
    loading: false,
};

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        clearCart: (state) => {
            state.address = [];
            state.msg = 'address cleared successfully.';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListAddress.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.isSuccess) {
                    state.address = action.payload?.data || [];
                    state.addressDefault=action.payload?.data?.find(item=>item.default)||action.payload?.data?.[0]
                    state.msg = "Lấy thành công" ;
                } else {
                    state.address = [];
                    state.addressDefault=null
                    state.msg = 'Error occurred.';
                }
            })
            .addCase(fetchListAddress.rejected, (state, action) => {
                state.loading = false;
                state.addressDefault=null
                state.address = [];
                state.msg = 'Error occurred.'; // Error message from rejectWithValue
            });
    },
});

// Export actions and reducer
const { actions, reducer } = cartSlice;
export const {  } = actions;
export default reducer;
