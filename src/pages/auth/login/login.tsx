import {Button, Form, FormProps, Input} from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

// import axios from "axios";
// import { toast } from "react-toastify";
// import { LocalStorageService } from "../../service/localStorage";
import login, {ILoginForm} from '../../../service/auth/useLogin.ts';
import {toast} from 'react-toastify';
import {LocalStorageService} from '@/service/localStorage.ts';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setRole} from '@/store/user-slice.ts';
import {setAccount} from "../../../store/user-slice.ts";
import {setAuth} from "../../../store/auth-slice.ts";
import {path} from "../../../common/constants/path.ts";
import {useState} from "react";
import {ERole} from "../../../common/models/User.ts";
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [loading,setLoading]=useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation(['auth', 'validation']);
    type FieldType = {
        username: string;
        password: string;
        // remember?: string;
        // email?: string;
        // confirm_password?: string;
    };

    const [formLogin] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: ILoginForm) => {
        console.log('Success:', values);
        setLoading(true);
        try {
            const response = await login({
                username: values.username,
                password: values.password,
            });
            //     await axios.post(
            //   "https://dev.mys.tinasoft.com.vn/api/v1/auth/login",
            //   {
            //     username: values.username,
            //     password: values.password,
            //   }
            // );
            console.log(response.data.data);
            if (response.data.isSuccess) {
                // Lưu token và account vào state/localStorage
                const data = response.data.data;
                const account = data?.account || null;
                const roleName = account?.role?.name || null;
                const token = data?.token || null;

                // Lưu token vào localStorage (chỉ lưu token string, không phải toàn bộ object)
                if (token) {
                    LocalStorageService.setLocalStorage('accessToken', token);
                }
                dispatch(setAccount(account));

                toast.success(t('auth:login.loginSuccess'));
                // Cập nhật role & auth state an toàn
                dispatch(setRole(roleName));
                dispatch(setAuth({
                    isLoggedIn: true,
                    token: token,
                    msg: "co token"
                }))
                setTimeout(() => {
                    setLoading(false); // Set loading false sau khi dispatch
                    console.log("admin", { admin: roleName === ERole.ADMIN });

                    // Kiểm tra vai trò và điều hướng
                    if (roleName === ERole.ADMIN) {
                        navigate(path.ADMIN_PRODUCT_LIST);
                    } else {
                        navigate("/");
                    }
                }, 0);
                // router.push("/dashboard");
            } else {
                setLoading(false)
                toast.error(response.data.message);
            }
            // const user = LocalStorageService.getLocalStorage("user");
            // console.log("user: ", user);
            // const token = LocalStorageService.getLocalStorage("accessToken");
            // console.log("acesstoken: ", token);
            // const userEmail = LocalStorageService.getLocalStorage("userEmail");
            // console.log("userEmail:", userEmail);
            // const userFullName = LocalStorageService.getLocalStorage("userFullName");
            // console.log("userFullName:", userFullName);
        } catch (error: unknown) {
            console.log(error);
            setLoading(false);
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(message || t('auth:login.loginFailed'));
        }
        // formLogin.resetFields();
    };

    const onFinishFailed = (
        errorInfo: ValidateErrorEntity<FieldType>
    ) => {
        // toast.error("Đăng nhập thất bại");
        console.log('Vui lòng nhập đủ dữ liệu:', errorInfo);
    };

    const handleForgotPasswordClick = () => {
        navigate(path.AUTH+"/"+path.FORGOT_PASSWORD)

    };

    const handleRegisterClick = () => {
        navigate(path.AUTH+"/"+path.REGISTER)
    };


    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-[#0f172a]">{t('auth:login.title')}</h2>
                <p className="text-lg text-[#475569] mt-3">
                    {t('auth:login.subtitle')}
                </p>
            </div>

            <Form
                name="basic"
                form={formLogin}
                layout="vertical"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                size="large"
            >
                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">{t('auth:login.username')}</span>}
                    name="username"
                    rules={[
                        { required: true, message: t('validation:usernameRequired') },
                    ]}
                    className="mb-6"
                >
                    <Input
                        placeholder={t('auth:login.username')}
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-lg font-semibold text-[#0f172a]">{t('auth:login.password')}</span>}
                    name="password"
                    rules={[
                        { required: true, message: t('validation:passwordRequired') },
                    ]}
                    className="mb-5"
                >
                    <Input.Password
                        placeholder={t('auth:login.password')}
                        className="py-3 text-lg"
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                </Form.Item>

                <div className="flex items-center justify-end mb-5 text-lg font-medium">
                    <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-[#f97316] hover:text-[#ea580c] transition"
                    >
                        {t('auth:login.forgotPassword')}
                    </button>
                </div>

                <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="mt-2 inline-flex h-16 w-full items-center justify-center rounded-lg bg-[#f97316] text-lg font-semibold text-white shadow-md transition hover:bg-[#ea580c]"
                >
                    {t('auth:login.submitButton')}
                </Button>

                <div className="flex justify-center mt-7 text-lg text-[#475569]">
                    <span>{t('auth:login.noAccount')}</span>
                    <button
                        type="button"
                        onClick={handleRegisterClick}
                        className="ml-2 font-semibold text-[#f97316] hover:text-[#ea580c] transition bg-transparent border-none outline-none p-0"
                    >
                        {t('auth:login.registerNow')}
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default Login;
