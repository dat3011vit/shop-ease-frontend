import { Button, Table, Typography, Card } from 'antd';
import 'antd/dist/antd.css'; // Đảm bảo bạn đã import CSS của antd
import { useTranslation } from 'react-i18next';

const { Title} = Typography;

const PaymentSuccess = () => {
    const { t } = useTranslation('checkout');
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
            title: t('orderInfo'),
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: t('value'),
            dataIndex: 'value',
            key: 'value',
        },
    ];

    // Dữ liệu bảng
    const data = [
        {
            key: t('orderInfo'),
            value: orderDetails.orderId,
        },
        {
            key: t('totalPrice'),
            value: orderDetails.totalPrice,
        },
        {
            key: t('paymentTime'),
            value: orderDetails.paymentTime,
        },
        {
            key: t('transactionId'),
            value: orderDetails.transactionId,
        },
    ];

    return (
        <div className="container" style={{ paddingTop: '50px' }}>
            <Card style={{ maxWidth: '600px', margin: 'auto' }}>
                <Title level={1} className="text-success text-center">{t('paymentSuccess')}</Title>
                <Title level={2}>{t('orderDetails')}</Title>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                />
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <Button type="primary" href="/">{t('backToHome')}</Button>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
