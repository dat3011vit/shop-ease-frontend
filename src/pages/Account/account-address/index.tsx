import React, {useEffect, useState} from 'react';
import {Button, Card, List, Typography, Space, message} from 'antd';
import AddAddressModal from "../../../components/address/address-modal.tsx";
import getListAddressByUser, {IAddress} from "@/service/address/getListAddressByUser.ts";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import deleteAddress from "../../../service/address/deleteAddress.ts";
import defaultAddress from "../../../service/address/defaultAddress.ts";

const {Text, Title} = Typography;

const addresses = [
    {
        name: 'Đinh Nguyễn',
        phone: '(+84) 963 045 750',
        address: 'Số Nhà 59, Ngõ 147 Đường Vũ Tông Phan, Phường Khương Trung, Quận Thanh Xuân, Hà Nội',
        default: true,
    },
    {
        name: 'Hồng Quyên',
        phone: '(+84) 325 325 916',
        address: 'Số nhà 02, ngõ 04, đường Nguyễn Khuyến, Văn Quán, Hà Đông, Hà Nội',
    },
    {
        name: 'Ánh Huyền',
        phone: '(+84) 971 759 682',
        address: 'Xóm 14, Xã Khánh Công, Huyện Yên Khánh, Ninh Bình',
    },
    {
        name: 'Kiều Linh',
        phone: '(+84) 965 009 251',
        address: 'Xóm 4, Xã Khánh Hồng, Huyện Yên Khánh, Ninh Bình',
        warning: 'Số điện thoại hoặc địa chỉ nhận hàng chưa chính xác. Vui lòng kiểm tra và cập nhật.',
    },
    {
        name: 'Mai Mai',
        phone: '(+84) 374 966 651',
        address: '132 Nguyễn Văn Trỗi, Phường Mộ Lao, Quận Hà Đông, Hà Nội',
    },
];

const AccountAddress = () => {
    const {user}= useSelector((state:RootState)=>state.user)
    const [addressData,setAddressData]=useState<IAddress|null>(null);
    const [addresses,setAddresses]=useState<IAddress[]>([])
    const [isReload, setIsReload] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    useEffect(() => {
        if (user?.id) {
            (async ()=> {
                try{
                    const response = await getListAddressByUser(user.id);
                    if (response.data.isSuccess && response?.data?.data) {
                        setAddresses(response?.data?.data)
                    }
                }
                catch (e){
                    console.log("error"+e)
                }
            })()
        }
    }, [user?.id]);
    useEffect(() => {
        if (user?.id && isReload) {
            (async ()=> {
                try{
                    const response = await getListAddressByUser(user.id);
                    if (response.data.isSuccess && response?.data?.data) {
                        setAddresses(response?.data?.data)
                        setIsReload(false)
                    }
                }
                catch (e){
                    console.log("error"+e)
                }
            })()
        }
    }, [isReload]);

    console.log({userid:user})

    const handleSetDefault = async(id: string) => {
        try {
            await defaultAddress(id)
            setIsReload(true)
            message.success(`Địa chỉ đã được đặt làm mặc định`);
        }catch (e){
            message.success(`Thất bại`);
        }
    };

    const handleUpdate = (item: IAddress) => {
        setAddressData(item)
        setIsModalVisible(true)
        setIsReload(true)
        setIsCreate(false)

    };

    const handleDelete =async (id: string) => {
        try{
            const ressponse = await deleteAddress(id);
            setIsReload(true)
            message.warning(`Đã xóa ${id}`);
        }
        catch (e){
            console.log(e)
        }

    };


    const showModal = () => {
        setIsModalVisible(true);
        setAddressData(null)
        setIsCreate(true)
    };

    return (
        <Card title="Địa chỉ của tôi" extra={
            <Space>
                <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                    + Thêm địa chỉ mới
                </Button>
                <AddAddressModal
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    addressDataProp={addressData}
                    setIsReload={setIsReload}
                    isCreate={isCreate}
                />
            </Space>
            // <AddAddressModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} addressDataProp={addressData}/>
        }>
        {/*<Title level={4}>Địa chỉ của tôi</Title>*/}
        {/*    <Button type="primary" style={{marginBottom: 16}}>*/}
        {/*        + Thêm địa chỉ mới*/}
        {/*    </Button>*/}

            <List
                itemLayout="horizontal"
                dataSource={addresses}
                renderItem={(item: IAddress) => (
                        <List.Item className={'gap-24'}>
                            <List.Item.Meta
                                title={
                                    <Space>
                                        <Text strong>{item.consignee}</Text>
                                        <Text type="secondary">{item.phone}</Text>
                                    </Space>
                                }
                                description={
                                    <>
                                        <Text>{item.direction}</Text>
                                        {item.default && (
                                            <div>
                                                <Text type="danger" style={{
                                                    border: '1px solid red',
                                                    padding: '2px 4px'
                                                }}>
                                                    Mặc định
                                                </Text>
                                            </div>
                                        )}
                                        {/*{item.warning && (*/}
                                        {/*    <div style={{  marginTop: 8}}>*/}
                                        {/*        <Text type="warning" style={{backgroundColor: '#fffbe6',padding: '8px 16px'}}>{item.warning}</Text>*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </>
                                }
                            />
                            <Space style={{marginTop: 8}} direction="vertical">
                                <Space>
                                    <Button type="link" onClick={() => handleUpdate(item)}>
                                        Cập nhật
                                    </Button>
                                    <Button type="link" danger onClick={() => handleDelete(item.id)}>
                                        Xóa
                                    </Button>
                                </Space>

                                {!item.default && (

                                    <Button onClick={() => handleSetDefault(item.id)} className={'block'} style={{ width: 'auto' }}>
                                        Thiết lập mặc định
                                    </Button>
                                )}
                            </Space>
                        </List.Item>
                )}
            />
        </Card>
    );
};

export default AccountAddress;