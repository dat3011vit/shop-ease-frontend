import { Link } from "react-router-dom";

// import { path } from "../../../utils/constant";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Container } from "..";
import Logo from "../../../assets/images/logo-orange.png";

import "./index.scss";
import { path } from "@/common/constants/path";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation('footer');
  return (
    <footer className="footer-modern">
      <Container>
        <div className="footer-modern__content">
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">{t('getStarted.title')}</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>{t('getStarted.home')}</Link></li>
              <li><Link to={path.AUTH}>{t('getStarted.login')}</Link></li>
              <li><Link to={path.REGISTER}>{t('getStarted.register')}</Link></li>
              <li><Link to={path.CART}>{t('getStarted.cart')}</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">{t('explore.title')}</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>{t('explore.products')}</Link></li>
              <li><Link to={path.INDEX}>{t('explore.categories')}</Link></li>
              <li><Link to={path.ORDERS}>{t('explore.orders')}</Link></li>
              <li><Link to={path.WISHLIST}>{t('explore.wishlist')}</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">{t('support.title')}</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>{t('support.faq')}</Link></li>
              <li><Link to={path.INDEX}>{t('support.privacy')}</Link></li>
              <li><Link to={path.INDEX}>{t('support.terms')}</Link></li>
              <li><Link to={path.INDEX}>{t('support.contact')}</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section">
            <h3 className="footer-modern__title">{t('community.title')}</h3>
            <ul className="footer-modern__list">
              <li><Link to={path.INDEX}>{t('community.news')}</Link></li>
              <li><Link to={path.INDEX}>{t('community.blog')}</Link></li>
              <li><Link to={path.INDEX}>{t('community.careers')}</Link></li>
              <li><Link to={path.INDEX}>{t('community.about')}</Link></li>
            </ul>
          </div>
          <div className="footer-modern__section footer-modern__section--social">
            <div className="footer-modern__logo">
              <Link to={path.INDEX}>
                <img src={Logo} decoding="async" alt="logo" loading="lazy" />
              </Link>
            </div>
            <p className="footer-modern__description">
              {t('description')}
            </p>
            <div className="footer-modern__social">
              <Link 
                to={"https://www.facebook.com/FashionStore678"}
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
                to={"https://www.youtube.com/@tranat833"}
                className="footer-modern__social-link"
                target="_blank"
              >
                <Icon icon="openmoji:youtube" style={{ fontSize: '24px' }} />
              </Link>
              <Link 
                to={"https://t.me/+84941217281"}
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
            {t('copyright')}
          </p>
        </div>
      </Container>
    </footer>
  );
};
