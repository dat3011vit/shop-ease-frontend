// Supported languages
export type Language = 'vi' | 'en' | 'zh' | 'th';

// Language information interface
export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string; // Iconify icon name
}

// i18n Namespace types
export type Namespace =
  | 'common'
  | 'auth'
  | 'header'
  | 'footer'
  | 'product'
  | 'cart'
  | 'order'
  | 'admin'
  | 'validation';
