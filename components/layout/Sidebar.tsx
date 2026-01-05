import React from 'react';
import { Home, Cpu, Router, Settings, Terminal, Radio } from 'lucide-react';
import clsx from 'clsx';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { AppTab } from '../../types';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useTelemetryStore();
  const { t } = useTranslation();

  const navItems = [
    { id: AppTab.OVERVIEW, name: t('nav_overview'), icon: Home, color: 'text-primary' },
    { id: AppTab.L1_PHY, name: t('nav_l1'), icon: Cpu, color: 'text-primary' },
    { id: AppTab.L2_MAC, name: t('nav_l2'), icon: Router, color: 'text-secondary' },
    { id: AppTab.L3_RRC, name: t('nav_l3'), icon: Radio, color: 'text-success' },
    { id: AppTab.LOGS, name: t('nav_logs'), icon: Terminal, color: 'text-warning' },
    { id: AppTab.SETTINGS, name: t('nav_settings'), icon: Settings, color: 'text-gray-400' },
  ];

  return (
    <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-grid-line flex flex-col justify-between z-20 shadow-[4px_0_24px_rgba(0,0,0,0.1)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-colors duration-300">
      <div>
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-center border-b border-border-light dark:border-grid-line bg-gray-100 dark:bg-bg-dark relative overflow-hidden group transition-colors duration-300">
          <div className="absolute inset-0 bg-cyber-grid opacity-10 dark:opacity-20"></div>
          <div className="flex items-center gap-3 relative z-10">
            <Radio className="text-primary w-10 h-10 animate-pulse drop-shadow-[0_0_10px_#00F0FF]" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tighter uppercase italic text-black dark:text-white text-glow-cyan">
                NET_METRICS
              </h1>
              <span className="text-[10px] tracking-[0.3em] text-primary font-mono border-t border-primary/30 pt-1 mt-1 block w-full text-center">
                5G MONITOR
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 gap-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "group relative px-5 py-3 transition-all flex items-center justify-between overflow-hidden",
                activeTab === item.id
                  ? "bg-primary/10 border border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "border border-transparent hover:bg-gray-200 dark:hover:bg-[#111] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon className={clsx("w-5 h-5 transition-colors", activeTab === item.id ? "text-primary" : "text-gray-500 group-hover:text-black dark:group-hover:text-white")} />
                <span className={clsx("font-display font-bold tracking-wider transition-all duration-300", activeTab !== item.id && "group-hover:tracking-widest")}>
                  {item.name}
                </span>
              </div>

              {/* Active Indicators */}
              {activeTab === item.id && (
                <>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary shadow-[0_0_5px_#00F0FF]" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary shadow-[0_0_5px_#00F0FF]" />
                </>
              )}

              {/* Hover Line */}
              {activeTab !== item.id && (
                 <div className={clsx("absolute bottom-0 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left bg-current", item.color)} />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border-light dark:border-grid-line bg-gray-100 dark:bg-bg-dark transition-colors duration-300">
        <div className="text-[10px] text-gray-500 dark:text-gray-600 font-mono text-center">
          V.1.0.0-STABLE
        </div>
      </div>
    </aside>
  );
};