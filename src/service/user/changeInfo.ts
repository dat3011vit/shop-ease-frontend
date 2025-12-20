import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IChangeInfoForm {
    full_name: string;
    phone: string;
}
const changeInfo=async(formData:IChangeInfoForm)=>{
    return await API.post<null>(
        SERVER.user.url,
        '/user/change/info',
        formData,
        true
    )
}
export  default changeInfo;