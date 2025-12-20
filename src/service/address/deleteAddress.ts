import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";
const deleteAddress=async(addressId:string)=>{
    return await API.delete<string>(
        SERVER.user.url,
        `/address/delete/${addressId}`,
        undefined,
        true,
    )
}
export  default deleteAddress;