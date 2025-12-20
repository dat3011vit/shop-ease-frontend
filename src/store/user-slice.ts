import {PayloadAction, createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {IUser, ERole, IAccount} from '../common/models/User.ts';
import getCurrent from "@/service/user/useCurrentUser.ts";

interface UserState {
    user: IUser | null;
    role: ERole | null;
    account:IAccount | null;
}
const initialState: UserState = {
    user: null,
    role: null, //Role.CUSTOMER
    account:null,
};
export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async () => {
        try {
            console.log("nha","33")
            const response = await getCurrent()
            if (response?.data?.isSuccess) {
                return response?.data;
            } else {
                return response?.data;
            }
            console.log("nha","34")

        } catch (error) {console.log(error)
            console.log("nha","35")
            throw new Error(error);

            return null;
        }
    }
);
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<IUser | null>) => {
            state.user = action.payload;
        },
        setRole: (state: UserState, action: PayloadAction<ERole | null>) => {
            state.role = action.payload;
        },
        setAccount: (state: UserState, action: PayloadAction<IAccount | null>) => {
            state.account = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // category
            .addCase(fetchUser.pending, () => {
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                console.log("nha","3x")

                if (action.payload?.isSuccess) {
                    state.user = action.payload?.data?.account?.user || null
                    state.account = action.payload?.data?.account || null
                    state.role = action.payload?.data?.account?.role?.name || null

                } else {
                    state.user = null
                    state.account = null
                    state.role = null
                }
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = null
                state.account = null
                state.role = null
            })
    }
});
export const { setUser, setRole,setAccount } = userSlice.actions;
export default userSlice.reducer;
