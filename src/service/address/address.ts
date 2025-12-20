import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IAddressForm {
    id:string;
    city_id: string;
    district_id: string;
    ward_id: string;
    street: string|null;
    consignee: string;
    phone:string;
}
const createAddress=async(formData:IAddressForm)=>{
    return await API.post<any>(
        SERVER.user.url,
        '/address/create',
        formData,
        true,
    )
}
export  default createAddress;