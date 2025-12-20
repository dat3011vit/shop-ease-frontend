// src/SalesDashboard.tsx

import React, { useState } from 'react';
import { Button, Select, Card, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

interface SalesData {
    month: string;
    revenue: number;
}

const SalesDashboard: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Giả lập dữ liệu doanh thu
    const salesData: SalesData[] = [
        { month: 'January', revenue: 1200 },
        { month: 'February', revenue: 1500 },
        { month: 'March', revenue: 1800 },
        { month: 'April', revenue: 2000 },
        { month: 'May', revenue: 2200 },
        { month: 'June', revenue: 2500 },
        { month: 'July', revenue: 2700 },
        { month: 'August', revenue: 3000 },
        { month: 'September', revenue: 3200 },
        { month: 'October', revenue: 3500 },
        { month: 'November', revenue: 4000 },
        { month: 'December', revenue: 4500 },
    ];

    const getTotalRevenue = (monthIndex: number) => {
        return salesData[monthIndex]?.revenue || 0;
    };

    const totalRevenuePerMonth = salesData.map(data => data.revenue);

    return (
        <div style={{ padding: '20px' }}>
            <Card title="Doanh Thu Thống Kê" style={{ marginBottom: '20px' }}>
                <Title level={4}>Tổng Doanh Thu Tháng {salesData[selectedMonth].month} {selectedYear}: {getTotalRevenue(selectedMonth)} VNĐ</Title>
                <Button onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}>Tháng Trước</Button>
                <Button onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}>Tháng Sau</Button>
            </Card>

            <Card title="Biểu Đồ Doanh Thu Từng Tháng">
                <LineChart width={600} height={300} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
                <Button onClick={() => setSelectedYear((prev) => prev - 1)}>Năm Trước</Button>
                <Button onClick={() => setSelectedYear((prev) => prev + 1)}>Năm Sau</Button>
            </Card>

            <Card title="Doanh Thu Theo Tháng">
                <Title level={4}>Doanh Thu Từng Tháng</Title>
                {salesData.map((data, index) => (
                    <div key={index}>
                        <span>{data.month}: {data.revenue} VNĐ</span>
                        <Button onClick={() => setSelectedMonth(index)} style={{ marginLeft: '10px' }}>
                            Xem
                        </Button>
                    </div>
                ))}
            </Card>
        </div>
    );
};

export default SalesDashboard;