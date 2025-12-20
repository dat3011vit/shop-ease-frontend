import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
const defaultAddress=async(addressId:string)=>{
    return await API.get<string>(
        SERVER.user.url,
        `/address/set-default/${addressId}`,
        undefined,
        true,
    )
}
export  default defaultAddress;