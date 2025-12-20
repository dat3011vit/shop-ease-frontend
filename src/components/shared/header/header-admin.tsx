import { path } from "@/common/constants/path";
import { Icon } from "@iconify/react/dist/iconify.js";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/logo.svg";
// import useModal from "../../../hooks/useModal";
// import { RootState } from "../../../store";
import useModal from "@/hooks/useModal";
import { RootState } from "@/store";
import { Container } from "../../shared";
import { Button, Modal, Popup, Dropdown } from "../../ui";
import './index.scss'
import { HeaderMobile } from "@/components/shared/header/HeaderMobile.tsx";
import { ProductSearch } from "@/components/products";
import { usePopup } from "../../../hooks/usePopup.ts";
import { PopupCart } from "./PopupCart.tsx";
import { PopupUser } from "./PopupUser.tsx";


const HeaderComponent = () => {
  const [isSticky, setSticky] = useState(false);
  // const { totalQuantity, cart } = useSelector(
  //   (state: RootState) => state?.cart
  // );
  const totalQuantity = 10;
  const { user } = useSelector((state: RootState) => state?.user);
  //   const cartIds = cart?.map((cartItem) => cartItem.product_id) || [];
  //   const quantities = cart?.map((cartItem) => cartItem.quantity) || [];
  //   const { data: products } = useProduct.useGetProductsByIds(cartIds);
  //   const { data: categories } = useCategory.useGetCategoryTree();

  const { openModal, handleCloseModal, handleOpenModal, id } = useModal();
  const userPopup = usePopup();
  const cartPopup = usePopup();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const isSticky = offset > 60;
      setSticky(isSticky);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOpenUserPopup = () => {
    if (user) {
      navigate(path.LOGIN);
    } else {
      userPopup.togglePopup();
    }
  };
  //   const generateCategoryUrl = (categoryId: string) => {
  //     const newUrl = `${path.PRODUCT_COLLECTION}?category_id=${categoryId}`;
  //     return newUrl;
  //   };

  return (
    <>
      <header className={`header ${isSticky ? "scrolled" : ""}`}>
        {id === "mobile-modal" ? (
          <Modal
            type="left"
            onClose={handleCloseModal}
            open={openModal}
          >
            <HeaderMobile onClose={handleCloseModal} />
          </Modal>
        ) : (
          <Modal
            type="center"
            onClose={handleCloseModal}
            open={openModal}
          >
            <ProductSearch onClose={handleCloseModal} />
          </Modal>
        )}
        <Container>
          <div className="header__container">
            <div className="header__button-mobile">
              <Button
                onClick={() => handleOpenModal("mobile-modal", null)}
                className="header__control--item"
              >
                <Icon icon={"ion:menu"} />
              </Button>
            </div>
            <div className="header__logo">
              <Link to={path.INDEX}>
                <img loading="lazy" src={Logo} alt="Logo" decoding="async" />
              </Link>
            </div>
            <div className="header__navbar">
              <span>
                Quản lý sản phẩm
                <Dropdown
                  data={[
                    { label: 'Danh sách sản phẩm', url:'/product-list' },
                    { label: 'Thêm sản phẩm', url: '/add-product' },
                    { label: 'Quản lý thuộc tính', url: '/product-attributes' },
                  ]}
                  generateUrl={(url) => url} // Hoặc bạn có thể thêm logic tạo URL của riêng bạn
                />
              </span>
              <Link to={path.USER_LIST}>Quản lý người dùng</Link>
              {/* <Link to={path.PRODUCT_ATTRIBUTES}>Quản lý thuộc tính sản phẩm</Link> */}
              <Link to={path.ORDER_MANAGEMENT}>Quản lý đơn hàng</Link>
              <Link to={path.STATISTICS}>Thống kê</Link>
            </div>
            <div className="header__control">
              <span
                ref={userPopup.triggerRef}
                onClick={handleOpenUserPopup}
                className="header__control--item"
              >
                <Icon icon="mage:user" />
                <Popup ref={userPopup.popupRef}>
                  <PopupUser
                  // user={user}
                  />
                </Popup>
              </span>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export const HeaderAdmin = memo(HeaderComponent);
