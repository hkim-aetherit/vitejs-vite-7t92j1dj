import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { service } from '../services';
import { ServiceError } from '../mocks/service';
import { ErrorCode } from '../types';

interface RegisterProps {
  onBackToLogin: () => void;
}

interface ValidationErrors {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

export function Register({ onBackToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState('');
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('validation.email');
    }

    if (!name) {
      newErrors.name = t('validation.required');
    } else if (name.length < 2) {
      newErrors.name = t('validation.name.min');
    } else if (name.length > 50) {
      newErrors.name = t('validation.name.max');
    }

    if (!password) {
      newErrors.password = t('validation.required');
    } else if (password.length < 8) {
      newErrors.password = t('validation.password.min');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation.required');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('validation.password.match');
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
    setGeneralError('');
    
    try {
      await service.register(email, password, name);
      setIsRegistered(true);
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.code === ErrorCode.EMAIL_EXISTS) {
          setErrors(prev => ({
            ...prev,
            email: t('common.error.emailExists')
          }));
        } else if (error.code === ErrorCode.NAME_EXISTS) {
          setErrors(prev => ({
            ...prev,
            name: t('common.error.nameExists')
          }));
        } else if (error.code === ErrorCode.UNKNOWN) {
          setGeneralError(t('common.error.unknown'));
        }
      } else {
        setGeneralError(t('common.error.registrationFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('common.registrationSuccess')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('common.checkEmail')}
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('common.backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">{t('common.register')}</h1>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.name')}
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder={t('placeholders.name')}
                disabled={isLoading}
              />
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="min-h-[20px] text-sm text-red-500">
              {errors.name && errors.name}
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
          <div className="h-[70px]">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.confirmPassword')}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                placeholder={t('placeholders.confirmPassword')}
                disabled={isLoading}
              />
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="min-h-[20px] text-sm text-red-500">
              {errors.confirmPassword && errors.confirmPassword}
            </div>
          </div>

          {generalError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{generalError}</span>
            </div>
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
                  {t('common.registering')}
                </>
              ) : (
                t('common.register')
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            disabled={isLoading}
          >
            {t('common.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}