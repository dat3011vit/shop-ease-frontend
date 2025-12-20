import {API} from "../api.ts";
import {IProduct} from "../../common/models/Product.ts";
import {SERVER} from "../../environment.ts";

const ChatApi= {
    query: async (params) => {
        return await API.get<any>(
            SERVER.chat.url,
            `/ques/ask`,
            params,
            false,
        )
    },
}
export {ChatApi}