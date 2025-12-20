import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/header/index";
import {StatisticApi} from "../../service/statistic/statistic.ts";
import {Button} from "antd";

// Dữ liệu giả lập (thay thế API thực tế)
const fakeApiData = [
    { date: '2024-11-01', customerId: 'C001', customerName: 'Nguyễn Văn A', orderId: 'O001', revenue: 500 },
    { date: '2024-11-02', customerId: 'C002', customerName: 'Trần Thị B', orderId: 'O002', revenue: 400 },
    { date: '2024-11-03', customerId: 'C003', customerName: 'Lê Minh C', orderId: 'O003', revenue: 700 },
    { date: '2024-10-25', customerId: 'C004', customerName: 'Phạm Tuấn D', orderId: 'O004', revenue: 300 },
    { date: '2024-10-30', customerId: 'C005', customerName: 'Hoàng Thị E', orderId: 'O005', revenue: 200 },
    { date: '2024-09-15', customerId: 'C006', customerName: 'Nguyễn Thanh F', orderId: 'O006', revenue: 800 },
];

const Statistics: React.FC = () => {
    const [statistics, setStatistics] = useState<{ [key: string]: number }>({});
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [tongdoanhthu, setTongdoanhthu] = useState<number>(0);

    // Hàm giả lập API fetch
    const fetchOrdersData = async () => {
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve(fakeApiData);
            }, 500);
        });
    };

    // Hàm chuyển đổi định dạng ngày từ yyyy-mm-dd sang dd/mm/yyyy
    const formatDate = (date: string): string => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return (isNaN(day)||isNaN(month)||isNaN(year))?null: `${day}/${month}/${year}`;
    };

    // Hàm tính toán doanh thu theo thời gian bắt đầu và kết thúc
    const calculateStatistics = (start: string, end: string) => {
        const result: { [key: string]: number } = {};
        const filteredData = fakeApiData.filter(order => {
            const orderDate = new Date(order.date);
            const startDateObj = start ? new Date(start) : new Date(0);
            const endDateObj = end ? new Date(end) : new Date();

            return orderDate >= startDateObj && orderDate <= endDateObj;
        });

        filteredData.forEach(order => {
            const date = new Date(order.date);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            if (result[key]) {
                result[key] += order.revenue;
            } else {
                result[key] = order.revenue;
            }
        });

        setStatistics(result);
        setFilteredOrders(filteredData);
    };

    // Hàm tính tổng doanh thu của tất cả các đơn hàng
    const calculateTotalRevenue = () => {
        const total = fakeApiData.reduce((acc, order) => acc + order.revenue, 0);
        setTotalRevenue(total);
    };

    useEffect(() => {
        fetchOrdersData().then(() => {
            calculateTotalRevenue();
            if (startDate || endDate) {
                calculateStatistics(startDate, endDate);
            } else {
                setFilteredOrders(fakeApiData);
                setStatistics({});
            }
        });
    }, [startDate, endDate]);
    const fetchData=async(start,end)=>{
        try{
            const rsp= await StatisticApi.getStatistic({start,end})
            setFilteredOrders(rsp?.data?.data?.content||[])
            let tutol=0;
            rsp?.data?.data?.content?.forEach(item=>{
                tutol+=item?.total;
                })
            setTongdoanhthu((tutol))
        }catch(e) {
            setFilteredOrders([])
            console.log(e)
        }

    }

    return (
        <div>
            <Header />
            <h1 className="text-center text-5xl font-bold mt-40 mb-4">Thống kê</h1>

            <div className="flex flex-col items-center w-full mt-10">
                <div className="flex items-center gap-6 mb-4">
                    <div>
                        <label>Thời gian bắt đầu: </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2"
                        />
                    </div>

                    <div>
                        <label>Thời gian kết thúc: </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2"
                        />
                    </div>
                    <Button onClick={()=>fetchData(formatDate(startDate),formatDate(endDate))}>Thống kê</Button>
                </div>

                {/* Hiển thị tổng doanh thu toàn bộ */}
                <div className="mb-4">
                    <h1 className="font-bold text-3xl">
                        Tổng doanh thu: {tongdoanhthu} VND
                    </h1>
                </div>

                {/* Hiển thị doanh thu theo thời gian đã chọn */}
                <div className="mb-4">
                    {(startDate || endDate) && (
                        <h1 className="font-bold text-3xl">
                            {startDate && !endDate && `Doanh thu từ ngày ${formatDate(startDate)}: `}
                            {!startDate && endDate && `Doanh thu đến ngày ${formatDate(endDate)}: `}
                            {startDate && endDate && `Doanh thu từ ngày ${formatDate(startDate)} đến ngày ${formatDate(endDate)}: `}
                            {/*{Object.values(statistics).reduce((acc, val) => acc + val, 0)} VND*/}
                            {tongdoanhthu} VND
                        </h1>
                    )}
                </div>

                {/* Bảng thống kê */}
                <div className="mt-4 w-full">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr>

                            {/*<th className="border p-2 text-center">Mã khách hàng</th>*/}
                            <th className="border p-2 text-center">Tên khách hàng</th>
                            <th className="border p-2 text-center">Đơn thành công</th>
                            <th className="border p-2 text-center">Đơn chưa thanh toán</th>
                            <th className="border p-2 text-center">Tổng tiền (VND)</th>
                        </tr>
                        </thead>
                        <tbody>
                            {filteredOrders
                                // .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((order) => (
                                    <tr key={order.orderId}>

                                        {/*<td className="border p-2 text-center">{order.customerId}</td>*/}
                                        <td className="border p-2 text-center">{order?.user}</td>
                                        <td className="border p-2 text-center">{order.billPaid}</td>
                                        <td className="border p-2 text-center">{order.billUnPaid}</td>
                                        <td className="border p-2 text-center">{order.total}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
