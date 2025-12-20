import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-loading-skeleton/dist/skeleton.css';
import Router from '@/router';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";
import {useEffect, useState} from "react";
import getCurrent from "./service/user/useCurrentUser.ts";
import {setAuth} from "./store/auth-slice.ts";
import {fetchUser, setAccount, setRole, setUser} from "./store/user-slice.ts";
import {Loading} from "./components/ui";
import {fetchCategory, fetchColor, fetchSeason, fetchSize} from "@/store/attribute-slice.ts";
import {ERole} from "./common/models/User.ts";
import {path} from "./common/constants/path.ts";
import {useNavigate} from "react-router-dom";
import {fetchListAddress} from "./store/address-slice.ts";
import { ConfigProvider } from 'antd';
function App() {
    // Trạng thái để theo dõi lần đầu chạy
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn } = useSelector((state:RootState) => state.auth);
    const { account } = useSelector((state:RootState) => state.user);
    useEffect(() => {
        dispatch(fetchSize())
        dispatch(fetchCategory())
        dispatch(fetchSeason())
        dispatch(fetchColor())
    }, []);
    useEffect(() => {
        const timeOut = setTimeout(async () => {
            if(isLoggedIn){
                // try{
                //     const response = await getCurrent();
                //     console.log(response.data.data);
                //     if (response.data.isSuccess) {
                //         // Lưu token vào localStorage
                //         dispatch(setAccount(response?.data?.data||null))
                //         dispatch(setUser(response?.data?.data?.user||null))
                //
                //         dispatch(setRole(response?.data?.data?.role.name||null));
                //         // dispatch(setAuth({
                //         //     isLoggedIn:true,
                //         //     token:response.data?.data?response.data.data.token:null,
                //         //     msg:"co token"
                //         // }))
                //
                //
                //     } else {
                //         toast.error(response.data.message);
                //     }
                // }catch (e: any){
                //     dispatch(setAuth({
                //         isLoggedIn:false,
                //         msg:'',
                //         token:null
                //     }))
                // }

                // newwwww
                const resultAction = await dispatch(fetchUser());
                console.log("nha",resultAction)
                console.log("nha5",fetchUser.fulfilled)
                if (fetchUser.fulfilled.match(resultAction) && resultAction?.payload) {
                    console.log("nha 3",resultAction?.payload)
                    // check lai cai nay
                    dispatch(setAuth({
                        isLoggedIn: true,
                        token: resultAction.payload?.data ? resultAction.payload?.data?.token : null,
                        msg: "co token"
                    }));
                    // Xử lý thành công
                    // if (!resultAction.payload?.isSuccess) {
                    //     dispatch(setAuth({
                    //         isLoggedIn: false,
                    //         msg: '',
                    //         token: null
                    //     }));
                    //     toast.error(resultAction.payload.message || "Unable to fetch user data");
                    // }
                } else {
                    console.log("nha",2)

                    // Nếu có lỗi hoặc rejected
                    dispatch(setAuth({
                        isLoggedIn: false,
                        msg: '',
                        token: null
                    }));
                }

                // newwww
                // Đánh dấu hoàn thành việc khởi tạo

            }
            setIsInitialized(true);

        }, 1000);
        return () => {
            clearTimeout(timeOut);
        };
    }, [isLoggedIn]);
    useEffect(() => {
        if(account?.user?.id){
            dispatch(fetchListAddress(account?.user?.id))
        }
    }, [account?.user?.id]);
    if (!isInitialized) {
        return <Loading/>; // lần đầu load thì ko cho hiển thị giao diện
    }
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#f99137',
                    colorSuccess: '#f59e0b',
                    colorWarning: '#fbbf24',
                    colorError: '#ef4747',
                    colorInfo: '#e08f53',
                    colorLink: '#f99137',
                    colorBgContainer: '#ffffff',
                    colorBorder: '#e5e7eb',
                    borderRadius: 8,
                    fontSize: 16,
                },
                components: {
                    Button: {
                        colorPrimary: '#f99137',
                        algorithm: true,
                    },
                    Input: {
                        colorPrimary: '#f99137',
                        colorBorder: '#e5e7eb',
                    },
                    Table: {
                        colorPrimary: '#f99137',
                        headerBg: '#faf5ff',
                    },
                    Modal: {
                        colorPrimary: '#f99137',
                    },
                    Select: {
                        colorPrimary: '#f99137',
                    },
                    Pagination: {
                        colorPrimary: '#f99137',
                    },
                },
            }}
        >
            <div>
                <Router />
                <ToastContainer />
            </div>
        </ConfigProvider>
    );
}

export default App;
