import React, { useState } from 'react';
import { Users, Search, UserPlus, Loader2, X, UserCheck, Clock, UserX, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Friend {
  id: number;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
  email: string;
}

interface FriendInvite {
  id: number;
  name: string;
  email: string;
  avatar: string;
  date: string;
}

const friends: Friend[] = [
  { id: 1, name: '김민수', email: 'minsu.kim@example.com', status: 'online', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 2, name: '이지영', email: 'jiyoung.lee@example.com', status: 'offline', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 3, name: '박준호', email: 'junho.park@example.com', status: 'online', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

const sentInvites: FriendInvite[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', date: '2024-03-15' },
  { id: 2, name: '김철수', email: 'kim@example.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', date: '2024-03-14' },
];

const receivedInvites: FriendInvite[] = [
  { id: 1, name: '이영희', email: 'lee@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', date: '2024-03-15' },
  { id: 2, name: '최민지', email: 'choi@example.com', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', date: '2024-03-13' },
];

type FriendTab = 'friends' | 'sent' | 'received';
type SearchType = 'email' | 'name';

export function FriendsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FriendTab>('friends');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('email');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(friend => friend.status === 'online');
  const offlineFriends = filteredFriends.filter(friend => friend.status === 'offline');

  const validateInput = (): boolean => {
    if (!searchInput) {
      setError(t('validation.required'));
      return false;
    }

    if (searchType === 'email' && !/\S+@\S+\.\S+/.test(searchInput)) {
      setError(t('validation.email'));
      return false;
    }

    if (searchType === 'name' && searchInput.length < 2) {
      setError(t('validation.name.min'));
      return false;
    }

    setError('');
    return true;
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowAddFriend(false);
      setSearchInput('');
      setSearchType('email');
    } catch (error) {
      setError(t('common.error.addFriendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvite = async (inviteId: number) => {
    // Implement cancel invite logic
    console.log('Cancel invite:', inviteId);
  };

  const handleAcceptInvite = async (inviteId: number) => {
    // Implement accept invite logic
    console.log('Accept invite:', inviteId);
  };

  const handleDeclineInvite = async (inviteId: number) => {
    // Implement decline invite logic
    console.log('Decline invite:', inviteId);
  };

  const handleCall = (friend: Friend) => {
    if (friend.status === 'online') {
      navigate(`/talk/${friend.id}`);
    }
  };

  const FriendItem = ({ friend }: { friend: Friend }) => (
    <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-10 h-10 rounded-full"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
              friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{friend.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
        </div>
      </div>
      <button
        onClick={() => handleCall(friend)}
        className={`p-2 rounded-full transition-colors ${
          friend.status === 'online'
            ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
        }`}
        disabled={friend.status === 'offline'}
        title={friend.status === 'online' ? t('common.call') : t('common.offline')}
      >
        <Phone className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Users className="w-5 h-5" />
          {t('common.friends')}
        </h2>
        <button
          onClick={() => setShowAddFriend(true)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-sm">{t('common.addFriend')}</span>
        </button>
      </div>

      <div className="border-b dark:border-gray-700">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'friends'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            {t('common.friendsList.allFriends')}
            {activeTab === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'sent'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('sent')}
          >
            {t('common.friendsList.sentInvites')}
            {activeTab === 'sent' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'received'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('received')}
          >
            {t('common.friendsList.receivedInvites')}
            {activeTab === 'received' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'friends' && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search.friends')}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      )}

      <div className="space-y-3">
        {activeTab === 'friends' && (
          <>
            {filteredFriends.length > 0 ? (
              <div className="space-y-6">
                {onlineFriends.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('common.online')} ({onlineFriends.length})
                    </h3>
                    <div className="space-y-1">
                      {onlineFriends.map(friend => (
                        <FriendItem key={friend.id} friend={friend} />
                      ))}
                    </div>
                  </div>
                )}
                {offlineFriends.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('common.offline')} ({offlineFriends.length})
                    </h3>
                    <div className="space-y-1">
                      {offlineFriends.map(friend => (
                        <FriendItem key={friend.id} friend={friend} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('common.friendsList.noFriends')}
              </div>
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentInvites.length > 0 ? (
              sentInvites.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={invite.avatar}
                      alt={invite.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{invite.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{invite.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {t('common.friendsList.pending')}
                    </span>
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('common.friendsList.noSentInvites')}
              </div>
            )}
          </>
        )}

        {activeTab === 'received' && (
          <>
            {receivedInvites.length > 0 ? (
              receivedInvites.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={invite.avatar}
                      alt={invite.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{invite.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{invite.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptInvite(invite.id)}
                      className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('common.friendsList.accept')}</span>
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(invite.id)}
                      className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <UserX className="w-4 h-4" />
                      <span>{t('common.friendsList.decline')}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t('common.friendsList.noReceivedInvites')}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('common.addFriend')}
              </h3>
              <button
                onClick={() => {
                  setShowAddFriend(false);
                  setSearchInput('');
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFriend} className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSearchType('email')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    searchType === 'email'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {t('common.email')}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('name')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    searchType === 'name'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {t('common.name')}
                </button>
              </div>
              <div>
                <input
                  type={searchType === 'email' ? 'email' : 'text'}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={searchType === 'email' ? t('placeholders.friendEmail') : t('placeholders.name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    error ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFriend(false);
                    setSearchInput('');
                    setError('');
                  }}
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
                      {t('common.adding')}
                    </>
                  ) : (
                    t('common.add')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}