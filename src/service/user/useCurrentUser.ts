import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
import {IAccount} from "../../common/models/User.ts";
const getCurrent=async()=>{
    return await API.get<IAccount>(
        SERVER.auth.url,
        '/my-account',
        undefined,
        true,
    )
}
export  default getCurrent;