import './index.scss';
import {Link} from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
// import { TUser } from "../../../types/auth-type";
import { useDispatch } from 'react-redux';
// import { logoutUser } from "../../../store/user-slice";
// import { resetCart } from "../../../store/cart-slice";
import { toast } from 'react-toastify';
import { memo } from 'react';
import DefaultAvatar from '../../../assets/images/default_avt.webp';
import { path } from '../../../common/constants/path.ts';
import { IAccount } from '@/common/models/User.ts';
import { setRole } from '@/store/user-slice.ts';
import {logout} from "../../../store/auth-slice.ts";
import logoutAccount from "../../../service/auth/useLogout.ts";
import {setAccount} from "../../../store/user-slice.ts";
interface PopupUserProps {
    // user: IUser;
    account:IAccount|null
    // TUser |null;
}

const PopupUserComponent = ({
    // user = { id: 1, username: 'Nguyen', email: 'nguyen@gmail.com', isActive: true, cart: null },
    account,

}: PopupUserProps) => {
    // const navigate =useNavigate();
    const dispatch = useDispatch();
    const handleLogout =  () => {
        // nho xoa dong nay
        // navigate("/")
        void logoutAccount();// ko quan tam logout thanh cong hay ko ( void se ko quan tam no tra ve la promise hay ko)
        dispatch(setRole(null));
        dispatch(logout())
        dispatch(setAccount(null))

        toast.success('Logout successfully');
    };

    return (
        <div className="user-dropdown">
            <div className="user-dropdown__profile">
                <div className="user-dropdown__avatar">
                    <img
                        src={!account?.user?.avt || account?.user?.avt === '' ? DefaultAvatar : account?.user?.avt}
                        alt={account?.username || 'User'}
                        loading="lazy"
                    />
                    <span className="user-dropdown__badge"></span>
                </div>
                <div className="user-dropdown__details">
                    <div className="user-dropdown__name">{account?.username || 'Guest'}</div>
                    <div className="user-dropdown__email">{account?.email || ''}</div>
                </div>
            </div>
            
            <div className="user-dropdown__separator"></div>
            
            <div className="user-dropdown__menu">
                <Link to={path.ACCOUNT} className="user-dropdown__item">
                    <Icon icon="solar:user-bold-duotone" className="user-dropdown__icon" />
                    <span>Tài khoản của tôi</span>
                    <Icon icon="solar:alt-arrow-right-linear" className="user-dropdown__arrow" />
                </Link>
                
                <button 
                    className="user-dropdown__item user-dropdown__item--logout" 
                    onClick={handleLogout}
                >
                    <Icon icon="solar:logout-2-bold-duotone" className="user-dropdown__icon" />
                    <span>Đăng xuất</span>
                    <Icon icon="solar:alt-arrow-right-linear" className="user-dropdown__arrow" />
                </button>
            </div>
        </div>
    );
};

export const PopupUser = memo(PopupUserComponent);
