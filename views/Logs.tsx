import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { NeonCard } from '../components/ui/NeonCard';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const Logs: React.FC = () => {
  const { logs } = useTelemetryStore();
  const { t } = useTranslation();

  return (
    <div className="h-full pb-10">
      <NeonCard color="warning" className="h-full flex flex-col" title="SYSTEM EVENT LOGS">
        <div className="flex-1 bg-black border border-[#222] p-4 font-mono text-xs overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333] text-gray-500">
                <th className="py-2 w-32">{t('log_ts')}</th>
                <th className="py-2 w-24">{t('log_level')}</th>
                <th className="py-2">{t('log_message')}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#111] hover:bg-secondary/10 transition-colors">
                  <td className="py-2 text-gray-400">{new Date(log.ts).toLocaleTimeString()}</td>
                  <td className="py-2">
                    <span className={clsx(
                      "px-1 py-0.5 rounded-sm font-bold uppercase",
                      log.level === 'error' ? "bg-accent/20 text-accent" :
                      log.level === 'warning' ? "bg-warning/20 text-warning" :
                      "bg-primary/20 text-primary"
                    )}>
                      {log.level}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{log.message}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                   <td colSpan={3} className="py-8 text-center text-gray-600 italic">No events recorded in current session.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeonCard>
    </div>
  );
};