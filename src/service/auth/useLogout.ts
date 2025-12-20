import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";

const logoutAccount=async()=>{
    return await API.get<null>(
        SERVER.auth.url,
        '/logout',
        {},
        true
    )
}
export  default logoutAccount;