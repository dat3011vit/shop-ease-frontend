import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {Category, ICategory} from "@/service/attributes/category.ts";
import {Color, IColor} from "@/service/attributes/color.ts";
import {ISeason, Season} from "@/service/attributes/Season.ts";
import {ISize, Size} from "@/service/attributes/size.ts";

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async () => {
        try {
            const response = await Category.getAll();
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
export const fetchColor = createAsyncThunk(
    'color/fetchColor',
    async () => {
        try {
            const response = await Color.getAll();
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
export const fetchSeason = createAsyncThunk(
    'season/fetchSeason',
    async () => {
        try {
            const response = await Season.getAll();
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
export const fetchSize = createAsyncThunk(
    'size/fetchSize',
    async () => {
        try {
            const response = await Size.getAll();
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
    sizes:ISize[];
    categories:ICategory[];
    seasons:ISeason[];
    colors:IColor[];
    msg: string;
    loading: boolean;
} = {
    sizes:[],
    categories:[],
    seasons:[],
    colors:[],
    msg: '',
    loading: false,
};

const attributeSlice = createSlice({
    name: 'attribute',
    initialState: initialState,
    reducers: {
        // clearCart: (state) => {
        //     state.cartItems = [];
        //     state.msg = 'Cart cleared successfully.';
        // },
    },
    extraReducers: (builder) => {
        builder
            // category
            .addCase(fetchCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.isSuccess) {
                    state.categories = action.payload?.data?.content || [];
                    state.msg = "Lấy thành công" ;
                } else {
                    state.categories = [];
                    state.msg = 'Error occurred.';
                }
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.loading = false;
                state.categories = [];
                state.msg = 'Error occurred.'; // Error message from rejectWithValue
            })
            // color
            .addCase(fetchColor.pending, (state) => {
                    state.loading = true;
            })
            .addCase(fetchColor.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.isSuccess) {
                    state.colors = action.payload?.data || [];
                    state.msg = "Lấy thành công" ;
                } else {
                    state.colors = [];
                    state.msg = 'Error occurred.';
                }
            })
            .addCase(fetchColor.rejected, (state, action) => {
                state.loading = false;
                state.colors = [];
                state.msg = 'Error occurred.'; // Error message from rejectWithValue
            })
            // season
            .addCase(fetchSeason.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSeason.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.isSuccess) {
                    state.seasons = action.payload?.data?.content || [];
                    state.msg = "Lấy thành công" ;
                } else {
                    state.seasons = [];
                    state.msg = 'Error occurred.';
                }
            })
            .addCase(fetchSeason.rejected, (state, action) => {
                state.loading = false;
                state.seasons = [];
                state.msg = 'Error occurred.'; // Error message from rejectWithValue
            })

            // size
            .addCase(fetchSize.pending, (state) => {
                    state.loading = true;
            })
            .addCase(fetchSize.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.isSuccess) {
                    state.sizes = action.payload?.data || [];
                    state.msg = "Lấy thành công" ;
                } else {
                    state.sizes = [];
                    state.msg = 'Error occurred.';
                }
            })
            .addCase(fetchSize.rejected, (state, action) => {
                state.loading = false;
                state.sizes = [];
                state.msg = 'Error occurred.'; // Error message from rejectWithValue
            });
    },
});

// Export actions and reducer
const { actions, reducer } = attributeSlice;
export const {  } = actions;
export default reducer;
