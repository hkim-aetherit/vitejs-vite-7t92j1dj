import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { Login } from './Login';
import { Video, MapPin, Phone, MessageSquare, Download } from 'lucide-react';

interface WelcomePageProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
}

export function WelcomePage({ isAuthenticated, onAuthenticate }: WelcomePageProps) {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    
    setDeferredPrompt(null);
  };

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  if (showLogin) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="fixed top-4 right-4 flex gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        <Login onLogin={onAuthenticate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <ThemeToggle />
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-full p-1">
                      <img 
                        src="/talkple-logo-64.png" 
                        alt="톡플 로고" 
                        className="w-24 h-24"
                      />
                    </div>
                  </div>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block mb-3">{t('welcome.hero.title1')}</span>
                  <span className="block text-blue-600 dark:text-blue-500">{t('welcome.hero.title2')}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  {t('welcome.hero.description')}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center sm:gap-4">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => setShowLogin(true)}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      {t('welcome.hero.getStarted')}
                    </button>
                  </div>
                  {isInstallable && (
                    <div className="rounded-md shadow">
                      <button
                        onClick={handleInstall}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 gap-2"
                      >
                        <Download className="w-5 h-5" />
                        {t('welcome.hero.install')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-500 font-semibold tracking-wide uppercase">
              {t('welcome.features.subtitle')}
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t('welcome.features.title')}
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Video className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t('welcome.features.video.title')}
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {t('welcome.features.video.description')}
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {t('welcome.features.chat.title')}
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {t('welcome.features.chat.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">앱을 설치하시겠습니까?</span>
            <span className="block text-blue-600 dark:text-blue-500">더 나은 경험을 위해 앱을 설치하세요.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={handleInstall}
                disabled={!isInstallable}
                className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white gap-2 ${
                  isInstallable 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                {t('welcome.hero.install')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('welcome.footer.company')}
              </p>
              <div className="mt-4 flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{t('welcome.footer.address')}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{t('welcome.footer.phone')}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {t('welcome.footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}