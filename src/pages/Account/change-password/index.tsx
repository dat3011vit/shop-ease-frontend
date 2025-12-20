import React, { useState } from "react";
import {Form, Input, Button, Card, message} from "antd";
import changePassword from "../../../service/auth/changePassword.ts";
import {toast} from "react-toastify";
import "../AccountInfo/index.scss";

const ChangePassword = () => {
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
            toast.success("Cập nhật thành công")
            setLoading(false);
        }catch (e){
            console.log(e)
            toast.error("Có lỗi xảy ra")
            setLoading(false);
        }

    };

    return (
        <div className="account-form-modern">
            <div className="account-form-modern__header">
                <h1 className="account-form-modern__title">Đổi mật khẩu</h1>
                <p className="account-form-modern__subtitle">
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
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
                        label={<span className="form-label-modern">Mật khẩu cũ <span className="text-[#f97316]">*</span></span>}
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu cũ"
                            className="form-input-modern"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '15px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label={<span className="form-label-modern">Mật khẩu mới <span className="text-[#f97316]">*</span></span>}
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            className="form-input-modern"
                            disabled={loading}
                            style={{ height: '44px', fontSize: '15px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label={<span className="form-label-modern">Xác nhận mật khẩu <span className="text-[#f97316]">*</span></span>}
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập lại mật khẩu mới"
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
                            Xác Nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ChangePassword;
