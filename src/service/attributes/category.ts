import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface ICategory {
    id?:string;
    name: string;
}
interface IData{
    content:ICategory[]
}
const Category={
    create: async(formData:ICategory)=>{
        return await API.post<ICategory>(
            SERVER.product.url,
            '/category/create',
            formData,
            true,
        )
    },

    update: async(formData:ICategory)=>{
        return await API.post<ICategory>(
            SERVER.product.url,
            '/category/update',
            formData,
            true,
        )
    },
    getAll: async()=>{
        return await API.get<IData>(
            SERVER.product.url,
            '/category/all',
            undefined,
            true,
        )
    },
}

export {Category};