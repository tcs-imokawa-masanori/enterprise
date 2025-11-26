import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Globe } from 'lucide-react';

export default function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('nav.settings')}
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          {t('nav.settingsDesc')}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-blue-500" />
                ) : (
                  <Sun className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('common.darkMode')}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toggle between light and dark themes
                  </div>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
              <Globe className="h-5 w-5 mr-2 text-blue-500" />
              {t('common.language')}
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  i18n.language === 'en'
                    ? `${isDarkMode ? 'bg-blue-900/50 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`
                    : `${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div className="text-left">
                    <div className="font-medium">English</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      English (United States)
                    </div>
                  </div>
                </div>
                {i18n.language === 'en' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => changeLanguage('ja')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  i18n.language === 'ja'
                    ? `${isDarkMode ? 'bg-blue-900/50 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`
                    : `${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇯🇵</span>
                  <div className="text-left">
                    <div className="font-medium">日本語</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Japanese (Japan)
                    </div>
                  </div>
                </div>
                {i18n.language === 'ja' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}