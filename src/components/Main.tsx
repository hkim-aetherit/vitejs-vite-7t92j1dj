import React, { useState, useRef, useEffect } from 'react';
import { Users, MessageSquare, Menu, LogOut, Settings, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FriendsList } from './FriendsList';
import { ChatRooms } from './ChatRooms';
import { Login } from './Login';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { UserSettings } from './UserSettings';

type Tab = 'friends' | 'chat' | 'settings';

interface MainProps {
  onLogin: () => void;
  onLogout: () => void;
}

// 임시 사용자 데이터 (실제로는 로그인 시 서버에서 받아와야 함)
const currentUser = {
  name: '김민수',
  email: 'minsu.kim@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  availableTime: 720 // 12시간 (분 단위)
};

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}시간 ${remainingMinutes}분`;
};

export function Main({ onLogin, onLogout }: MainProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rememberMe');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    onLogout();
  };

  const handleThemeChange = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageChange = () => {
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    onLogin();
  };

  const handleSettings = () => {
    setActiveTab('settings');
    setIsMenuOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="fixed top-4 right-4 flex gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        <Login onLogin={handleLoginSuccess} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'friends':
        return <FriendsList />;
      case 'chat':
        return <ChatRooms />;
      case 'settings':
        return (
          <UserSettings
            user={currentUser}
            onClose={() => setActiveTab('friends')}
          />
        );
      default:
        return <FriendsList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img 
                src="/talkple-logo-24.png" 
                alt="톡플 로고" 
                className="w-8 h-8"
              />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">톡플</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === 'friends'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('friends')}
                title={t('common.friends')}
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">{t('common.friends')}</span>
                {activeTab === 'friends' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === 'chat'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('chat')}
                title={t('common.chat.title')}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden sm:inline">{t('common.chat.title')}</span>
                {activeTab === 'chat' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <Menu className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {currentUser.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-blue-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {formatTime(currentUser.availableTime)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleSettings}
                        className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={t('common.settings')}
                      >
                        <Settings className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <ThemeToggle showText onToggle={handleThemeChange} />
                  </div>
                  <div className="px-4 py-2">
                    <LanguageSelector onSelect={handleLanguageChange} />
                  </div>
                  <div className="px-4 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}