import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

interface ValidationErrors {
  email?: string;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('validation.email');
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('common.passwordReset.emailSent')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('common.passwordReset.checkEmail')}
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
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {t('common.passwordReset.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          {t('common.passwordReset.description')}
        </p>
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
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('common.passwordReset.sending')}
                </>
              ) : (
                t('common.passwordReset.submit')
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('common.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}