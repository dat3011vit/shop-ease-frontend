import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_LIST, SUPPORTED_LANGUAGES } from '@/i18n/constants';
import type { Language } from '@/i18n/types';
import './index.scss';

interface LanguageSwitcherProps {
  variant?: 'header' | 'auth';
}

export const LanguageSwitcher = ({ variant = 'header' }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = SUPPORTED_LANGUAGES[i18n.language as Language] || SUPPORTED_LANGUAGES.vi;

  const handleChangeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`language-switcher language-switcher--${variant}`} ref={dropdownRef}>
      <button
        className="language-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        type="button"
      >
        <Icon icon={currentLanguage.flag} className="language-switcher__flag" />
        {variant === 'auth' && (
          <span className="language-switcher__name">{currentLanguage.nativeName}</span>
        )}
        {/* <Icon
          icon="mdi:chevron-down"
          className={`language-switcher__arrow ${isOpen ? 'rotated' : ''}`}
        /> */}
      </button>

      {isOpen && (
        <div className="language-switcher__dropdown">
          {LANGUAGE_LIST.map((lang) => (
            <button
              key={lang.code}
              className={`language-switcher__item ${
                i18n.language === lang.code ? 'active' : ''
              }`}
              onClick={() => handleChangeLanguage(lang.code)}
              type="button"
            >
              <Icon icon={lang.flag} className="language-switcher__item-flag" />
              <span className="language-switcher__item-name">{lang.nativeName}</span>
              {i18n.language === lang.code && (
                <Icon icon="mdi:check" className="language-switcher__check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
