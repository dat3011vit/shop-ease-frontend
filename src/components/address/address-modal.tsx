import React, {useState, useRef, useEffect} from 'react';
import {Button, Modal, Form, Input, Tabs, List, Checkbox, Radio, Space, message} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd'
import {addressData} from "../../utils/dataLocation.ts";
import createAddress from "../../service/address/address.ts";
import {IAddress} from "../../service/address/getListAddressByUser.ts";
import {useDispatch, useSelector} from "react-redux";
import {fetchListAddress} from "@/store/address-slice.ts";
import {RootState} from "@/store";

const { TabPane } = Tabs;

const AddAddressModal = ({addressDataProp,isModalVisible, setIsModalVisible,setIsReload,isCreate}:{
    addressDataProp:IAddress|null;
    isModalVisible:boolean;
    setIsReload:React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isCreate:boolean;
}) => {
    const dispatch=useDispatch()
    const {account}=useSelector((state:RootState)=>state.user)

    const [form] = Form.useForm();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Tham chiếu đến dropdown
    const [addressDataId,setAddressDataId] = useState<{
        city_id: string;
        district_id: string;
        ward_id: string;
    }>({
        city_id:addressDataProp?.city_code|| '',
        district_id: addressDataProp?.district_code||'',
        ward_id: addressDataProp?.ward_code||'',
    });
    const [selectedAddress,setSelectedAddress ] = useState({
        province: addressDataProp?.city_code?addressData?.find(item=>item.code ===parseInt(addressDataProp?.city_code))?.name:'',
        district: (addressDataProp?.city_code && addressDataProp?.district_code)?addressData?.find(item=>item.code ===parseInt(addressDataProp?.city_code))?.districts?.find(itemDis=>itemDis?.code===parseInt(addressDataProp.district_code))?.name:"",
        ward: (addressDataProp?.city_code && addressDataProp?.district_code && addressDataProp?.ward_code)?addressData?.find(item=>item.code ===parseInt(addressDataProp?.city_code))?.districts?.find(itemDis=>itemDis?.code===parseInt(addressDataProp.district_code))?.wards?.find(item=>item.code ===parseInt(addressDataProp?.ward_code))?.name:"",
    });
    console.log({addressDataProp})
    useEffect(() => {
        setAddressDataId({
            city_id:addressDataProp?.city_code|| '',
            district_id: addressDataProp?.district_code||'',
            ward_id: addressDataProp?.ward_code||'',
        })
        setSelectedAddress({
            province: addressDataProp?.city_code?addressData?.find(item=>item.code ===parseInt(addressDataProp?.city_code))?.name:'',
            district: (addressDataProp?.city_code && addressDataProp?.district_code)?addressData?.find(item=>item.code ===parseInt(addressDataProp?.city_code))?.districts?.find(itemDis=>itemDis?.code===parseInt(addressDataProp.district_code))?.name:"",
            ward: (addressDataProp?.city_code && addressDataProp?.district_code && addressDataProp?.ward_code)?addressData?.find(item=>item.code ===parseInt(addressDataProp?.city_code))?.districts?.find(itemDis=>itemDis?.code===parseInt(addressDataProp.district_code))?.wards?.find(item=>item.code ===parseInt(addressDataProp?.ward_code))?.name:"",
        })
        form.setFieldsValue({
            phone:addressDataProp?.phone??'',
            fullName:addressDataProp?.consignee??'',
            detailedAddress:addressDataProp?.street??''
        });
    }, [addressDataProp]);
    const [activeTab, setActiveTab] = useState('province'); // Quản lý tab hiện tại
    const { Item } = List;

    // Tạo ref cho ô input
    const inputRef = useRef<InputRef>(null);

    // const showModal = () => {
    //     setIsModalVisible(true);
    // };

    const handleOk = async () => {
        form
            .validateFields()
            .then(async (values) => {
                console.log({values})
                try {
                     await createAddress({
                        id:addressDataProp?.id ?? "0",
                        city_id: addressDataId.city_id,
                        district_id: addressDataId.district_id,
                        ward_id: addressDataId.ward_id,
                        street: values.detailedAddress,
                        consignee: values.fullName,
                        phone:values.phone
                    })
                    // axios.post('URL_API_CỦA_BẠN', {
                    //     fullName: values.fullName,
                    //     phone: values.phone,
                    //     region: `${selectedAddress.province}, ${selectedAddress.district}, ${selectedAddress.ward}`,
                    //     detailedAddress: values.detailedAddress,
                    //     addressType: values.addressType,
                    //     setDefault: values.setDefault,
                    // });
                    setIsReload(true)

                    if (isCreate) {
                        dispatch(fetchListAddress(account?.user?.id))
                        message.success(`Tạo địa chỉ mới thành công`);
                    } else {
                        message.success(`Cập nhât địa chỉ mới thành công`);
                    }
                    setIsModalVisible(false);
                    // form.resetFields();
                } catch (error) {
                    console.log("er", error); // Thất bại
                }
            })
            .catch(() => {
                // console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };


    const handleSelectProvince = (value: string,code:number) => {
        setSelectedAddress((prev) => ({
            ...prev,
            province: value,
            district: '', // Reset district and ward when province changes
            ward: '',
        }));
        setAddressDataId((prev) => ({
            ...prev,
            city_id: code+"",
            district_id: '', // Reset district and ward when province changes
            ward_id: '',
        }));
        form.setFieldsValue({
            region: `${value}`.trim(),
        });
        setActiveTab('district');
    };

    const handleSelectDistrict = (value: string,code:number) => {
        setSelectedAddress((prev) => ({
            ...prev,
            district: value,
            ward: '', // Reset ward when district changes
        }));
        setAddressDataId((prev) => ({
            ...prev,
            district_id: code+"", // Reset district and ward when province changes
            ward_id: '',
        }));
        form.setFieldsValue({
            region: `${selectedAddress.province}, ${value}`.trim(),
        });
        setActiveTab('ward');
    };

    const handleSelectWard = (value: string,code:number) => {
        setSelectedAddress((prev) => ({
            ...prev,
            ward: value,
        }));
        setAddressDataId((prev) => ({
            ...prev,
            ward_id: code+"",
        }));
        form.setFieldsValue({
            region: `${selectedAddress.province}, ${selectedAddress.district}, ${value}`.trim(),
        });
        setDropdownVisible(false); // Đóng Dropdown sau khi chọn xã/phường
    };
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && inputRef.current && inputRef.current.input && !dropdownRef.current.contains(event.target  as Node) && !inputRef.current.input.contains(event.target as Node)) {
            // contains(event.target as Node)
            setDropdownVisible(false); // Đóng dropdown khi click ra ngoài
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside); // Gỡ bỏ event listener khi component unmount
        };
    }, []);

    // const AddressDropdown = () => (
    //     <div
    //         style={{
    //             backgroundColor: 'white',
    //             width: '100%', // Take the full width of the input
    //             padding: '10px',
    //             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    //             borderRadius: '4px',
    //             position:'absolute',
    //             top:'0',
    //             zIndex:'99999'
    //         }}
    //     >
    //         <Tabs activeKey={activeTab} style={{ width: '100%' }}>
    //             <TabPane tab="Tỉnh/Thành phố" key="province">
    //                 <List
    //                     bordered
    //                     dataSource={['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương', 'Bà Rịa - Vũng Tàu']}
    //                     renderItem={(item) => (
    //                         <Item onClick={() => handleSelectProvince(item)} style={{
    //                             cursor: 'pointer',
    //                             backgroundColor: item === selectedAddress.province ? '#e6f7ff' : 'transparent', // Highlight khi item được chọn
    //                             fontWeight: item === selectedAddress.province ? 'bold' : 'normal', }}>
    //                             {item}
    //                         </Item>
    //                     )}
    //                     style={{ maxHeight: 160, overflowY: 'auto' }} // Scrollable list
    //                 />
    //             </TabPane>
    //             <TabPane tab="Quận/Huyện" key="district">
    //                 <List
    //                     bordered
    //                     dataSource={['Quận 1', 'Quận 2', 'Quận 3', 'Bình Thạnh', 'Tân Bình']}
    //                     renderItem={(item) => (
    //                         <Item onClick={() => handleSelectDistrict(item)}style={{
    //                             cursor: 'pointer',
    //                             backgroundColor: item === selectedAddress.province ? '#e6f7ff' : 'transparent', // Highlight khi item được chọn
    //                             fontWeight: item === selectedAddress.province ? 'bold' : 'normal', }}>
    //                             {item}
    //                         </Item>
    //                     )}
    //                     style={{ maxHeight: 160, overflowY: 'auto' }} // Scrollable list
    //                 />
    //             </TabPane>
    //             <TabPane tab="Phường/Xã" key="ward">
    //                 <List
    //                     bordered
    //                     dataSource={['Phường 1', 'Phường 2', 'Phường 3', 'Tân Định', 'Bến Nghé']}
    //                     renderItem={(item) => (
    //                         <Item onClick={() => handleSelectWard(item)} style={{
    //                             cursor: 'pointer',
    //                             backgroundColor: item === selectedAddress.province ? '#e6f7ff' : 'transparent', // Highlight khi item được chọn
    //                             fontWeight: item === selectedAddress.province ? 'bold' : 'normal', }}>
    //                             {item}
    //                         </Item>
    //                     )}
    //                     style={{ maxHeight: 160, overflowY: 'auto' }} // Scrollable list
    //                 />
    //             </TabPane>
    //         </Tabs>
    //     </div>
    // );


    return (
        <div>
            {/*<Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>*/}
            {/*    + Thêm địa chỉ mới*/}
            {/*</Button>*/}
            <Modal
                title={isCreate?"Địa chỉ mới":"Cập nhật địa chỉ"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={500} // Đặt chiều rộng cố định cho Modal
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        addressType: 'home',
                        phone:addressDataProp?.phone??'',
                        fullName:addressDataProp?.consignee??'',
                        detailedAddress:addressDataProp?.street??''
                    }}
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input placeholder="Họ và tên" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>

                    {/* Address Selector with Dropdown */}
                    <Form.Item
                        name="region"
                        label="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                        rules={[
                            // { required: true, message: 'Vui lòng nhập địa chỉ!' },
                            {
                                validator: () => {
                                    if (!selectedAddress.province) {
                                        return Promise.reject(new Error('Vui lòng chọn Tỉnh/Thành phố!'));
                                    }
                                    if (!selectedAddress.district) {
                                        return Promise.reject(new Error('Vui lòng chọn Quận/Huyện!'));
                                    }
                                    if (!selectedAddress.ward) {
                                        return Promise.reject(new Error('Vui lòng chọn Phường/Xã!'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                        className={"relative"}
                    >
                        <Input
                            ref={inputRef}
                            readOnly
                            name="region"
                            placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                            value={`${selectedAddress.province}${selectedAddress.district?', '+selectedAddress.district:''}${selectedAddress.ward?', '+selectedAddress.ward:''}`.trim()}
                            suffix={<DownOutlined />}
                            onClick={() => setDropdownVisible(true)}
                            style={{ width: '100%' }} // Đảm bảo Input chiếm đủ chiều rộng
                        />
                        <div className={'relative w-full'}>
                            {/*<AddressDropdown/>*/}
                            {
                                dropdownVisible &&
                                <div
                                    ref={dropdownRef}
                                    style={{
                                        backgroundColor: 'white',
                                        width: '100%', // Take the full width of the input
                                        padding: '10px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                        borderRadius: '4px',
                                        position: 'absolute',
                                        top: '0',
                                        zIndex: '99999'
                                    }}
                                >
                                    <Tabs activeKey={activeTab} onChange={setActiveTab} style={{width: '100%'}}>
                                        <TabPane tab="Tỉnh/Thành phố" key="province">
                                            <List
                                                bordered
                                                dataSource={addressData}
                                                renderItem={(item) => (
                                                    <Item onClick={() => handleSelectProvince(item.name,item.code)} style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: item.name === selectedAddress.province ? '#e6f7ff' : 'transparent', // Highlight khi item được chọn
                                                        fontWeight: item.name === selectedAddress.province ? 'bold' : 'normal',
                                                    }}>
                                                        {item.name}
                                                    </Item>
                                                )}
                                                style={{maxHeight: 160, overflowY: 'auto'}} // Scrollable list
                                            />
                                        </TabPane>
                                        <TabPane tab="Quận/Huyện" key="district" disabled={!selectedAddress.province}>
                                            <List
                                                bordered
                                                dataSource={addressData.find(item=>item.name===selectedAddress.province)?.districts}
                                                renderItem={(item) => (
                                                    <Item onClick={() => handleSelectDistrict(item.name,item.code)} style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: item.name === selectedAddress.province ? '#e6f7ff' : 'transparent', // Highlight khi item được chọn
                                                        fontWeight: item.name === selectedAddress.province ? 'bold' : 'normal',
                                                    }}>
                                                        {item.name}
                                                    </Item>
                                                )}
                                                style={{maxHeight: 160, overflowY: 'auto'}} // Scrollable list
                                            />
                                        </TabPane>
                                        <TabPane tab="Phường/Xã" key="ward" disabled={!selectedAddress.district}>
                                            <List
                                                bordered
                                                dataSource={addressData.find(item=>item.name===selectedAddress.province)?.districts.find(item=>item.name===selectedAddress.district)?.wards}
                                                renderItem={(item) => (
                                                    <Item onClick={() => handleSelectWard(item.name,item.code)} style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: item.name === selectedAddress.province ? '#e6f7ff' : 'transparent', // Highlight khi item được chọn
                                                        fontWeight: item.name === selectedAddress.province ? 'bold' : 'normal',
                                                    }}>
                                                        {item.name}
                                                    </Item>
                                                )}
                                                style={{maxHeight: 160, overflowY: 'auto'}} // Scrollable list
                                            />
                                        </TabPane>
                                    </Tabs>
                                </div>
                            }

                        </div>

                    </Form.Item>

                    <Form.Item name="detailedAddress" label="Địa chỉ cụ thể" className={'relative'}>
                        <Input placeholder="Địa chỉ cụ thể"/>
                    </Form.Item>

                    {/*<Form.Item label=" ">*/}
                    {/*    <Button type="dashed" block>*/}
                    {/*        + Thêm vị trí*/}
                    {/*    </Button>*/}
                    {/*</Form.Item>*/}

                    {/*<Form.Item name="addressType" label="Loại địa chỉ">*/}
                    {/*    <Radio.Group>*/}
                    {/*        <Radio.Button value="home">Nhà Riêng</Radio.Button>*/}
                    {/*        <Radio.Button value="office">Văn Phòng</Radio.Button>*/}
                    {/*    </Radio.Group>*/}
                    {/*</Form.Item>*/}

                    {/*<Form.Item name="setDefault" valuePropName="checked">*/}
                    {/*    <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>*/}
                    {/*</Form.Item>*/}

                    <Form.Item style={{textAlign: 'right', marginTop: 16}}>
                        <Space>
                            <Button onClick={handleCancel}>Trở Lại</Button>
                            <Button type="primary" onClick={handleOk}>
                                Hoàn thành
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddAddressModal;
