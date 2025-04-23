import React, { useState, useEffect } from 'react';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Register } from './Register';
import { ForgotPassword } from './ForgotPassword';
import { service } from '../services';

interface ValidationErrors {
  email?: string;
  password?: string;
}

const REMEMBER_ME_KEY = 'rememberMe';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loginError, setLoginError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const shouldRemember = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    if (shouldRemember) {
      onLogin();
    }
  }, [onLogin]);

  useEffect(() => {
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
  }, [rememberMe]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('validation.email');
    }

    if (!password) {
      newErrors.password = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');
    
    try {
      await service.login(email, password);
      onLogin();
    } catch (error) {
      setLoginError(t('common.error.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />;
  }

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  if (showWelcome) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('common.login')}</h1>
          <button
            onClick={() => setShowWelcome(true)}
            className="flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            메인으로 돌아가기
          </button>
        </div>
        {loginError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="h-[70px]">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.email')}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder={t('placeholders.email')}
                disabled={isLoading}
              />
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="min-h-[20px] text-sm text-red-500">
              {errors.email && errors.email}
            </div>
          </div>
          <div className="h-[70px]">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.password')}
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.password ? 'border-red-500' : ''
                }`}
                placeholder={t('placeholders.password')}
                disabled={isLoading}
              />
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="min-h-[20px] text-sm text-red-500">
              {errors.password && errors.password}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
                disabled={isLoading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('common.rememberMe')}
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              disabled={isLoading}
            >
              {t('common.passwordReset.link')}
            </button>
          </div>
          {rememberMe && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              {t('common.rememberMeWarning')}
            </p>
          )}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('common.loggingIn')}
                </>
              ) : (
                t('common.login')
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowRegister(true)}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            disabled={isLoading}
          >
            {t('common.register')}
          </button>
        </div>
      </div>
    </div>
  );
}