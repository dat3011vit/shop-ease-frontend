import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
import {IProduct} from "../../common/models/Product.ts";
const getProduct=async(payload:any)=>{
    return await API.post<IProduct>(
        SERVER.product.url,
        `product/create`,
        payload,
        true,
    )
}
export  default getProduct;