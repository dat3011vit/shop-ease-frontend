import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface ICartCreate {
    quantity:string;
    productId: string;
    colorId:string;
    sizeId: string;
}
interface IContent{
    content:ICartItem[]
}
export interface ICartItem {
    cspId: number; // ID kết hợp sản phẩm, màu sắc, kích thước
    size: string; // Kích thước sản phẩm (ví dụ: "L")
    colors: string; // Tên màu sản phẩm (ví dụ: "Nghệ")
    code: string; // Mã màu dạng hex (ví dụ: "F9C74F")
    product: string; // Tên sản phẩm
    price: number; // Giá sản phẩm
    quantity: number; // Số lượng sản phẩm trong giỏ hàng
    productId: number; // ID sản phẩm gốc
    colorId: number; // ID màu sắc được chọn
    sizeId: number; // ID kích thước được chọn
    cart_product_id: number; // ID duy nhất của sản phẩm trong giỏ hàng
    imageSrc:string;
}


const Cart={
    create: async(formData:ICartCreate[])=>{
        return await API.post<ICartItem>(
            SERVER.product.url,
            '/cart/create',
            formData,
            true,
        )
    },

    getAll: async()=>{
        return await API.get<IContent>(
            SERVER.product.url,
            '/cart/getCart',
            undefined,
            true,
        )
    },
    getLimit: async(params:{page:number,size:number})=>{
        return await API.get<IContent>(
            SERVER.product.url,
            '/cart/getCart',
            params,
            true,
        )
    },
    delete: async(params:{page:number,size:number})=>{
        return await API.get<IContent>(
            SERVER.product.url,
            '/cart/getCart',
            params,
            true,
        )
    },
}

export {Cart};