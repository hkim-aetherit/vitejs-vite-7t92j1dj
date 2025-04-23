import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  showText?: boolean;
  onToggle?: () => void;
}

export function ThemeToggle({ showText = false, onToggle }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleClick = () => {
    toggleTheme();
    onToggle?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
        showText ? 'w-full flex items-center gap-2' : ''
      }`}
      aria-label={theme === 'light' ? t('common.theme.dark') : t('common.theme.light')}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          {showText && <span className="text-gray-800 dark:text-gray-200">{t('common.theme.dark')}</span>}
        </>
      ) : (
        <>
          <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          {showText && <span className="text-gray-800 dark:text-gray-200">{t('common.theme.light')}</span>}
        </>
      )}
    </button>
  );
}