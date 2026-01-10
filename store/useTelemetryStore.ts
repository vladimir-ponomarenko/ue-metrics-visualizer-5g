import { create } from 'zustand';
import { ProcessedMetric, ConnectionStatus, LogEntry, AppTab } from '../types';

interface TelemetryState {
  history: ProcessedMetric[];
  latestMetric: ProcessedMetric | null;
  status: ConnectionStatus;
  logs: LogEntry[];
  activeTab: AppTab;
  language: 'en' | 'ru';
  theme: 'dark' | 'light';
  isSidebarCollapsed: boolean;

  addMetric: (metric: ProcessedMetric) => void;
  setHistory: (history: ProcessedMetric[]) => void;
  addLog: (log: Omit<LogEntry, 'id'>) => void;
  setStatus: (status: ConnectionStatus) => void;
  setActiveTab: (tab: AppTab) => void;
  setLanguage: (lang: 'en' | 'ru') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_LENGTH = 300;

export const useTelemetryStore = create<TelemetryState>((set) => ({
  history: [],
  latestMetric: null,
  status: ConnectionStatus.DISCONNECTED,
  logs: [],
  activeTab: AppTab.OVERVIEW,
  language: 'en',
  theme: 'dark',

  addMetric: (metric) => set((state) => {
    const newHistory = state.history.length >= MAX_HISTORY_LENGTH
      ? [...state.history.slice(1), metric]
      : [...state.history, metric];
    return { history: newHistory, latestMetric: metric };
  }),

  setHistory: (history) => set({
      history: history.slice(-MAX_HISTORY_LENGTH),
      latestMetric: history.length > 0 ? history[history.length - 1] : null
  }),

  addLog: (log) => set((state) => ({
    logs: [{ ...log, id: Math.random().toString(36).substr(2, 9) }, ...state.logs].slice(0, 100)
  })),

  setStatus: (status) => set({ status }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLanguage: (language) => set({ language }),

setTheme: (theme) => {
      const root = document.documentElement;
      if (theme === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
          document.body.style.backgroundColor = '#050505';
      } else {
          root.classList.remove('dark');
          root.classList.add('light');
          document.body.style.backgroundColor = '#E5E5E5';
      }
      set({ theme });
  },

  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),
  clearHistory: () => set({ history: [], latestMetric: null })
}));