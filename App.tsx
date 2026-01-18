import React, { useEffect } from 'react';
import { useTelemetrySocket } from './hooks/useTelemetrySocket';
import { useTelemetryStore } from './store/useTelemetryStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Overview } from './views/Overview';
import { L1Phy } from './views/L1Phy';
import { L2Mac } from './views/L2Mac';
import { Logs } from './views/Logs';
import { Settings } from './views/Settings';
import { AppTab, ConnectionStatus } from './types';
import i18n from './utils/i18n';


const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('defaultProps will be removed')) return;
  originalConsoleError(...args);
};

const App: React.FC = () => {
  useTelemetrySocket();
  const { status, activeTab, language, isSidebarCollapsed } = useTelemetryStore();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.OVERVIEW: return <Overview />;
      case AppTab.L1_PHY: return <L1Phy />;
      case AppTab.L2_MAC: return <L2Mac />;
      case AppTab.LOGS: return <Logs />;
      case AppTab.SETTINGS: return <Settings />;
      default: return null;
    }
  };

  return (
    <div className="relative h-screen overflow-hidden font-display selection:bg-primary selection:text-black transition-colors duration-300 bg-background-light dark:bg-bg-dark text-text-light dark:text-gray-300">
      <Sidebar />
      <main className={`${isSidebarCollapsed ? 'ml-12' : 'ml-72'} flex flex-col h-full relative z-0 bg-transparent transition-all duration-300 min-w-0`}>
        <Header />

        <div className="flex-1 overflow-hidden relative w-full h-full">
           {status !== ConnectionStatus.CONNECTED && (
             <div className="absolute top-4 right-4 z-50 pointer-events-none">
                <div className="border border-accent p-2 bg-white/90 dark:bg-black/90 shadow-[0_0_20px_rgba(255,0,51,0.2)] flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent animate-pulse rounded-full"></div>
                  <span className="font-mono text-accent text-xs font-bold tracking-widest">OFFLINE</span>
                </div>
             </div>
           )}

          <div className="w-full h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;