import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onSelect?: () => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
    onSelect?.();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="w-full p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
    >
      <Globe className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      <span className="text-gray-800 dark:text-gray-200">
        {i18n.language === 'ko' ? 'English' : '한국어'}
      </span>
    </button>
  );
}