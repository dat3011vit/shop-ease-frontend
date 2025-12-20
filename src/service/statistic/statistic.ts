// import {API} from "@/service/api.ts";
// import {SERVER} from "@/environment.ts";
import {API} from "../api.ts";
import {SERVER} from "../../environment.ts";


const StatisticApi={
    getStatistic:async (params)=>{
        return await API.get<any>(
            SERVER.product.url,
            '/statistic/inRange',
            params,
            true,
        )
    },

    delete:async  ()=>{

    }
}

export {StatisticApi}