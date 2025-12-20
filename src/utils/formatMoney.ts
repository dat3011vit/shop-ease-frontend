export default function formatMoney(money:number|string){
    return money.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}