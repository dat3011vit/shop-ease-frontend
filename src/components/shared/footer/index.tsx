import { Link } from "react-router-dom";

// import { path } from "../../../utils/constant";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Container } from "..";
import Logo from "../../../assets/images/logo-orange.png";

import "./index.scss";
import { path } from "@/common/constants/path";
export const Footer = () => {
  return (
    <footer className="footer-modern">
      <Container>
        <div className="footer-modern__content">
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">Bắt đầu</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>Trang chủ</Link></li>
              <li><Link to={path.AUTH}>Đăng nhập</Link></li>
              <li><Link to={path.REGISTER}>Đăng ký</Link></li>
              <li><Link to={path.CART}>Giỏ hàng</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">Khám phá</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>Sản phẩm</Link></li>
              <li><Link to={path.INDEX}>Danh mục</Link></li>
              <li><Link to={path.ORDERS}>Đơn hàng</Link></li>
              <li><Link to={path.WISHLIST}>Yêu thích</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">Hỗ trợ</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>Câu hỏi thường gặp</Link></li>
              <li><Link to={path.INDEX}>Chính sách bảo mật</Link></li>
              <li><Link to={path.INDEX}>Điều khoản sử dụng</Link></li>
              <li><Link to={path.INDEX}>Liên hệ</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">Cộng đồng</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>Tin tức</Link></li>
              <li><Link to={path.INDEX}>Blog</Link></li>
              <li><Link to={path.INDEX}>Tuyển dụng</Link></li>
              <li><Link to={path.INDEX}>Về chúng tôi</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section footer-modern__section--social">
            <div className="footer-modern__logo">
              <Link to={path.INDEX}>
                <img src={Logo} decoding="async" alt="logo" loading="lazy" />
              </Link>
            </div>
            <p className="footer-modern__description">
              Mua sắm trực tuyến với chất lượng tốt nhất
            </p>
            <div className="footer-modern__social">
              <Link 
                to={"https://www.facebook.com/profile.php?id=61569844931705"}
                className="footer-modern__social-link"
                target="_blank"
              >
                <Icon icon={"logos:facebook"} style={{ fontSize: '24px' }} />
              </Link>
              <Link 
                to={path.INDEX}
                className="footer-modern__social-link"
                target="_blank"
              >
                <Icon icon={"logos:twitter"} style={{ fontSize: '24px' }} />
              </Link>
              <Link 
                to={"https://www.youtube.com/@komaiptit5792"}
                className="footer-modern__social-link"
                target="_blank"
              >
                <Icon icon="openmoji:youtube" style={{ fontSize: '24px' }} />
              </Link>
              <Link 
                to={"https://t.me/+84963045750"}
                className="footer-modern__social-link"
                target="_blank"
              >
                <Icon icon="logos:telegram" style={{ fontSize: '24px' }} />
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-modern__bottom">
          <p className="footer-modern__copyright">
            © 2025 ORANGE FASHION. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </Container>
    </footer>
  );
};
