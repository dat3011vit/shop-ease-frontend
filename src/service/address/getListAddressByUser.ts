import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IAddress {
    id:string;
    phone: string;
    direction: string;
    default: boolean;
    city_code:string;
    ward_code:string;
    district_code:string;
    street:string;
    consignee:string;
    user_id:string;
}
const getListAddressByUser=async(userId:string)=>{
    return await API.get<IAddress[]>(
        SERVER.user.url,
        `/address/get-address/${userId}`,
        undefined,
        true,
    )
}
export  default getListAddressByUser;