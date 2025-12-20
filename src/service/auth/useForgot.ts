import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IForgotForm {
    email: string;
}
const forgotPassord=async(formData:IForgotForm)=>{
    return await API.post<null>(
        SERVER.auth.url,
        '/forgot-password',
        formData
    )
}
export  default forgotPassord;