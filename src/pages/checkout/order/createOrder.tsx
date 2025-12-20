import  { useState } from 'react';
import 'antd/dist/antd.css';  // Đảm bảo bạn đã import CSS của antd
import { Form, Input, Button, Card } from 'antd';

function OrderForm() {
    const [amount, setAmount] = useState(299999);
    const [orderInfo, setOrderInfo] = useState("Thanh toan don hang 2923");

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleOrderInfoChange = (e) => {
        setOrderInfo(e.target.value);
    };

    const handleSubmit = (values) => {
        // Logic xử lý đơn hàng khi gửi form
        console.log('Order Submitted', values);
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <Card>
                        <div className="card-body">
                            <img src="/vnpay-logo.png" alt="VNPay Logo" style={{ width: '200px' }} />
                            <h2 className="card-title">Tạo Đơn Hàng</h2>
                            <Form onFinish={handleSubmit} initialValues={{ amount, orderInfo }}>
                                <Form.Item
                                    label="Số tiền"
                                    name="amount"
                                    rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                                >
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={handleAmountChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Thông tin đơn hàng"
                                    name="orderInfo"
                                    rules={[{ required: true, message: 'Vui lòng nhập thông tin đơn hàng!' }]}
                                >
                                    <Input
                                        type="text"
                                        value={orderInfo}
                                        onChange={handleOrderInfoChange}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Thanh toán
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default OrderForm;
