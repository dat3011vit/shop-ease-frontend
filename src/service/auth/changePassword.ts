import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IChangeForm {
    oldPassword: string;
    newPassword: string;
}
const changePassword=async(formData:IChangeForm)=>{
    return await API.post<null>(
        SERVER.auth.url,
        '/change-password',
        formData,
        true
    )
}
export  default changePassword;