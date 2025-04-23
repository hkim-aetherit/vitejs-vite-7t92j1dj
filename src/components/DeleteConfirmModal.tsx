import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  message: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({ onClose, onConfirm, message, isDeleting }: DeleteConfirmModalProps) {
  const { t } = useTranslation();

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">
              {t('common.delete')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('common.deleting')}
              </>
            ) : (
              t('common.delete')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}