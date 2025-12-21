import React, { useState } from "react";
import {Form, Input, Button, Card, message} from "antd";
import changePassword from "../../../service/auth/changePassword.ts";
import {toast} from "react-toastify";
import { useTranslation } from 'react-i18next';
import "../AccountInfo/index.scss";

const ChangePassword = () => {
    const { t } = useTranslation('account');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        console.log("Submitted values: ", values);
        // Thêm logic xử lý mật khẩu cũ và đổi mật khẩu tại đây (API call)
        try {
            const response =await  changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            })
            toast.success(t('updateSuccess'))
            setLoading(false);
        }catch (e){
            console.log(e)
            toast.error(t('updateFailed'))
            setLoading(false);
        }

    };

    return (
        <div className="account-form-modern">
            <div className="account-form-modern__header">
                <h1 className="account-form-modern__title">{t('changePassword')}</h1>
                <p className="account-form-modern__subtitle">
                    {t('passwordSecurityMessage')}
                </p>
            </div>
            <div className="account-form-modern__card">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="account-form-modern__form"
                >
                    <Form.Item
                        name="oldPassword"
                        label={<span className="form-label-modern">{t('oldPassword')} <span className="text-[#f97316]">*</span></span>}
                        rules={[
                            { required: true, message: t('oldPasswordRequired') },
                        ]}
                    >
                        <Input.Password
                            placeholder={t('enterOldPassword')}
                            className="form-input-modern"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '15px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label={<span className="form-label-modern">{t('newPassword')} <span className="text-[#f97316]">*</span></span>}
                        rules={[
                            { required: true, message: t('newPasswordRequired') },
                            { min: 6, message: t('passwordMinLength') },
                        ]}
                    >
                        <Input.Password
                            placeholder={t('enterNewPassword')}
                            className="form-input-modern"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '15px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label={<span className="form-label-modern">{t('confirmPassword')} <span className="text-[#f97316]">*</span></span>}
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: t('confirmPasswordRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('passwordNotMatch')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder={t('enterConfirmPassword')}
                            className="form-input-modern"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '15px' }}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="account-form-modern__submit-btn"
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
                            {t('confirm')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ChangePassword;
