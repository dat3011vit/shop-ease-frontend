import {API} from "../api.ts";
import {IProduct} from "../../common/models/Product.ts";
import {SERVER} from "../../environment.ts";

const OrderApi={
    create: async (payload)=>{
        return await API.post<IProduct>(
            SERVER.product.url,
            `order/create`,
            payload,
            true,
        )
    },
    createByProduct:async (payload)=>{
        return await API.post<IProduct>(
            SERVER.product.url,
            `order/create`,
            payload,
            true,
        )
    },

    createByCart:async (payload)=>{
        return await API.post<IProduct>(
            SERVER.product.url,
            `order/create`,
            payload,
            true,
        )
    },
    delete:async  ()=>{

    },

    getByStatus: async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            `order/user/byStatus`,
            params,
            true,
        )
    },
    getByStatusAdmin: async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            `order/byStatus`,
            params,
            true,
        )
    },
    cancelOrder:async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            `order/cancel`,
            params,
            true,
        )
    },
    changeStatusOrder:async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            `order/change-status`,
            params,
            true,
        )
    }

}
export {OrderApi}