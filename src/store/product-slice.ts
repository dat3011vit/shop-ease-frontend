import {PayloadAction,createSlice} from "@reduxjs/toolkit"
import {IProduct} from "../common/models/Product.ts";


interface UserState {
    product: IProduct | null;
    products:IProduct[];
}
const initialState={
    product:  null,
    products:[],
}
export const  productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{
        setProduct:(state:UserState,action:PayloadAction<IProduct|null>)=>{
            state.product=action.payload
        }
    }
})
export const {setProduct}=productSlice.actions
export default productSlice.reducer