import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
import {IAddress} from "./getListProduct.ts";



const Product={
    searchListProduct:async(params)=>{
        return await API.get<any>(
            SERVER.product.url,
            `product/find`,
            params,
            true,
        )
    },

    getListProductByCategory:async(params)=>{
        return await API.get<IAddress[]>(
            SERVER.product.url,
            `product/byCategory`,
            {...params,
                categoryId:params.category
            },
            true,
        )
    },
    getListProductSeason:async(params)=>{
        return await API.get<IAddress[]>(
            SERVER.product.url,
            `product/bySeason`,
            {...params,
                seasonId:params.season
            },
            true,
        )
    },
    getListProductElk:async(params)=>{
        return await API.get<IAddress[]>(
            SERVER.product.url,
            `/product-elk/sorted`,
            params,
            true,
        )
    }
}

export {Product};