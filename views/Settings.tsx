import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { NeonCard } from '../components/ui/NeonCard';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Sun, Moon } from 'lucide-react';

export const Settings: React.FC = () => {
  const { language, setLanguage, theme, setTheme } = useTelemetryStore();
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: 'en' | 'ru') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="grid grid-cols-12 gap-6 pb-10">
      <div className="col-span-12 lg:col-span-6">
        <NeonCard color="primary" title={t('settings_lang')}>
          <div className="flex gap-4 mt-4">
             <button
                onClick={() => changeLanguage('en')}
                className={clsx(
                  "px-6 py-3 border font-mono font-bold transition-all flex-1",
                  language === 'en'
                    ? "border-primary bg-primary/20 text-primary shadow-neon-blue"
                    : "border-gray-400 dark:border-gray-500 hover:border-primary text-gray-600 dark:text-gray-400 bg-transparent"
                )}
             >
                ENGLISH
             </button>
             <button
                onClick={() => changeLanguage('ru')}
                className={clsx(
                  "px-6 py-3 border font-mono font-bold transition-all flex-1",
                  language === 'ru'
                    ? "border-primary bg-primary/20 text-primary shadow-neon-blue"
                    : "border-gray-400 dark:border-gray-500 hover:border-primary text-gray-600 dark:text-gray-400 bg-transparent"
                )}
             >
                РУССКИЙ
             </button>
          </div>
        </NeonCard>
      </div>

      <div className="col-span-12 lg:col-span-6">
         <NeonCard color="secondary" title={t('settings_theme')}>
            <div className="flex gap-4 mt-4">
                <button
                    onClick={() => setTheme('dark')}
                    className={clsx(
                      "px-6 py-3 border font-mono font-bold transition-all flex-1 flex items-center justify-center gap-2",
                      theme === 'dark'
                        ? "border-secondary bg-secondary/20 text-secondary shadow-neon-violet"
                        : "border-gray-400 dark:border-gray-500 hover:border-secondary text-gray-600 dark:text-gray-400 bg-transparent"
                    )}
                >
                    <Moon className="w-4 h-4" /> DARK
                </button>
                <button
                    onClick={() => setTheme('light')}
                    className={clsx(
                      "px-6 py-3 border font-mono font-bold transition-all flex-1 flex items-center justify-center gap-2",
                      theme === 'light'
                        ? "border-secondary bg-secondary/20 text-secondary shadow-neon-violet"
                        : "border-gray-400 dark:border-gray-500 hover:border-secondary text-gray-600 dark:text-gray-400 bg-transparent"
                    )}
                >
                    <Sun className="w-4 h-4" /> LIGHT
                </button>
            </div>
         </NeonCard>
      </div>
    </div>
  );
};