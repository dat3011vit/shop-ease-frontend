import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
import {IDataListUser} from "../../pages/admin/user-list.tsx";
export interface IUserSort {
    key?: string|null;
    page:number;
    limit:number;
    isActive:boolean;
}
const getListUser=async(params:IUserSort)=>{
    return await API.get<IDataListUser>(
        SERVER.user.url,
        '/user/getAll',
        params,
        true,
    )
}
export  default getListUser;