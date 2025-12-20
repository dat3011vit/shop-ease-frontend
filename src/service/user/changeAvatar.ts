import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
const changeAvatar=async({urlAvatar}:{
urlAvatar:string
})=>{
    return await API.post<null>(
        SERVER.user.url,
        '/user/change/avt',
        {urlAvatar},
        true
    )
}
export  default changeAvatar;