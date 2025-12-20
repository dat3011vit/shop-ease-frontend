import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface ISize {
    id?:string;
    value: string;
}
const Size={
    create: async(formData:ISize)=>{
        return await API.post<ISize>(
            SERVER.product.url,
            '/size/create',
            formData,
            true,
        )
    },

    update: async(formData:ISize)=>{
        return await API.post<ISize>(
            SERVER.product.url,
            '/size/update',
            formData,
            true,
        )
    },
    getAll: async()=>{
        return await API.get<ISize[]>(
            SERVER.product.url,
            '/size/all',
            undefined,
            true,
        )
    },
}

export {Size};