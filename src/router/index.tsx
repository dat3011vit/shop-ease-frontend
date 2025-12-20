import {Suspense, lazy} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {path} from '@/common/constants/path';
import {Loading} from '@/components/ui';
import Collection from '../pages/collection';
import Account from "../pages/Account";
import AccountInfo from "../pages/Account/AccountInfo";
import AccountAddress from "../pages/Account/account-address";
import ProductDetail from "../components/products/product-detail";
import ChangePassword from "../pages/Account/change-password";
import Orders from "../pages/orders";
import ChangeEmail from "../pages/Account/change-email";
import Login from "../pages/auth/login/login.tsx";
import Register from "../pages/auth/register/register.tsx";
import ForgotPassword from "../pages/auth/forgot-password/forgot-password.tsx";
import UserListBan from "../pages/admin/user-list-ban.tsx";
import Cart from "../pages/cart/cart.tsx";
import {ERole} from "../common/models/User.ts";
import NotFound from "@/pages/not-found";
import ProductByType from "../pages/product/product-by-type.tsx";
import Review from "../pages/review/review.tsx";
import InvoiceManagement from "../pages/admin/InvoiceManagement.tsx";
import InvoiceUser from "../pages/InvoiceUser.tsx";

const Auth = lazy(() => import("@/pages/auth/auth"));
const Checkout = lazy(() => import("@/pages/checkout"));
const MainLayout = lazy(() => import("@/layouts/main-layout"));
const ProtectedRoute = lazy(() => import("@/router/protected-route"));
const UserList = lazy(() => import("@/pages/admin/user-list"));
const Home = lazy(() => import('@/pages/home/home'));
const AdminProductList = lazy(() => import("@/pages/admin/product-list"));
const AddProduct = lazy(() => import("@/pages/admin/add-product"));
const EditProduct = lazy(() => import("@/pages/admin/edit-product"));
const ProductAttributes = lazy(() => import("@/pages/admin/product-attributes"));
const OrderManagement = lazy(() => import("@/pages/admin/order-management"));
const Statistics = lazy(() => import("@/pages/admin/statistics"));


const Router = () => {
    return (
        <Suspense fallback={<Loading/>}>
            <BrowserRouter>
                <Routes>
                    <Route path={path.AUTH} element={<Auth/>}>
                        <Route path={""} element={<Login/>}/>
                        <Route path={path.LOGIN} element={<Login/>}/>
                        <Route path={path.REGISTER} element={<Register/>}/>
                        <Route path={path.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                    </Route>



                    <Route path={path.INDEX} element={<MainLayout/>}>
                        <Route path={path.PRODUCT_DETAIL} element={<ProductDetail/>}/>
                        <Route path={path.INDEX} element={<Home/>}/>
                        <Route path={path.SEARCH} element={<Collection/>}/>
                        <Route path={path.PRODUCT} element={<ProductByType/>}/>
                        <Route element={<ProtectedRoute isCheck={[ERole.ADMIN]}/>}>
                            <Route path={path.USER_LIST} element={<UserList/>}/>
                            <Route path={path.USER_LIST_BAN} element={<UserListBan/>}/>
                            <Route path={path.ADMIN_PRODUCT_LIST} element={<AdminProductList/>}/>
                            <Route path={path.PRODUCT_ATTRIBUTES} element={<ProductAttributes/>}/>
                            <Route path={path.ADD_PRODUCT} element={<AddProduct/>}/>
                            <Route path={path.EDIT_PRODUCT} element={<EditProduct/>}/>
                            <Route path={path.ORDER_MANAGEMENT} element={<OrderManagement/>}/>
                            <Route path={path.STATISTICS} element={<Statistics/>}/>
                            <Route path={path.INVOCE_MANAGEMENT} element={<InvoiceManagement/>}/>
                        </Route>
                        <Route element={<ProtectedRoute isCheck={[ERole.ADMIN, ERole.CUSTOMER]}/>}>
                            <Route path={path.CHECKOUT} element={<Checkout/>}/>
                            <Route path={path.CART} element={<Cart/>}/>
                            <Route path={path.ORDERS} element={<Orders/>}/>
                            <Route path={path.REVIEW} element={<Review/>}/>
                            <Route path={path.INVOCE_USER} element={<InvoiceUser/>}/>

                        </Route>
                        <Route
                            path={path.ACCOUNT}
                            element={<Account/>}
                        >
                            <Route
                                path={path.ACCOUNT_INFO}
                                element={<AccountInfo/>}
                            />
                            <Route
                                path={''}
                                element={<AccountInfo/>}
                            />
                            <Route
                                path={path.ACCOUNT_ADDRESS}
                                element={<AccountAddress/>}
                            />

                            <Route
                                path={path.CHANGE_PASS}
                                element={<ChangePassword/>}
                            />
                            <Route
                                path={path.CHANGE_MAIL}
                                element={<ChangeEmail/>}
                            />
                            {/*<Route*/}
                            {/*    path={path.WISHLIST}*/}
                            {/*    element={<AccountWishlist />}*/}
                            {/*/>*/}
                            {/*<Route*/}
                            {/*    path={path.ACCOUNT_ORDER}*/}
                            {/*    element={<AccountOrder />}*/}
                            {/*/>*/}
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

export default Router;
