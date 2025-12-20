import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
export interface IChangeEmailForm {
    newEmail: string;
}
const changeEmail=async(formData:IChangeEmailForm)=>{
    return await API.post<null>(
        SERVER.auth.url,
        '/change-email',
        formData,
        true
    )
}
export  default changeEmail;