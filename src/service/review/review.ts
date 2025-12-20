import {API} from "@/service/api.ts";
import {SERVER} from "@/environment.ts";
interface IReview{
    id:number;
    content:string;
    value:number;
    product_id:number;
}
const ReviewApi={
    create:async (body:IReview)=>{
        return await API.post<IReview>(
            SERVER.product.url,
            '/review/create',
            body,
            true,
        )
    },
    update:async (body:IReview)=>{
        return await API.post<IReview>(
            SERVER.product.url,
            '/review/update',
            body,
            true,
        )
    },
    getReviewByProduct:async (params)=>{
        return await API.get<IReview[]>(
            SERVER.product.url,
            '/review/byProductId',
            params,
            true,
        )
    },

    getReviewUpdate:async (params)=>{
        return await API.get<IReview[]>(
            SERVER.product.url,
            '/review/byUserAndProduct',
            params,
            true,
        )
    },
    delete:async  ()=>{

    }
}

export {ReviewApi}