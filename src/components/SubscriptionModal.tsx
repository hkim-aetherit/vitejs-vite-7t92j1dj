import React from 'react';
import { X, Check, Loader2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubscriptionModalProps {
  onClose: () => void;
  onPurchase: (planId: string) => Promise<void>;
}

const plans = [
  {
    id: 'basic_5',
    name: '베이직 5시간',
    price: '9,900원',
    time: '5시간',
    features: [
      '영상통화 이용 가능',
      '공개 대화 만들기',
      '유효기간 없음'
    ]
  },
  {
    id: 'basic_10',
    name: '베이직 10시간',
    price: '19,800원',
    time: '10시간',
    features: [
      '영상통화 이용 가능',
      '공개 대화 만들기',
      '유효기간 없음'
    ]
  },
  {
    id: 'premium_30',
    name: '프리미엄 30시간',
    originalPrice: '59,400원',
    price: '56,430원',
    time: '30시간',
    discount: '5% 할인',
    popular: true,
    features: [
      '영상통화 이용 가능',
      '공개 대화 만들기',
      '유효기간 없음'
    ]
  },
  {
    id: 'premium_100',
    name: '프리미엄 100시간',
    originalPrice: '198,000원',
    price: '178,200원',
    time: '100시간',
    discount: '10% 할인',
    features: [
      '영상통화 이용 가능',
      '공개 대화 만들기',
      '유효기간 없음'
    ]
  }
];

export function SubscriptionModal({ onClose, onPurchase }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<string>('premium_30');
  const [isLoading, setIsLoading] = React.useState(false);
  const { t } = useTranslation();

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase(selectedPlan);
      onClose();
    } catch (error) {
      console.error('Failed to purchase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('common.settings.selectPlan')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 -right-3">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      인기
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-semibold text-blue-500">
                      {plan.time}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-base text-gray-500 dark:text-gray-400 line-through">
                          {plan.originalPrice}
                        </span>
                        <span className="text-sm text-green-500 font-medium">
                          {plan.discount}
                        </span>
                      </div>
                    )}
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.id && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handlePurchase}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.settings.purchasing')}
                </>
              ) : (
                t('common.settings.purchase')
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}