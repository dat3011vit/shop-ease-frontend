export const orderMenu=[
    { "id": 1, "name": "Đơn hàng chờ thanh toán",active:'CHO_XAC_NHAN'  },
    { "id": 2, "name": "Đơn hàng chờ vận chuyển" ,active:"CHO_VAN_CHUYEN" },
    { "id": 3, "name": "Đơn hàng đang giao" ,active:"DANG_GIAO" },
    { "id": 4, "name": "Đơn hàng giao thành công" ,active:"GIAO_HANG_THANH_CONG" },
    { "id": 5, "name": "Đơn hàng đã hủy" ,active:"HUY_HANG" },
    // { "id": 6, "name": "Đơn hàng đã hoàn" ,active:"1" },
    // { "id": 7, "name": "Đơn hàng đang hoàn" ,active:"HANG_HOAN" }
]


export const  Order_Status ={
        CHO_XAC_NHAN:'CHO_XAC_NHAN',
        CHO_VAN_CHUYEN:'CHO_VAN_CHUYEN',
        DANG_GIAO:'DANG_GIAO',
        GIAO_HANG_THANH_CONG:'GIAO_HANG_THANH_CONG',
        HUY_HANG:'HUY_HANG',
        HANG_HOAN:'HUY_HANG',
}