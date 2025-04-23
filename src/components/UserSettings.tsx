import React, { useState } from 'react';
import {
  Settings,
  User,
  Mail,
  Camera,
  Loader2,
  CheckCircle,
  MessageSquare,
  Clock,
  Trash2,
  Square,
  CheckSquare,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SubscriptionModal } from './SubscriptionModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface UserSettingsProps {
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

interface RefundModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

type SettingsTab = 'profile' | 'subscription' | 'history';

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '이용중';
    case 'unused':
      return '구매완료';
    case 'expired':
      return '만료';
    case 'refunding':
      return '환불신청중';
    case 'refunded':
      return '환불완료';
    default:
      return '';
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-500';
    case 'unused':
      return 'text-blue-500';
    case 'expired':
      return 'text-gray-500';
    case 'refunding':
      return 'text-yellow-500';
    case 'refunded':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const subscriptionHistory = [
  {
    id: 1,
    plan: '프리미엄 30시간',
    time: '30시간',
    price: '9,900원',
    date: '2024-03-15',
    status: 'unused',
  },
  {
    id: 2,
    plan: '프리미엄 30시간',
    time: '12시간',
    price: '9,900원',
    date: '2024-03-15',
    status: 'active',
  },
  {
    id: 3,
    plan: '프리미엄 30시간',
    time: '0시간',
    price: '9,900원',
    date: '2024-02-15',
    status: 'expired',
  },
  {
    id: 4,
    plan: '프리미엄 100시간',
    time: '100시간',
    price: '178,200원',
    date: '2024-03-16',
    status: 'refunding',
  },
  {
    id: 5,
    plan: '프리미엄 30시간',
    time: '30시간',
    price: '56,430원',
    date: '2024-03-10',
    status: 'refunded',
  },
];

const chatHistory = [
  {
    id: 1,
    type: 'video',
    participant: '김철수',
    date: '2024-03-15 14:30',
    duration: '32분',
  },
  {
    id: 2,
    type: 'chat',
    participant: '일반 대화방',
    date: '2024-03-14 15:20',
    duration: '97분',
  },
];

function RefundModal({ onClose, onConfirm, isLoading }: RefundModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.settings.refundRequest')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('common.settings.refundDescription')}
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <ul className="list-disc list-inside space-y-2">
              <li className="text-sm text-yellow-700 dark:text-yellow-300">
                {t('common.settings.refundWarning')}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('common.settings.requestingRefund')}
              </>
            ) : (
              t('common.settings.requestRefund')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserSettings({ onClose, user }: UserSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [history, setHistory] = useState(chatHistory);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [subscriptions, setSubscriptions] = useState(subscriptionHistory);
  const [showDeleteSubscriptionConfirm, setShowDeleteSubscriptionConfirm] =
    useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    number | null
  >(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Purchased plan:', planId);
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === history.length ? [] : history.map((item) => item.id)
    );
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setHistory((prev) =>
        prev.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSubscription = (id: number) => {
    setSelectedSubscriptionId(id);
    setShowDeleteSubscriptionConfirm(true);
  };

  const confirmDeleteSubscription = async () => {
    if (!selectedSubscriptionId) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubscriptions((prev) =>
        prev.filter((item) => item.id !== selectedSubscriptionId)
      );
      setShowDeleteSubscriptionConfirm(false);
      setSelectedSubscriptionId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefundRequest = (id: number) => {
    setSelectedSubscriptionId(id);
    setShowRefundModal(true);
  };

  const confirmRefundRequest = async () => {
    if (!selectedSubscriptionId) return;

    setIsRefunding(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubscriptions((prev) =>
        prev.map((item) =>
          item.id === selectedSubscriptionId
            ? { ...item, status: 'refunding' }
            : item
        )
      );
      setShowRefundModal(false);
      setSelectedSubscriptionId(null);
    } finally {
      setIsRefunding(false);
    }
  };

  const canDeleteSubscription = (status: string) => {
    return status === 'expired' || status === 'refunded';
  };

  const canRequestRefund = (status: string) => {
    return status === 'unused';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}시간 ${remainingMinutes}분`;
  };

  const renderProfileTab = () => (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('common.email')}
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={email}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            disabled
          />
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('common.name')}
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isLoading}
          />
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('common.saving')}
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="w-5 h-5" />
              {t('common.saved')}
            </>
          ) : (
            t('common.save')
          )}
        </button>
      </div>
    </form>
  );

  const renderSubscriptionTab = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h4 className="text-base font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          이용시 주의사항
        </h4>
        <ul className="list-disc list-inside space-y-2">
          <li className="text-sm text-yellow-700 dark:text-yellow-300">
            대화가 실제 이루어지는 여부와 상관없이 대화를 시작하고 1분이 경과한
            시점부터 분 단위로 시간이 차감됩니다.
          </li>
          <li className="text-sm text-yellow-700 dark:text-yellow-300">
            구매한 이용권은 사용하지 않았을 경우에 한하여 구매 시점으로부터 7일
            이내에는 환불이 가능합니다.
          </li>
        </ul>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('common.settings.purchase')}
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.settings.availableTime')}
          </h3>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <p className="text-lg font-semibold text-blue-500">
              {formatTime(720)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('common.settings.subscriptionHistory')}
        </h3>
        {subscriptions.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {item.plan}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.date}
              </p>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-2">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.price}
                </p>
                <p className={`text-sm ${getStatusStyle(item.status)}`}>
                  {getStatusText(item.status)}
                </p>
              </div>
              <div className="flex w-20 justify-center items-center gap-2">
                {canRequestRefund(item.status) && (
                  <button
                    onClick={() => handleRefundRequest(item.id)}
                    className="px-3 py-1 text-sm text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded transition-colors"
                  >
                    {t('common.settings.refund')}
                  </button>
                )}
                {canDeleteSubscription(item.status) && (
                  <button
                    onClick={() => handleDeleteSubscription(item.id)}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  >
                    {t('common.delete')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('common.settings.chatHistory')}
          </h3>
          {history.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {selectedItems.length === history.length ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              <span className="text-sm">{t('common.selectAll')}</span>
            </button>
          )}
        </div>
        {selectedItems.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {t('common.selectedDelete')} ({selectedItems.length})
            </span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleSelectItem(item.id)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                {selectedItems.includes(item.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-500" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div
                className={`p-2 rounded-full ${
                  item.type === 'video'
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-blue-100 dark:bg-blue-900'
                }`}
              >
                {item.type === 'video' ? (
                  <Camera
                    className={`w-5 h-5 ${
                      item.type === 'video' ? 'text-green-500' : 'text-blue-500'
                    }`}
                  />
                ) : (
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.participant}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.duration}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('common.settings.noHistory')}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Settings className="w-5 h-5" />
          {t('common.settings.title')}
        </h2>
      </div>

      <div className="border-b dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            {t('common.settings.profile')}
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'subscription'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('subscription')}
          >
            {t('common.settings.subscription')}
            {activeTab === 'subscription' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'history'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            {t('common.settings.history')}
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'subscription' && renderSubscriptionTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onPurchase={handlePurchase}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          message={t('common.settings.deleteHistoryConfirm')}
          isDeleting={isDeleting}
        />
      )}

      {showDeleteSubscriptionConfirm && (
        <DeleteConfirmModal
          onClose={() => {
            setShowDeleteSubscriptionConfirm(false);
            setSelectedSubscriptionId(null);
          }}
          onConfirm={confirmDeleteSubscription}
          message={t('common.settings.deleteSubscriptionConfirm')}
          isDeleting={isDeleting}
        />
      )}

      {showRefundModal && (
        <RefundModal
          onClose={() => {
            setShowRefundModal(false);
            setSelectedSubscriptionId(null);
          }}
          onConfirm={confirmRefundRequest}
          isLoading={isRefunding}
        />
      )}
    </div>
  );
}
