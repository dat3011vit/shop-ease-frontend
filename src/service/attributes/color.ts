import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IColor {
    id?:string;
    value: string;
    code: string;
}
const Color={
    create: async(formData:IColor)=>{
        return await API.post<IColor>(
            SERVER.product.url,
            '/color/create',
            formData,
            true,
        )
    },

    update: async(formData:IColor)=>{
        return await API.post<IColor>(
            SERVER.product.url,
            '/color/update',
            formData,
            true,
        )
    },
    getAll: async()=>{
        return await API.get<IColor[]>(
            SERVER.product.url,
            '/color/all',
            undefined,
            true,
        )
    },
}

export {Color};