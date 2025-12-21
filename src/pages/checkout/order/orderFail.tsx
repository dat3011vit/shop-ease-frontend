import  { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import 'antd/dist/antd.css'; // Đảm bảo bạn đã import CSS của antd
import { useTranslation } from 'react-i18next';

const OrderFail = () => {
    const { t } = useTranslation('checkout');
    const [amount, setAmount] = useState(299999);
    const [orderInfo, setOrderInfo] = useState("Thanh toan don hang 2923");

    // Xử lý khi người dùng thay đổi giá trị số tiền
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    // Xử lý khi người dùng thay đổi thông tin đơn hàng
    const handleOrderInfoChange = (e) => {
        setOrderInfo(e.target.value);
    };

    // Xử lý khi gửi form
    const handleSubmit = (values) => {
        console.log('Order Submitted:', values);
        // Tại đây có thể thêm logic gọi API để gửi đơn hàng
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <Card>
                        <div className="card-body">
                            <img src="/vnpay-logo.png" alt="VNPay Logo" style={{ width: '200px' }} />
                            <h2 className="card-title">{t('createOrder')}</h2>
                            <Form onFinish={handleSubmit} initialValues={{ amount, orderInfo }}>
                                {/* Trường nhập số tiền */}
                                <Form.Item
                                    label={t('amount')}
                                    name="amount"
                                    rules={[{ required: true, message: t('amountRequired') }]}
                                >
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={handleAmountChange}
                                    />
                                </Form.Item>

                                {/* Trường nhập thông tin đơn hàng */}
                                <Form.Item
                                    label={t('orderInfo')}
                                    name="orderInfo"
                                    rules={[{ required: true, message: t('orderInfoRequired') }]}
                                >
                                    <Input
                                        type="text"
                                        value={orderInfo}
                                        onChange={handleOrderInfoChange}
                                    />
                                </Form.Item>

                                {/* Nút gửi đơn hàng */}
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        {t('pay')}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderFail;
