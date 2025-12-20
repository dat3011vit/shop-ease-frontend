import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
    isLoggedIn: boolean,
    token: string |null,
    msg: string,
}
const initialState: AuthState = {
    isLoggedIn: false,
    token: null,
    msg: '',
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state: AuthState, action: PayloadAction<AuthState>) => {
            console.log({da:action.payload})
            state.token = action.payload.token;
            state.isLoggedIn = action.payload.isLoggedIn;
            state.msg = action.payload.msg;

        },
        logout: (state: AuthState) => {
            state.token =null;
            state.isLoggedIn = false;
            state.msg = "";

        }
    },
});
export const { setAuth,logout } = authSlice.actions;
export default authSlice.reducer;
