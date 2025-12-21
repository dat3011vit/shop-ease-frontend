import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './constants';

// Import translations - Vietnamese
import vi_common from './locales/vi/common.json';
import vi_auth from './locales/vi/auth.json';
import vi_header from './locales/vi/header.json';
import vi_validation from './locales/vi/validation.json';
import vi_footer from './locales/vi/footer.json';
import vi_product from './locales/vi/product.json';
import vi_cart from './locales/vi/cart.json';
import vi_checkout from './locales/vi/checkout.json';
import vi_account from './locales/vi/account.json';

// Import translations - English
import en_common from './locales/en/common.json';
import en_auth from './locales/en/auth.json';
import en_header from './locales/en/header.json';
import en_validation from './locales/en/validation.json';
import en_footer from './locales/en/footer.json';
import en_product from './locales/en/product.json';
import en_cart from './locales/en/cart.json';
import en_checkout from './locales/en/checkout.json';
import en_account from './locales/en/account.json';

// Import translations - Chinese
import zh_common from './locales/zh/common.json';
import zh_auth from './locales/zh/auth.json';
import zh_header from './locales/zh/header.json';
import zh_validation from './locales/zh/validation.json';
import zh_footer from './locales/zh/footer.json';
import zh_product from './locales/zh/product.json';
import zh_cart from './locales/zh/cart.json';
import zh_checkout from './locales/zh/checkout.json';
import zh_account from './locales/zh/account.json';

// Import translations - Thai
import th_common from './locales/th/common.json';
import th_auth from './locales/th/auth.json';
import th_header from './locales/th/header.json';
import th_validation from './locales/th/validation.json';
import th_footer from './locales/th/footer.json';
import th_product from './locales/th/product.json';
import th_cart from './locales/th/cart.json';
import th_checkout from './locales/th/checkout.json';
import th_account from './locales/th/account.json';

const resources = {
  vi: {
    common: vi_common,
    auth: vi_auth,
    header: vi_header,
    validation: vi_validation,
    footer: vi_footer,
    product: vi_product,
    cart: vi_cart,
    checkout: vi_checkout,
    account: vi_account,
  },
  en: {
    common: en_common,
    auth: en_auth,
    header: en_header,
    validation: en_validation,
    footer: en_footer,
    product: en_product,
    cart: en_cart,
    checkout: en_checkout,
    account: en_account,
  },
  zh: {
    common: zh_common,
    auth: zh_auth,
    header: zh_header,
    validation: zh_validation,
    footer: zh_footer,
    product: zh_product,
    cart: zh_cart,
    checkout: zh_checkout,
    account: zh_account,
  },
  th: {
    common: th_common,
    auth: th_auth,
    header: th_header,
    validation: th_validation,
    footer: th_footer,
    product: th_product,
    cart: th_cart,
    checkout: th_checkout,
    account: th_account,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: ['common', 'auth', 'header', 'validation', 'footer', 'product', 'cart', 'checkout', 'account'],

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
