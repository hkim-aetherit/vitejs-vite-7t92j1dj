import React, { useEffect, useState } from 'react';
import { Users, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WaitingRoomModalProps {
  onClose: () => void;
  roomName: string;
}

export function WaitingRoomModal({ onClose, roomName }: WaitingRoomModalProps) {
  const [waitingCount, setWaitingCount] = useState(5);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

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
        
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <Users className="w-6 h-6 text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('common.chat.waiting')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.chat.waitingCount', { count: waitingCount })}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}