import { Language, LanguageInfo } from './types';

export const DEFAULT_LANGUAGE: Language = 'vi';
export const LANGUAGE_STORAGE_KEY = 'shopease_language';

export const SUPPORTED_LANGUAGES: Record<Language, LanguageInfo> = {
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: 'twemoji:flag-vietnam',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: 'twemoji:flag-united-kingdom',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: 'twemoji:flag-china',
  },
  th: {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: 'twemoji:flag-thailand',
  },
};

export const LANGUAGE_LIST = Object.values(SUPPORTED_LANGUAGES);
