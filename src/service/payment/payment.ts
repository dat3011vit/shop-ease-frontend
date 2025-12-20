import {API} from "@/service/api.ts";
import {SERVER} from "@/environment.ts";

const PaymentApi={
    create:async (formData)=>{
        return await API.get<any>(
            SERVER.payment.url,
            '/v1/payment/vn-pay',
            formData,
            true,
        )
    },
    delete:async  ()=>{

    }
}
export {PaymentApi}