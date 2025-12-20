import {useEffect, useState} from "react";
import {Form, Input, Button, Card} from "antd";
import {toast} from "react-toastify";
import changeEmail, {IChangeEmailForm} from "../../../service/auth/changeEmail.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import "../AccountInfo/index.scss";

const ChangeEmail = () => {
    const {account}=useSelector((state:RootState)=>state.user)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        form.setFieldsValue({
            oldEmail: account?.email
        });
    },[account])
    const onFinish = async (values:IChangeEmailForm) => {
        setLoading(true);
        console.log("Submitted values: ", values);
        // Thêm logic xử lý mật khẩu cũ và đổi mật khẩu tại đây (API call)
        try {
            await  changeEmail({
                newEmail: values.newEmail,
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
                <h1 className="account-form-modern__title">Đổi email</h1>
                <p className="account-form-modern__subtitle">
                    Cập nhật email của bạn
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
                        name="oldEmail"
                        label={<span className="form-label-modern">Email cũ</span>}
                    >
                        <Input
                            placeholder=""
                            disabled={true}
                            className="form-input-modern"
                            style={{ height: '44px', fontSize: '15px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="newEmail"
                        label={<span className="form-label-modern">Email mới <span className="text-[#f97316]">*</span></span>}
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input
                            placeholder="Nhập email mới"
                            disabled={loading}
                            className="form-input-modern"
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

export default ChangeEmail;
