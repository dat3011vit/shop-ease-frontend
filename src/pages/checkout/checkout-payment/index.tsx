import React from "react";
import { Card, Row, Col, Button, Typography, Divider } from "antd";
import { EnvironmentOutlined, TagOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const CheckoutList = () => {
    // Danh sách sản phẩm
    const products = [
        {
            id: 1,
            name: "Chuột Gaming Máy Tính FREE WOLF V5 PRO",
            price: 109000,
            quantity: 1,
            image: "https://via.placeholder.com/100", // Thay bằng link ảnh
        },
        {
            id: 2,
            name: "Bàn phím Cơ Gaming RGB",
            price: 350000,
            quantity: 1,
            image: "https://via.placeholder.com/100",
        },
    ];

    const shipping = 16500; // Phí vận chuyển chung
    const discount = 5000; // Voucher giảm giá

    // Tính tổng tiền
    const totalProductPrice = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    const total = totalProductPrice + shipping - discount;

    return (
        <Card style={{ maxWidth: 800, margin: "20px auto" }} bordered>
            {/* Địa chỉ nhận hàng */}
            <Row align="middle" style={{ marginBottom: 20 }}>
                <Col span={24}>
                    <Title level={4}>
                        <EnvironmentOutlined style={{ marginRight: 10 }} />
                        Địa Chỉ Nhận Hàng
                    </Title>
                    <Text strong>Đinh Nguyễn (+84) 963045750</Text>
                    <br />
                    <Text>
                        Số Nhà 59, Ngõ 147 Đường Vũ Tông Phan, Phường Khương Trung, Quận
                        Thanh Xuân, Hà Nội
                    </Text>
                </Col>
            </Row>
            <Divider />

            {/* Danh sách sản phẩm */}
            {products.map((product) => (
                <Row
                    key={product.id}
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: 20 }}
                >
                    <Col span={6}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "100%", borderRadius: 4 }}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={5}>{product.name}</Title>
                        <Text>Số lượng: {product.quantity}</Text>
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <Text strong>
                            ₫{(product.price * product.quantity).toLocaleString()}
                        </Text>
                    </Col>
                </Row>
            ))}

            {/* Voucher */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <TagOutlined style={{ marginRight: 8 }} />
                    <Text strong>Voucher của Shop</Text>
                </Col>
                <Col>
                    <Text style={{ color: "red" }}>-₫{discount.toLocaleString()}</Text>
                </Col>
            </Row>

            <Divider />

            {/* Tổng thanh toán */}
            <Row justify="end" style={{ marginBottom: 20 }}>
                <Col>
                    <Row justify="space-between" style={{ width: 300 }}>
                        <Text>Tổng tiền hàng:</Text>
                        <Text strong>₫{totalProductPrice.toLocaleString()}</Text>
                    </Row>
                    <Row justify="space-between" style={{ width: 300 }}>
                        <Text>Phí vận chuyển:</Text>
                        <Text strong>₫{shipping.toLocaleString()}</Text>
                    </Row>
                    <Row justify="space-between" style={{ width: 300 }}>
                        <Text>Voucher giảm giá:</Text>
                        <Text strong>-₫{discount.toLocaleString()}</Text>
                    </Row>
                    <Divider />
                    <Row justify="space-between" style={{ width: 300 }}>
                        <Title level={4}>Tổng thanh toán:</Title>
                        <Title level={4} style={{ color: "red" }}>
                            ₫{total.toLocaleString()}
                        </Title>
                    </Row>
                </Col>
            </Row>

            {/* Nút đặt hàng */}
            <Button
                type="primary"
                size="large"
                block
                style={{ backgroundColor: "#f53d2d", borderColor: "#f53d2d" }}
            >
                Đặt Hàng
            </Button>
        </Card>
    );
};

export default CheckoutList;
