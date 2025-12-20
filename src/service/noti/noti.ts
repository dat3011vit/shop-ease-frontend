import {API} from "../api.ts";
import {IProduct} from "../../common/models/Product.ts";
import {SERVER} from "../../environment.ts";

const NotiApi={

    delete:async  ()=>{

    },

    getNoti: async (params,userId)=>{
        return await API.get<any>(
            SERVER.noti.url,
            `${userId}`,
            params,
            false,
        )
    },
}
export {NotiApi}