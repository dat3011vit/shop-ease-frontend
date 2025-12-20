import React, {useEffect, useState} from "react";
import {Card, Row, Col, Button, Typography, Divider, Tag, Input, Radio, Modal, Space} from "antd";
import { EnvironmentOutlined, EditOutlined, TagOutlined } from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {OrderApi} from "../../service/order/order.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {IAddress} from "@/service/address/getListAddressByUser.ts";
import {toast} from "react-toastify";
import AddAddressModal from "../../components/address/address-modal.tsx";

const { Title, Text } = Typography;

const CheckoutPage = () => {
    // State cho địa chỉ, phương thức thanh toán và sản phẩm
    const navigate=useNavigate();
    const dispatch=useDispatch()
    const {address, addressDefault}=useSelector((state:RootState)=>state.address)
    const [addressReseve,setAddressReseve]=useState<IAddress|undefined|null>(null);
    const [selectedAddress, setSelectedAddress] = useState('1'); // ID địa chỉ mặc định
    const [isReload, setIsReload] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    useEffect(() => {
        setAddressReseve(addressDefault)
    }, [addressDefault]);
    const location = useLocation();
    const [products,setProducts]=useState([]);
    const { listOrder } = location.state || {listOrder:[]};
    useEffect(() => {
        setProducts(listOrder)
    }, [listOrder]);

    // useEffect(() => {
    //     const createOrder=async()=>{
    //         try{
    //             const response = await OrderApi.create()
    //         }catch(e){
    //             console.log(e)
    //         }
    //     }
    // }, [products]);
    const [visible, setVisible] = useState(false); // State quản lý popup
    // const [address, setAddress] = useState(
    //     "Số Nhà 59, Ngõ 147 Đường Vũ Tông Phan, Phường Khương Trung, Quận Thanh Xuân, Hà Nội"
    // );
    const [paymentMethod, setPaymentMethod] = useState("VNPay");

    // Danh sách phương thức thanh toán
    const paymentMethods = [
        // "Ví ShopeePay",
        // "Thẻ Tín dụng/Ghi nợ",
        // "Google Pay",
        // "Thẻ nội địa Napas",
        {
            method:"VNPay",
            active:true
        },
        {
            method:"Thanh toán khi nhận hàng",
            active:false
        }

    ];

    // Sản phẩm và phí
    // const products = [
    //     {
    //         id: 1,
    //         name: "Chuột Gaming Máy Tính FREE WOLF V5 PRO",
    //         price: 109000,
    //         quantity: 1,
    //         image: "https://via.placeholder.com/100",
    //     },
    //     {
    //         id: 1,
    //         name: "Chuột Gaming Máy Tính FREE WOLF V5 PRO",
    //         price: 109000,
    //         quantity: 1,
    //         image: "https://via.placeholder.com/100",
    //     },
    //     {
    //         id: 1,
    //         name: "Chuột Gaming Máy Tính FREE WOLF V5 PRO",
    //         price: 109000,
    //         quantity: 1,
    //         image: "https://via.placeholder.com/100",
    //     }, {
    //         id: 1,
    //         name: "Chuột Gaming Máy Tính FREE WOLF V5 PRO",
    //         price: 109000,
    //         quantity: 1,
    //         image: "https://via.placeholder.com/100",
    //     },
    //
    //
    // ];

    const shippingFee = 16500;
    const voucherDiscount = 5000;

    // Tính tổng tiền
    const totalProductPrice = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );
    const total = totalProductPrice + shippingFee - voucherDiscount;
    // Mở popup
    const showAddressModal = () => setVisible(true);

    // Xác nhận địa chỉ
    const handleAddressConfirm = () => {
        setVisible(false);
        console.log('Địa chỉ được chọn:', selectedAddress);
    };
    const handleOrder =async ()=>{
        try{
            if(!addressReseve){
                toast.error("Vui lòng nhập địa chỉ")
                return;
            }
            const body={
                user_name:addressReseve?.consignee,
                phone:addressReseve?.phone,
                address_name:`${addressReseve?.direction}, ${addressReseve?.street}`,
                products:listOrder
            }
           const rsp = OrderApi.create(body);
            toast.success("Bạn đã đặt hàng thành công, vui lòng thanh toán trong vòng 2 ngay")
            navigate("/orders/")
        }catch(e){
            console.log(e)
            toast.error("Đặt hàng thất bại vui lòng thử lại!")
        }

    }
    const totalSaleAmount=(csq)=>{
        let totalSold=0;
        if(csq && Array.isArray(csq)){
            totalSold = csq.reduce((sum, item) => {
                if (item.sale) {
                    return sum + item.sale;
                }
                return sum;
            }, 0);
            // if (totalSold > 1000) {
            //     totalSold = (totalSold / 1000).toFixed(1); // Chuyển thành "K" nếu lớn hơn 1000
            // }
        }
        return totalSold
    }
    const handleAddNewAddress=()=>{
        setIsModalVisible(true);
        setIsCreate(true)
    }
    return (
        <Card style={{maxWidth: 900, margin: "20px auto"}} bordered>
            {/* Địa chỉ nhận hàng */}
            <Row align="middle" justify="space-between" style={{marginBottom: 20}}>
                <Col>
                    <Title level={4}>
                        <EnvironmentOutlined style={{marginRight: 10}}/>
                        Địa Chỉ Nhận Hàng
                    </Title>
                    <Text strong>{addressReseve?.consignee} {addressReseve?.phone}</Text>
                    <br/>
                    <Text>{addressReseve?.direction}, {addressReseve?.street}</Text>
                </Col>
                <Col>
                    <Button type="link" icon={<EditOutlined/>} onClick={showAddressModal} style={{outline:"none"}}>
                        Thay Đổi
                    </Button>
                </Col>
            </Row>

            <Modal
                title="Địa Chỉ Của Tôi"
                visible={visible}
                onOk={handleAddressConfirm}
                onCancel={() => setVisible(false)}
                okText="Xác nhận"
                cancelText="Huỷ"
            >
                <Radio.Group
                    onChange={(e) => setAddressReseve(prev=>address.find(item=>item.id === e.target.value))
                        // setSelectedAddress(e.target.value)4
                }
                    value={addressReseve?.id}
                    style={{width: '100%'}}
                >
                    <Space direction="vertical" style={{width: '100%'}}>
                        {address.map((item) => (
                            <div key={item.id}
                                 style={{padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px'}}>
                                <Radio value={item.id}>
                                    <Text strong>{item.consignee}</Text> <br/>
                                    <Text>{item.phone}</Text> <br/>
                                    <Text type="secondary">{item.street}, {item.direction}</Text>
                                </Radio>
                            </div>
                        ))}
                    </Space>
                </Radio.Group>
                <Button
                    type="dashed"
                    block
                    onClick={handleAddNewAddress} // Hàm xử lý khi bấm nút
                    style={{
                        marginTop: '10px',
                        padding: '10px',
                        borderRadius: '5px',
                        width: 'auto',
                        outline: 'none', // Bỏ viền khi nhấn vào
                        boxShadow: 'none',
                    }}
                >
                    + Thêm Địa Chỉ Mới
                </Button>
            </Modal>
            <AddAddressModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                addressDataProp={null}
                setIsReload={setIsReload}
                isCreate={true}
            />
            <Divider/>

            {/* Danh sách sản phẩm */}
            {products.map((product) => (
                <Row key={product.id} gutter={[16, 16]} align="middle">
                    <Col span={4}>
                        <img
                            src={product.image}
                            alt={product.title}
                            style={{width: "100%", borderRadius: 4}}
                        />
                    </Col>
                    <Col span={16}>
                        <Title level={5}>{product.title}</Title>
                        <Text>Loại: {product?.color}-{product?.size}</Text>
                    </Col>
                    <Col span={4} style={{textAlign: "right"}}>
                        <Text strong>₫{(product.price).toLocaleString()} x {product.quantity}</Text>
                    </Col>
                </Row>
            ))}

            {/* Voucher */}
            <Row justify="space-between" align="middle" style={{margin: "20px 0"}}>
                <Col>
                    <TagOutlined style={{marginRight: 8}}/>
                    <Text strong>Voucher của Shop</Text>
                </Col>
                <Col>
                    <Text style={{color: "red"}}>-₫{totalSaleAmount(products)}</Text>
                </Col>
            </Row>

            <Divider/>

            {/* Phương thức thanh toán */}
            <Row justify="space-between" style={{marginBottom: 20}}>
                <Col>
                    <Title level={4}>Phương thức thanh toán</Title>
                </Col>
                {/*<Col>*/}
                {/*    <Button type="link" icon={<EditOutlined/>}>*/}
                {/*        Thay Đổi*/}
                {/*    </Button>*/}
                {/*</Col>*/}

            </Row>
            <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{marginBottom: 20}}
            >
                {paymentMethods.map((item) => (
                    <Radio key={item.method} value={item.method} style={{display: "block"}} disabled={!item.active}>
                        {item.method}
                    </Radio>
                ))}

            </Radio.Group>
            <Row>
                <span style={{fontSize:"12px", color:"#ccc000"}}>* Hệ thống tạm tời khóa chức năng thanh toán khi nhận hàng</span>
            </Row>
            <Divider/>

            {/* Tổng thanh toán */}
            <Row justify="end">
                <Col span={8}>
                    <Row justify="space-between">
                        <Text>Tổng tiền hàng:</Text>
                        <Text strong>₫{totalProductPrice.toLocaleString()}</Text>
                    </Row>
                    {/*<Row justify="space-between">*/}
                    {/*    <Text>Phí vận chuyển:</Text>*/}
                    {/*    <Text strong>₫{shippingFee.toLocaleString()}</Text>*/}
                    {/*</Row>*/}
                    <Row justify="space-between">
                        <Text>Voucher giảm giá:</Text>
                        <Text strong>-₫{totalSaleAmount(products)?.toLocaleString()}</Text>
                    </Row>
                    <Divider/>
                    <Row justify="space-between">
                        <Title  style={{color: "red"}}>
                            {/*₫{(totalProductPrice - totalSaleAmount(products)).toLocaleString()}*/}
                        </Title>
                        <Title level={4}>Tổng thanh toán:</Title>
                        <Title level={4} style={{color: "red"}}>
                            ₫{(totalProductPrice - totalSaleAmount(products)).toLocaleString()}
                        </Title>
                    </Row>
                </Col>
            </Row>

            {/* Nút đặt hàng */}
            <Button
                type="primary"
                size="large"
                block
                style={{backgroundColor: "#f53d2d", borderColor: "#f53d2d"}}
                onClick={handleOrder}
            >
                Đặt Hàng
            </Button>
        </Card>
    );
};

export default CheckoutPage;
