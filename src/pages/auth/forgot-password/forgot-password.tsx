import {Button, Form, FormProps, Input} from "antd";
import {useState} from "react";

import ReCAPTCHA from "react-google-recaptcha";
import {toast} from "react-toastify";
import forgotPassord, {IForgotForm} from "../../../service/auth/useForgot.ts";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {path} from "../../../common/constants/path.ts";

export default function ForgotPassword() {
    const navigate = useNavigate();
    type FieldType = {
        email: string;
        capcha: string;
    };

    const [formForgot] = Form.useForm();

    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    console.log(captchaValue)
    const onCaptchaChange = (value: string | null) => {
        console.log("Captcha value:", value);
        setCaptchaValue(value);
    };
    const onFinish: FormProps<FieldType>['onFinish'] = async (values: IForgotForm) => {
        console.log('Success:', values);
        try {
            const response = await forgotPassord({
                email: values.email,
            });

            console.log(response.data);
            if (response.data.isSuccess) {


                toast.success('Gửi mail thành công vui lòng kiểm tra mail !');

                navigate(path.AUTH);

                // router.push("/dashboard");
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Đ có lỗi xảy ra');
        }
        // formLogin.resetFields();
    };
    const handleBackClick = () => {
        navigate(path.AUTH)
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        // toast.error("Đăng nhập thất bại");
        console.log('Vui lòng nhập đủ dữ liệu:', errorInfo);
    };
    return (
        <div className="w-full max-w-xl mx-auto">
            <button
                type="button"
                onClick={handleBackClick}
                className="mb-7 inline-flex items-center text-lg font-medium text-[#f97316] hover:text-[#ea580c] transition"
            >
                <FiArrowLeft className="mr-2 text-xl" />
                Quay lại đăng nhập
            </button>

            <div className="text-center mb-9">
                <h2 className="text-4xl font-bold text-[#0f172a]">Quên mật khẩu</h2>
                <p className="text-lg text-[#475569] mt-3">
                    Nhập email để nhận liên kết đặt lại mật khẩu an toàn
                </p>
            </div>

            <Form
                name="forgot_password"
                form={formForgot}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                size="large"
            >
                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">Email</span>}
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                    ]}
                    className="mb-6"
                >
                    <Input
                        placeholder="Nhập email"
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>
                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">Xác nhận bảo mật</span>}
                    name="capcha"
                    rules={[
                        { required: true, message: "Vui lòng xác nhận!" }
                    ]}
                    className="mb-5"
                >
                    <ReCAPTCHA
                        sitekey="6Le9pYUpAAAAAMvcugPnE59Kxj5wnzZf3mNw4bfH"
                        onChange={onCaptchaChange}
                        type="image"
                    />
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="mt-2 inline-flex h-16 w-full items-center justify-center rounded-lg bg-[#f97316] text-lg font-semibold text-white shadow-md transition hover:bg-[#ea580c]"
                >
                    Gửi yêu cầu
                </Button>
            </Form>
        </div>
    );
}
