import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
const ChangeActiveUser=async(params,id)=>{
    return await API.get<null>(
        SERVER.user.url,
        `/user/delete-user/${id}`,
        params,
        true
    )
}
export  default ChangeActiveUser;