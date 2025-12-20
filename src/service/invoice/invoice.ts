import {API} from "@/service/api.ts";
import {SERVER} from "@/environment.ts";
interface IReview{
    id:number;
    content:string;
    value:number;
    product_id:number;
}
const InvoceApi={
    getInvoiceAdmin:async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            '/order/allBills',
            params,
            true,
        )
    },
    getInvoiceAdminSatus:async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            '/order/allBills/status',
            params,
            true,
        )
    },
    getInvoiceUser:async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            '/order/user/bill/status',
            params,
            true,
        )
    },
    delete:async  ()=>{

    }
}

export {InvoceApi}