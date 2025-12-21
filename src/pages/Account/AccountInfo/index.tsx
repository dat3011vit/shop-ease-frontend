import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuUser2 } from "react-icons/lu";
import { FaCamera } from 'react-icons/fa';
import "./index.scss";
import {Button, Form, Input, Upload} from "antd";
import {RootState} from "../../../store";
import changeEmail from "../../../service/auth/changeEmail.ts";
import {toast} from "react-toastify";
import changeInfo, {IChangeInfoForm} from "../../../service/user/changeInfo.ts";
import {imageUpload} from "@/service/image/image.ts";
import changeAvatar from "@/service/user/changeAvatar.ts";
import { useTranslation } from 'react-i18next';
const AccountInfo = () => {
    const { t } = useTranslation('account');
    const {account}=useSelector((state:RootState)=>state.user)
    console.log({account2:account})
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatar,setAvatar]=useState<string|null>(null)
    const currentData = null;
    const payload = {
        phone:12345456667,
        avatar:null,
    };
    const onFinish = async (values:IChangeInfoForm) => {
        setLoading(true);
        console.log("Submitted values: ", values);
        // Thêm logic xử lý mật khẩu cũ và đổi mật khẩu tại đây (API call)
        try {
            await changeInfo({
                phone: values.phone,
                full_name:values.full_name
            })
            toast.success(t('updateSuccess'))
            setLoading(false);
        }catch (e){
            console.log(e)
            toast.error(t('updateFailed'))
            setLoading(false);
        }

    };
    useEffect(()=>{
        console.log("uuuuuu")
        form1.setFieldsValue({
            username: account?.username
        });
        form2.setFieldsValue({
            email: account?.email,phone:account?.user?.phone,full_name:account?.user?.full_name
        });
        setAvatar(account?.user?.avt||null)
    },[account])
    const handleImageChange =async (file:File)=>{
        try {
            const urlrsp=await imageUpload(file)
            if(urlrsp){
                const updateAvt= await changeAvatar({urlAvatar:urlrsp})
                if(updateAvt?.data?.isSuccess){
                    setAvatar(urlrsp);
                    toast.success(t('updateAvatarSuccess'))
                }
                else {
                    toast.error(t('updateAvatarFailed'))
                }
            }
            else{
                toast.error(t('updateAvatarFailed'))
            }

        }catch (e) {
            // if(e?.data?.)
            console.log(e)
            toast.error(t('updateAvatarFailed'))
        }

    }
    return (
        <div className="account-info-modern">
            <div className="account-info-modern__header">
                <h1 className="account-info-modern__title">{t('editProfile')}</h1>
                <p className="account-info-modern__subtitle">{t('updateInfoMessage')}</p>
            </div>

            <div className="account-info-modern__content">
                <div className="account-info-modern__form-section">
                    <Form
                        form={form1}
                        layout="vertical"
                        initialValues={{ username: account?.username }}
                        className="account-info-modern__form"
                    >
                        <Form.Item
                            label={<span className="form-label-modern">{t('memberId')}</span>}
                            name="username"
                        >
                            <Input
                                disabled={true}
                                className="form-input-modern"
                                style={{ height: '44px', fontSize: '15px' }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span className="form-label-modern">{t('username')}</span>}
                            name="username"
                        >
                            <Input
                                disabled={true}
                                className="form-input-modern"
                                style={{ height: '44px', fontSize: '15px' }}
                            />
                        </Form.Item>
                    </Form>

                    <Form
                        form={form2}
                        layout="vertical"
                        initialValues={{ email: account?.email, phone: account?.user?.phone, full_name: account?.user?.full_name }}
                        onFinish={onFinish}
                        className="account-info-modern__form"
                    >
                        <Form.Item
                            label={<span className="form-label-modern">{t('phone')} <span className="text-[#f97316]">*</span></span>}
                            name="phone"
                            rules={[{required: true, message: t('phoneRequired')}]}
                        >
                            <Input
                                className="form-input-modern"
                                disabled={loading}
                                style={{ height: '44px', fontSize: '15px' }}
                                placeholder={t('enterPhone')}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span className="form-label-modern">{t('displayName')} <span className="text-[#f97316]">*</span></span>}
                            name="full_name"
                            rules={[{required: true, message: t('displayNameRequired')}]}
                        >
                            <Input
                                className="form-input-modern"
                                disabled={loading}
                                style={{ height: '44px', fontSize: '15px' }}
                                placeholder={t('enterDisplayName')}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="account-info-modern__submit-btn"
                                style={{
                                    width: "100%",
                                    height: '44px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    backgroundColor: "#f97316",
                                    borderColor: "#f97316",
                                    borderRadius: '10px',
                                }}
                            >
                                {t('updateInfo')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <div className="account-info-modern__avatar-section">
                    <div className="account-info-modern__avatar-card">
                        <h2 className="account-info-modern__avatar-title">Ảnh đại diện</h2>
                        <Form form={form3} className="account-info-modern__avatar-form">
                            <Form.Item name="coverImage">
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={(file) => {
                                        handleImageChange(file);
                                        return false;
                                    }}
                                >
                                    <div className="account-info-modern__avatar-upload">
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt="Ảnh đại diện"
                                                className="account-info-modern__avatar-image"
                                            />
                                        ) : (
                                            <div className="account-info-modern__avatar-placeholder">
                                                <LuUser2 size={48} />
                                            </div>
                                        )}
                                        <div className="account-info-modern__avatar-overlay">
                                            <FaCamera size={20} />
                                            <span>Thay đổi ảnh</span>
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AccountInfo;
