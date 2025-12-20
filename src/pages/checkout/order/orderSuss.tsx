import { Button, Table, Typography, Card } from 'antd';
import 'antd/dist/antd.css'; // Đảm bảo bạn đã import CSS của antd

const { Title} = Typography;

const PaymentSuccess = () => {
    // Dữ liệu giả lập cho các thông tin đơn hàng
    const orderDetails = {
        orderId: "123456789",
        totalPrice: "299999",
        paymentTime: "2024-12-14 10:30:00",
        transactionId: "TXN12345678",
    };

    // Cột dữ liệu cho bảng hiển thị
    const columns = [
        {
            title: 'Thông tin đơn hàng',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    // Dữ liệu bảng
    const data = [
        {
            key: 'Thông tin đơn hàng',
            value: orderDetails.orderId,
        },
        {
            key: 'Tổng tiền',
            value: orderDetails.totalPrice,
        },
        {
            key: 'Thời gian thanh toán',
            value: orderDetails.paymentTime,
        },
        {
            key: 'Mã giao dịch',
            value: orderDetails.transactionId,
        },
    ];

    return (
        <div className="container" style={{ paddingTop: '50px' }}>
            <Card style={{ maxWidth: '600px', margin: 'auto' }}>
                <Title level={1} className="text-success text-center">Thanh toán thành công</Title>
                <Title level={2}>Chi tiết đơn hàng</Title>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                />
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <Button type="primary" href="/">Về trang chủ</Button>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
