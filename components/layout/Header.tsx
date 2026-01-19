// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { ConnectionStatus } from '../../types';
import { Activity, Wifi, AlertTriangle, Layers, Hash, Sun, Moon, Radio} from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { status, latestMetric, theme, setTheme, language, setLanguage } = useTelemetryStore();
  const [time, setTime] = useState(new Date());
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED: return 'text-success border-success bg-success/10';
      case ConnectionStatus.CONNECTING: return 'text-warning border-warning bg-warning/10';
      default: return 'text-accent border-accent bg-accent/10';
    }
  };

  const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-300 dark:border-grid-line flex items-center justify-between px-8 shadow-md z-20 backdrop-blur-sm bg-opacity-90 transition-colors duration-300">
      {/* Breadcrumbs / Title */}
      <div className="flex items-center gap-3 text-sm font-mono tracking-widest text-gray-500 dark:text-gray-400">
        <span className="text-primary font-bold drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">USER EQUIPMENT 5G</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-600">//</span>
        <span className="text-black dark:text-white font-bold underline decoration-primary decoration-2 underline-offset-4 decoration-wavy hover:text-primary transition-colors cursor-pointer">MONITORING</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className={clsx("px-3 py-1.5 border flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-300", getStatusColor())}>
          {status === ConnectionStatus.CONNECTED ? <Wifi className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {t(`status_${status.toLowerCase()}`)}
        </div>

        {/* Global Stats */}
        <div className="flex gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#0C0C0C] flex items-center gap-2 group hover:border-primary dark:hover:border-primary transition-colors duration-300 cursor-default">
            <Hash className="w-3 h-3 text-primary" />
            <span className="text-gray-500 font-bold group-hover:text-primary dark:group-hover:text-primary transition-colors">RNTI:</span>
            <span className="text-black dark:text-white w-12 text-right font-mono">{latestMetric ? `0x${latestMetric.rnti.toString(16).toUpperCase()}` : '---'}</span>
          </div>
          <div className="px-3 py-1.5 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#0C0C0C] flex items-center gap-2 group hover:border-accent dark:hover:border-accent transition-colors duration-300 cursor-default">
            <Radio className="w-3 h-3 text-accent" />
            <span className="text-gray-500 font-bold group-hover:text-accent dark:group-hover:text-accent transition-colors">PCI:</span>
            <span className="text-black dark:text-white w-8 text-right font-mono">{latestMetric?.pci ?? '---'}</span>
          </div>
          <div className="px-3 py-1.5 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#0C0C0C] flex items-center gap-2 group hover:border-secondary dark:hover:border-secondary transition-colors duration-300 cursor-default">
            <Layers className="w-3 h-3 text-secondary" />
            <span className="text-gray-500 font-bold group-hover:text-secondary dark:group-hover:text-secondary transition-colors">FRAME:</span>
            <span className="text-black dark:text-white w-8 text-right font-mono">{latestMetric?.frame ?? '---'}</span>
          </div>
          <div className="px-3 py-1.5 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#0C0C0C] flex items-center gap-2 group hover:border-success dark:hover:border-success transition-colors duration-300 cursor-default">
            <span className="text-gray-500 font-bold group-hover:text-success dark:group-hover:text-success transition-colors">SLOT:</span>
            <span className="text-black dark:text-white w-8 text-right font-mono">{latestMetric?.slot ?? '---'}</span>
          </div>
          <div className="px-3 py-1.5 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#0C0C0C] flex items-center gap-2 w-28 justify-center group hover:border-gray-500 dark:hover:border-gray-500 transition-colors duration-300 cursor-default">
             <Activity className="w-3 h-3 text-gray-500" />
            <span className="text-black dark:text-white font-bold group-hover:text-primary dark:group-hover:text-primary transition-colors text-right font-mono">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
        </div>

        {/* Language Toggle Button */}
        <button
            onClick={() => {
                const newLanguage = language === 'en' ? 'ru' : 'en';
                setLanguage(newLanguage);
                i18n.changeLanguage(newLanguage);
            }}
            className="w-9 h-9 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#111] text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary dark:hover:bg-secondary dark:hover:text-white dark:hover:border-secondary hover:shadow-[0_0_10px_rgba(153,0,255,0.5)] dark:hover:shadow-[0_0_10px_rgba(153,0,255,0.3)] transition-all duration-300 group rounded-none"
        >
            <span className="font-bold text-sm">{language === 'en' ? 'EN' : 'RU'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
            onClick={toggleTheme}
            className="w-9 h-9 border border-gray-300 dark:border-[#333] bg-white dark:bg-[#111] text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary dark:hover:text-white dark:hover:border-primary hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] dark:hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all duration-300 group rounded-none"
        >
            {isDark ? (
                <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            ) : (
                <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />
            )}
        </button>

      </div>
    </header>
  );
};