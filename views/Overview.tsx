import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { useLayoutStore, WidgetLayout } from '../store/useLayoutStore';
import { DigitalDisplay } from '../components/ui/DigitalDisplay';
import { SignalChart } from '../components/widgets/SignalChart';
import { BlerGauge } from '../components/widgets/BlerGauge';
import { InfiniteCanvas } from '../components/canvas/InfiniteCanvas';
import { FreeWidget } from '../components/canvas/FreeWidget';
import { AppTab } from '../types';

const DEFAULTS: Omit<WidgetLayout, 'zIndex'>[] = [
  { id: 'rsrp-card',    x: 100,  y: 50,  w: 300, h: 180 },
  { id: 'snr-card',     x: 420,  y: 50,  w: 300, h: 180 },
  { id: 'dl-traffic',   x: 740,  y: 50,  w: 300, h: 180 },
  { id: 'ul-traffic',   x: 1060, y: 50,  w: 300, h: 180 },
  { id: 'signal-chart', x: 100,  y: 250, w: 940, h: 400 },
  { id: 'bler-gauge',   x: 1060, y: 250, w: 300, h: 400 },
];

export const Overview: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { t } = useTranslation();
  const { widgets, initWidgets } = useLayoutStore();

  const isDark = theme === 'dark';

  const rsrp = latestMetric?.rsrp;
  const snr = latestMetric?.snr;
  const dlBler = latestMetric ? (latestMetric.dl_err_delta / (latestMetric.dl_ok_delta + latestMetric.dl_err_delta)) * 100 : 0;
  const ulBler = latestMetric ? (latestMetric.ul_err_delta / (latestMetric.ul_ok_delta + latestMetric.ul_err_delta)) * 100 : 0;

  const colors = {
    primary: isDark ? "text-primary text-glow-cyan" : "text-blue-700",
    secondary: isDark ? "text-secondary text-glow-magenta" : "text-purple-700",
    success: isDark ? "text-success text-glow-green" : "text-green-700",
    accent: isDark ? "text-accent text-glow-red" : "text-red-700",
  };

  const renderMap = useMemo(() => ({
    'rsrp-card': () => (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 min-h-0">
               <DigitalDisplay value={rsrp?.toFixed(1) ?? '---'} unit={t('label_dbm')} color={(rsrp ?? -120) > -100 ? colors.primary : colors.accent} size="xl" />
            </div>
            {/* Scaling Bar */}
            <div className="w-full h-[15%] bg-gray-200 dark:bg-[#222] mt-auto relative overflow-hidden shrink-0">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, ((rsrp ?? -140) + 140) * 1.5))}%` }} />
            </div>
        </div>
    ),
    'snr-card': () => (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 min-h-0">
                <DigitalDisplay value={snr?.toFixed(1) ?? '---'} unit={t('label_db')} color={colors.secondary} size="xl" />
            </div>
            {/* Scaling Bar */}
            <div className="w-full h-[15%] bg-gray-200 dark:bg-[#222] mt-auto relative overflow-hidden shrink-0">
               <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, (snr ?? 0) * 3.3))}%` }} />
            </div>
        </div>
    ),
    'dl-traffic': () => (
         <div className="w-full h-full">
             <DigitalDisplay value={latestMetric?.dl_ok_delta?.toFixed(0) ?? '---'} unit={t('label_blocks_s')} color={colors.success} size="xl" />
         </div>
    ),
    'ul-traffic': () => (
         <div className="w-full h-full">
             <DigitalDisplay value={latestMetric?.ul_ok_delta?.toFixed(0) ?? '---'} unit={t('label_blocks_s')} color={colors.primary} size="xl" />
         </div>
    ),
    'signal-chart': () => (
        <SignalChart data={history} />
    ),
    'bler-gauge': () => (
        <div className="flex flex-col justify-center h-full w-full gap-4 overflow-hidden">
             <BlerGauge label="DL BLER" value={dlBler} color="success" />
             <BlerGauge label="UL BLER" value={ulBler} color="primary" />
        </div>
    )
  }), [t, rsrp, snr, latestMetric, history, colors, dlBler, ulBler]);

  useEffect(() => {
    initWidgets(AppTab.OVERVIEW, DEFAULTS);
  }, [initWidgets]);

  const tabWidgets = widgets[AppTab.OVERVIEW] || {};

  return (
    <div className="w-full h-full">
       <InfiniteCanvas tabId={AppTab.OVERVIEW}>
         {Object.values(tabWidgets).map((layout) => {
           const key = layout.id as keyof typeof renderMap;
           if (!renderMap[key]) return null;
           // @ts-ignore
           const info = {
              'rsrp-card': { title: t('metric_rsrp'), color: 'primary' },
              'snr-card': { title: t('metric_snr'), color: 'secondary' },
              'dl-traffic': { title: t('metric_dl_traffic'), color: 'success' },
              'ul-traffic': { title: t('metric_ul_traffic'), color: 'primary' },
              'signal-chart': { title: t('chart_signal'), color: 'primary' },
              'bler-gauge': { title: t('chart_bler'), color: 'accent' },
           }[key] || { title: 'Widget', color: 'primary' };

           return (
             <FreeWidget
               key={layout.id}
               tabId={AppTab.OVERVIEW}
               layout={layout}
               title={info.title}
               color={info.color as any}
             >
               {renderMap[key]()}
             </FreeWidget>
           );
         })}
       </InfiniteCanvas>
    </div>
  );
};