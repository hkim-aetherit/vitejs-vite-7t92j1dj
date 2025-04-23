import React, { useState } from 'react';
import { Lock, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  roomName: string;
}

export function PasswordModal({ onClose, onSubmit, roomName }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError(t('validation.required'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(password);
    } catch (error) {
      setError(t('validation.password.incorrect'));
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {roomName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
                  error ? 'border-red-500' : ''
                }`}
                placeholder={t('placeholders.roomPassword')}
                disabled={isLoading}
              />
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.verifying')}
                </>
              ) : (
                t('common.join')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}