// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { NeonCard } from '../components/ui/NeonCard';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Sun, Moon } from 'lucide-react';
import { APP_VERSION, APP_BUILD_DATE, APP_LICENSE } from '../types';

export const Settings: React.FC = () => {
  const { language, setLanguage, theme, setTheme } = useTelemetryStore();
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: 'en' | 'ru') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-8 grid grid-cols-12 gap-6 h-full overflow-y-auto content-start">
      <div className="col-span-12 lg:col-span-6 h-64">
        <NeonCard color="primary" title={t('settings_lang')} className="h-full">
          <div className="flex flex-col justify-center h-full gap-4 p-4">
             <div className="flex gap-4">
               <button
                  onClick={() => changeLanguage('en')}
                  className={clsx(
                    "px-6 py-4 border font-mono font-bold transition-all flex-1 text-lg",
                    language === 'en'
                      ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      : "border-gray-400 dark:border-gray-600 hover:border-primary text-gray-600 dark:text-gray-400 bg-transparent"
                  )}
               >
                  ENGLISH
               </button>
               <button
                  onClick={() => changeLanguage('ru')}
                  className={clsx(
                    "px-6 py-4 border font-mono font-bold transition-all flex-1 text-lg",
                    language === 'ru'
                      ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      : "border-gray-400 dark:border-gray-600 hover:border-primary text-gray-600 dark:text-gray-400 bg-transparent"
                  )}
               >
                  РУССКИЙ
               </button>
             </div>
             <p className="text-gray-500 text-xs font-mono text-center mt-2">
               {t('settings_lang_desc')}
             </p>
          </div>
        </NeonCard>
      </div>

      <div className="col-span-12 lg:col-span-6 h-64">
         <NeonCard color="secondary" title={t('settings_theme')} className="h-full">
            <div className="flex flex-col justify-center h-full gap-4 p-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => setTheme('dark')}
                        className={clsx(
                          "px-6 py-4 border font-mono font-bold transition-all flex-1 flex items-center justify-center gap-3 text-lg",
                          theme === 'dark'
                            ? "border-secondary bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(153,0,255,0.4)]"
                            : "border-gray-400 dark:border-gray-600 hover:border-secondary text-gray-600 dark:text-gray-400 bg-transparent"
                        )}
                    >
                        <Moon className="w-5 h-5" /> DARK
                    </button>
                    <button
                        onClick={() => setTheme('light')}
                        className={clsx(
                          "px-6 py-4 border font-mono font-bold transition-all flex-1 flex items-center justify-center gap-3 text-lg",
                          theme === 'light'
                            ? "border-secondary bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(153,0,255,0.4)]"
                            : "border-gray-400 dark:border-gray-600 hover:border-secondary text-gray-600 dark:text-gray-400 bg-transparent"
                        )}
                    >
                        <Sun className="w-5 h-5" /> LIGHT
                    </button>
                </div>
                <p className="text-gray-500 text-xs font-mono text-center mt-2">
                   {t('settings_theme_desc')}
                </p>
            </div>
         </NeonCard>
      </div>

      <div className="col-span-12 h-32">
        <NeonCard color="warning" title={t('sys_title')} className="h-full">
            <div className="flex items-center justify-between px-8 h-full font-mono text-sm text-gray-500">
                <span>{t('sys_version')}: <span className="text-black dark:text-white">{APP_VERSION}</span></span>
                <span>{t('sys_build')}: <span className="text-black dark:text-white">{APP_BUILD_DATE}</span></span>
                <span>{t('sys_license')}: <span className="text-black dark:text-white">{APP_LICENSE}</span></span>
            </div>
        </NeonCard>
      </div>
    </div>
  );
};