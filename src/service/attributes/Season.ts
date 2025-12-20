import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface ISeason {
    id?:string;
    name: string;
    year: string;
}

interface IData{
    content:ISeason[]
}
const Season={
    create: async(formData:ISeason)=>{
        return await API.post<ISeason>(
            SERVER.product.url,
            '/season/create',
            formData,
            true,
        )
    },

    update: async(formData:ISeason)=>{
        return await API.post<ISeason>(
            SERVER.product.url,
            '/season/update',
            formData,
            true,
        )
    },
    getAll: async()=>{
        return await API.get<IData>(
            SERVER.product.url,
            '/season/all',
            undefined,
            true,
        )
    },
}

export {Season};