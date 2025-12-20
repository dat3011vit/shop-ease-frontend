import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
import {IProduct} from "../../common/models/Product.ts";
const getProduct=async(params:{productId:string})=>{
    return await API.get<IProduct>(
        SERVER.product.url,
        `product/get`,
        params,
        true,
    )
}
export  default getProduct;