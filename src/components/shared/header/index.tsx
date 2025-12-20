import { path } from '@/common/constants/path';
import { Icon } from '@iconify/react/dist/iconify.js';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import Logo from '../../../assets/images/logo-orange.png';
// import useModal from "../../../hooks/useModal";
// import { RootState } from "../../../store";
import useModal from '@/hooks/useModal';
import { RootState } from '@/store';
import { Container } from '../../shared';
import { Button, Modal, Popup, Dropdown } from '../../ui';
import './index.scss';
import { HeaderMobile } from '@/components/shared/header/HeaderMobile.tsx';
import { ProductSearch } from '@/components/products';
import { usePopup } from '../../../hooks/usePopup.ts';
import { PopupCart } from './PopupCart.tsx';
import { PopupUser } from './PopupUser.tsx';
import PopupNotification from './PopupNotification';
import { ERole } from '@/common/models/User.ts';
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

const HeaderComponent = () => {
    const [isSticky, setSticky] = useState(false);
    // const { totalQuantity, cart } = useSelector(
    //   (state: RootState) => state?.cart
    // );
    const totalQuantity = 10;
    const {  cartItems }= useSelector((state:RootState)=>state.cart)
    const { user, role, account } = useSelector((state: RootState) => state?.user);
    const { categories, seasons } = useSelector((state: RootState) => state?.attribute);
    console.log({ acccc: account })

    //   const cartIds = cart?.map((cartItem) => cartItem.product_id) || [];
    //   const quantities = cart?.map((cartItem) => cartItem.quantity) || [];
    //   const { data: products } = useProduct.useGetProductsByIds(cartIds);
    //   const { data: categories } = useCategory.useGetCategoryTree();

    const { openModal, handleCloseModal, handleOpenModal, id } = useModal();
    const userPopup = usePopup();
    const cartPopup = usePopup();
    const notificationPopup = usePopup();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSearchActive, setIsSearchActive] = useState(false);

    const handleToggleSearch = () => {
        setIsSearchActive((prev) => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            const isSticky = offset > 60;
            setSticky(isSticky);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleOpenUserPopup = () => {
        if (!account) {
            navigate(path.AUTH);
        } else {
            userPopup.togglePopup();
        }
    };

    const handleOpenNotificationPopup = () => {
        // if (!account) {
        //     navigate(path.AUTH);
        // } else {
            notificationPopup.togglePopup();
        // }
        setIsNoti(false)
    };
    //   const generateCategoryUrl = (categoryId: string) => {
    //     const newUrl = `${path.PRODUCT_COLLECTION}?category_id=${categoryId}`;
    //     return newUrl;
    //   };
    console.log({ account });
    const [searchValue, setSearchValue] = useState('');
    const searchData=async(value)=>{
        navigate(`/search?key=${value}`)
    }
    const handleSearch = () => {
        if (searchValue.trim() !== '') {
            searchData(searchValue.trim())
            // Thực hiện hành động tìm kiếm, ví dụ gửi API hoặc chuyển hướng
        }
    };

    const handleKeyDown = (e:KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const [isNoti,setIsNoti]=useState(false)
    return (
        <header className={`header-modern ${isSticky ? 'scrolled' : ''}`}>
            {id === 'mobile-modal' ? (
                <Modal type="left" onClose={handleCloseModal} open={openModal}>
                    <HeaderMobile onClose={handleCloseModal} />
                </Modal>
            ) : (
                <Modal type="center" onClose={handleCloseModal} open={openModal}>
                    <ProductSearch onClose={handleCloseModal} />
                </Modal>
            )}
            <Container>
                <div className="header-modern__container">
                    <div className="header-modern__button-mobile">
                        <Button
                            onClick={() => handleOpenModal('mobile-modal', null)}
                            className="header-modern__control--item"
                        >
                            <Icon icon={'ion:menu'} />
                        </Button>
                    </div>
                    {role !== ERole.ADMIN ? (
                        <>
                            <div className="header-modern__logo">
                                <Link to={path.INDEX}>
                                    <img loading="lazy" src={Logo} alt="Logo" decoding="async" />
                                </Link>
                            </div>
                            <div className="header-modern__navbar">
                                <NavLink to={path.INDEX} className="nav-link-modern">Trang chủ</NavLink>
                                <span className="nav-link-modern">
                                    Danh mục
                                    <Dropdown
                                        data={
                                            categories?.map(item => ({
                                                label: item.name,
                                                url: path.CATEGORY + item.id
                                            }))
                                        }
                                        generateUrl={(url) => url}
                                    />
                                </span>
                                <span className="nav-link-modern">
                                    Mùa
                                    <Dropdown
                                        data={
                                            seasons?.map(item => ({
                                                label: item.name,
                                                url: path.SEASON + item.id
                                            }))
                                        }
                                        generateUrl={(url) => url}
                                    />
                                </span>
                                <NavLink to={path.ORDERS} className="nav-link-modern">Đơn hàng</NavLink>
                            </div>
                            <div className="header-modern__control">
                                {/* Ô input tìm kiếm */}
                                <div
                                    className={`search-container-modern ${isSearchActive ? 'expanded' : 'collapsed'}`}
                                >
                                    <Input
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="search-input-modern"
                                        style={{width: isSearchActive ? '300px' : '50px', height: '44px', borderRadius: '22px'}}
                                        prefix={
                                                <SearchOutlined
                                                    onClick={() => setIsSearchActive((prev) => !prev)}
                                                    className="search-icon-modern"
                                                    style={{ cursor: 'pointer', color: '#f97316', fontSize: '16px' }}
                                                    />
                                        }
                                    />
                                </div>

                                {/* Desktop */}
                                <div className="header-modern__control--cart-popup">
                                    <span
                                        className="header-modern__control--item"
                                        onClick={() => navigate(path.CART)}
                                    >
                                        <Icon icon={'solar:cart-large-minimalistic-outline'} style={{ fontSize: '24px' }}/>
                                        <div className="hide">
                                            <Popup ref={cartPopup.popupRef}>
                                                <PopupCart/>
                                            </Popup>
                                        </div>
                                        {cartItems?.length > 0 && <span className="cart-quantity-modern">{cartItems?.length}</span>}
                                    </span>
                                </div>

                                {/* Mobile */}
                                <div className="header-modern__control--cart-link">
                                    <Link to={path.CART} className="header-modern__control--item">
                                        <Icon icon={'solar:cart-large-minimalistic-outline'} style={{ fontSize: '24px' }}/>
                                        <span className="cart-quantity-modern">{totalQuantity ? totalQuantity : 0}</span>
                                    </Link>
                                </div>

                                <span
                                    ref={notificationPopup.triggerRef}
                                    onClick={handleOpenNotificationPopup}
                                    className="header-modern__control--item"
                                >
                                    <Icon icon={'mdi:bell-outline'} style={{ fontSize: '24px' }}/>
                                    <div className="">
                                        <Popup ref={notificationPopup.popupRef}>
                                            <PopupNotification setIsNoti={setIsNoti}/>
                                        </Popup>
                                    </div>
                                    {isNoti && <span className="cart-quantity-modern"></span>}
                                </span>

                                <span
                                    ref={userPopup.triggerRef}
                                    onClick={handleOpenUserPopup}
                                    className="header-modern__control--item"
                                >
                                    <Icon icon="mage:user" style={{ fontSize: '24px' }}/>
                                    <Popup ref={userPopup.popupRef}>
                                        <PopupUser account={account} />
                                    </Popup>
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="header-modern__logo">
                                <Link to={path.INDEX}>
                                    <img loading="lazy" src={Logo} alt="Logo" decoding="async"/>
                                </Link>
                            </div>
                            <div className="header-modern__navbar">
                                <span className="nav-link-modern">
                                    Quản lý sản phẩm
                                    <Dropdown
                                        data={[
                                            {label: 'Danh sách sản phẩm', url: '/product-list'},
                                            {label: 'Thêm sản phẩm', url: '/add-product'},
                                            {label: 'Quản lý thuộc tính', url: '/product-attributes'},
                                        ]}
                                        generateUrl={(url) => url}
                                    />
                                </span>
                                <span className="nav-link-modern">
                                    Quản lý người dùng
                                    <Dropdown
                                        data={[
                                            {label: 'Danh sách người dùng đang bị cấm', url: path.USER_LIST_BAN},
                                            {label: 'Danh sách người dùng hoạt động', url: path.USER_LIST},
                                        ]}
                                        generateUrl={(url) => url}
                                    />
                                </span>
                                <NavLink to={path.ORDER_MANAGEMENT} className="nav-link-modern">Quản lý đơn hàng</NavLink>
                                <NavLink to={path.INVOCE_MANAGEMENT} className="nav-link-modern">Quản lý hóa đơn</NavLink>
                                <NavLink to={path.STATISTICS} className="nav-link-modern">Thống kê</NavLink>
                            </div>
                            <div className="header-modern__control">
                                <span
                                    ref={notificationPopup.triggerRef}
                                    onClick={handleOpenNotificationPopup}
                                    className="header-modern__control--item"
                                >
                                    <Icon icon={'mdi:bell-outline'} style={{ fontSize: '24px' }}/>
                                    <div className="hide">
                                        <Popup ref={notificationPopup.popupRef}>
                                            <PopupNotification setIsNoti={setIsNoti}/>
                                        </Popup>
                                    </div>
                                    {isNoti && <span className="cart-quantity-modern"></span>}
                                </span>

                                <span
                                    ref={userPopup.triggerRef}
                                    onClick={handleOpenUserPopup}
                                    className="header-modern__control--item"
                                >
                                    <Icon icon="mage:user" style={{ fontSize: '24px' }}/>
                                    <Popup ref={userPopup.popupRef}>
                                        <PopupUser account={account} />
                                    </Popup>
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </header>
    );
};

export const Header = memo(HeaderComponent);
