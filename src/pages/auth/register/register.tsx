import register, {IRegisterForm} from "@/service/auth/useRegister";
import {Button, Form, FormProps, Input} from "antd";

import {toast} from "react-toastify";
import {FiArrowLeft} from "react-icons/fi";
import {path} from "../../../common/constants/path.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { useTranslation } from 'react-i18next';

// interface Props {
//     setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
//     setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
// }

export default function Register() {
    const [loading,setLoading]=useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation(['auth', 'validation']);
    type FieldType = {
        username: string;
        password: string;
        email: string;
        confirm_password?: string;
    };

    const [formRegister] = Form.useForm();

    //   const [isRegister, setIsRegister] = useState(false);

    //   const router = useRouter();

    //Finish register
    const onFinishRegister: FormProps<FieldType>["onFinish"] = async (
        values: IRegisterForm
    ) => {
        setLoading(true)
        console.log("Register Values:", values);
        if (values.password !== values.confirm_password) {
            toast.error(t('validation:passwordMismatch'));
            setLoading(false)
            return;
        }

        try {
            const response = await register({
                username: values.username,
                password: values.password,
                email: values.email,
            });
            console.log(response.data);
            if (response.data.isSuccess) {
                // Lưu token vào localStorage
                // localStorage.setItem("accesstoken", response.data.data.accessToken);
                toast.success(t('auth:register.registerSuccess'));
                // setIsRegister(false);
                // router.push("/login");
                navigate(path.AUTH + "/" +path.LOGIN)
            } else {
                toast.error(response.data.message);
            }
            setLoading(false)
        } catch (error: any) {
            if (error?.response?.data) {
                toast.error(error.response.data?.message);
            } else {
                toast.error(t('auth:register.registerFailed'));
            }
            setLoading(false)
        }
        formRegister.resetFields();
    };

    const onFinishRegisterFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        // toast.error("Đăng ký thất bại");
        console.log("Register Failed:", errorInfo);
    };

    const handleBackClick = () => {
        navigate(path.AUTH)
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <button
                type="button"
                onClick={handleBackClick}
                className="mb-7 inline-flex items-center text-lg font-medium text-[#f97316] hover:text-[#ea580c] transition"
            >
                <FiArrowLeft className="mr-2 text-xl" />
                {t('auth:register.backToLogin')}
            </button>

            <div className="text-center mb-9">
                <h2 className="text-4xl font-bold text-[#0f172a]">{t('auth:register.title')}</h2>
                <p className="text-lg text-[#475569] mt-3">
                    {t('auth:register.subtitle')}
                </p>
            </div>

            <Form
                name="register"
                form={formRegister}
                layout="vertical"
                autoComplete="off"
                onFinish={onFinishRegister}
                onFinishFailed={onFinishRegisterFailed}
                size="large"
            >
                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">{t('auth:register.username')}</span>}
                    name="username"
                    rules={[
                        { required: true, message: t('validation:usernameRequired') },
                    ]}
                    className="mb-6"
                >
                    <Input
                        placeholder={t('auth:register.usernamePlaceholder')}
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">{t('auth:register.email')}</span>}
                    name="email"
                    rules={[
                        { required: true, message: t('validation:emailRequired') },
                        { type: "email", message: t('validation:emailInvalid') },
                    ]}
                    className="mb-6"
                >
                    <Input
                        placeholder={t('auth:register.emailPlaceholder')}
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">{t('auth:register.password')}</span>}
                    name="password"
                    rules={[
                        { required: true, message: t('validation:passwordRequired') },
                        { min: 6, message: t('validation:passwordMinLength') },
                    ]}
                    className="mb-6"
                >
                    <Input.Password
                        placeholder={t('auth:register.passwordPlaceholder')}
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">{t('auth:register.confirmPassword')}</span>}
                    name="confirm_password"
                    rules={[
                        { required: true, message: t('validation:confirmPasswordRequired') },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('validation:passwordNotMatch')));
                            },
                        }),
                    ]}
                    className="mb-5"
                >
                    <Input.Password
                        placeholder={t('auth:register.confirmPasswordPlaceholder')}
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>

                <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="mt-2 inline-flex h-16 w-full items-center justify-center rounded-lg bg-[#f97316] text-lg font-semibold text-white shadow-md transition hover:bg-[#ea580c]"
                >
                    {t('auth:register.submitButton')}
                </Button>

                <div className="flex justify-center mt-7 text-lg text-[#475569]">
                    <span>{t('auth:register.haveAccount')}</span>
                    <button
                        type="button"
                        onClick={handleBackClick}
                        className="ml-2 font-semibold text-[#f97316] hover:text-[#ea580c] transition bg-transparent border-none outline-none p-0"
                    >
                        {t('auth:register.loginNow')}
                    </button>
                </div>
            </Form>
        </div>
    );
}
