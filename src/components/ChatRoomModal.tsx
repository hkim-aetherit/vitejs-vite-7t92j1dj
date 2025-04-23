import React, { useState } from 'react';
import { X, Loader2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatRoomModalProps {
  onClose: () => void;
  onSubmit: (name: string, password?: string) => Promise<void>;
}

export function ChatRoomModal({ onClose, onSubmit }: ChatRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!roomName.trim()) {
      newErrors.name = t('validation.required');
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
      await onSubmit(roomName, usePassword ? roomPassword : undefined);
      handleClose();
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRoomName('');
    setRoomPassword('');
    setUsePassword(false);
    setErrors({});
    onClose();
  };

  const handlePasswordToggle = () => {
    setUsePassword(!usePassword);
    if (!usePassword) {
      setRoomPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.chat.createRoom')}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.chat.roomName')}
            </label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={t('placeholders.roomName')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={handlePasswordToggle}
                  className="sr-only peer"
                  disabled={isLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.chat.usePassword')}
                </span>
              </label>
            </div>

            {usePassword && (
              <div className="relative">
                <input
                  id="roomPassword"
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder={t('placeholders.roomPassword')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
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
                  {t('common.chat.creating')}
                </>
              ) : (
                t('common.chat.create')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}