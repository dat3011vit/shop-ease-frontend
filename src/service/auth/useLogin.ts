import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
import {IAccount} from "../../common/models/User.ts";
export interface ILoginForm {
    username: string;
    password: string;
}
const login=async(formData:ILoginForm)=>{
    return await API.post<{account:IAccount,token:string}>(
        SERVER.auth.url,
        '/login',
        formData
    )
}
export  default login;