import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { useLayoutStore, WidgetLayout } from '../store/useLayoutStore';
import { InfiniteCanvas } from '../components/canvas/InfiniteCanvas';
import { FreeWidget } from '../components/canvas/FreeWidget';
import { DigitalDisplay } from '../components/ui/DigitalDisplay';
import { AppTab } from '../types';

export const L2Mac: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { widgets, initWidgets } = useLayoutStore();
  const { t } = useTranslation();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#222' : '#e5e5e5';
  const axisColor = isDark ? '#333' : '#ccc';
  const tooltipBg = isDark ? 'rgba(5, 5, 5, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = isDark ? '#333' : '#000';
  const tooltipText = isDark ? '#fff' : '#000';

  const formatNumber = (value: number | undefined, decimals: number = 2): string => {
    if (value === undefined || value === null) return '0';
    return Number.isInteger(value) ? value.toString() : value.toFixed(decimals);
  };

  const colors = {
    primary: isDark ? "text-primary text-glow-cyan" : "text-blue-700",
    secondary: isDark ? "text-secondary text-glow-magenta" : "text-purple-700",
    success: isDark ? "text-success text-glow-green" : "text-green-700",
    warning: isDark ? "text-warning text-glow-yellow" : "text-yellow-600",
    accent: isDark ? "text-accent text-glow-red" : "text-red-700",
  };

  const renderMap = useMemo(() => ({
    'dl-total': () => (
        <div className="flex items-center justify-between h-full">
           <span className={`text-4xl font-mono font-bold ${colors.success}`}>
            {new Intl.NumberFormat('en-US').format(latestMetric?.dl_ok_total ?? 0)}
          </span>
        </div>
    ),
    'ul-total': () => (
        <div className="flex items-center justify-between h-full">
          <span className={`text-4xl font-mono font-bold ${colors.primary}`}>
            {new Intl.NumberFormat('en-US').format(latestMetric?.ul_ok_total ?? 0)}
          </span>
        </div>
    ),
    'bad-dci': () => <DigitalDisplay value={formatNumber(latestMetric?.bad_dci)} color={colors.warning} size="lg" />,
    'ul-code-rate': () => <DigitalDisplay value={formatNumber(latestMetric?.ul_code_rate, 2)} color={colors.secondary} size="lg" />,
    'ul-bps': () => <DigitalDisplay value={formatNumber(latestMetric?.ul_bps, 2)} color={colors.primary} size="lg" />,
    'ul-rb-tb': () => <DigitalDisplay value={formatNumber(latestMetric?.ul_rb_tb, 2)} color={colors.success} size="lg" />,
    'ul-sym-tb': () => <DigitalDisplay value={formatNumber(latestMetric?.ul_sym_tb, 2)} color={colors.accent} size="lg" />,
    'dl-chart': () => (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              {/* @ts-ignore */}
              <XAxis dataKey="ts" hide />
              {/* @ts-ignore */}
              <YAxis stroke={axisColor} />
              {/* @ts-ignore */}
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontFamily: 'Share Tech Mono' }} />
              <Legend />
              {/* @ts-ignore */}
              <Bar dataKey="dl_ok_delta" stackId="a" fill={isDark ? "#39FF14" : "#22c55e"} name="OK" isAnimationActive={false} />
              {/* @ts-ignore */}
              <Bar dataKey="dl_err_delta" stackId="a" fill={isDark ? "#FF0033" : "#ef4444"} name="ERR" isAnimationActive={false} />
            </BarChart>
        </ResponsiveContainer>
    ),
    'ul-chart': () => (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              {/* @ts-ignore */}
              <XAxis dataKey="ts" hide />
              {/* @ts-ignore */}
              <YAxis stroke={axisColor} />
              {/* @ts-ignore */}
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, fontFamily: 'Share Tech Mono' }} />
              <Legend />
              {/* @ts-ignore */}
              <Bar dataKey="ul_ok_delta" stackId="a" fill={isDark ? "#00F0FF" : "#0ea5e9"} name="OK" isAnimationActive={false} />
              {/* @ts-ignore */}
              <Bar dataKey="ul_err_delta" stackId="a" fill={isDark ? "#FF0033" : "#ef4444"} name="ERR" isAnimationActive={false} />
            </BarChart>
        </ResponsiveContainer>
    )
  }), [history, latestMetric, isDark, t, gridColor, axisColor, tooltipBg, tooltipBorder, tooltipText, colors]);

  const defaults: Omit<WidgetLayout, 'zIndex'>[] = [
      { id: 'dl-total',    x: 100,  y: 100, w: 450, h: 140 },
      { id: 'ul-total',    x: 570,  y: 100, w: 450, h: 140 },
      
      { id: 'bad-dci',     x: 100,  y: 260, w: 180, h: 140 },
      { id: 'ul-code-rate',x: 300,  y: 260, w: 180, h: 140 },
      { id: 'ul-bps',      x: 500,  y: 260, w: 180, h: 140 },
      { id: 'ul-rb-tb',    x: 700,  y: 260, w: 180, h: 140 },
      { id: 'ul-sym-tb',   x: 900,  y: 260, w: 180, h: 140 },

      { id: 'dl-chart',    x: 100,  y: 420, w: 480, h: 350 },
      { id: 'ul-chart',    x: 600,  y: 420, w: 480, h: 350 },
  ];

  useEffect(() => {
    
    initWidgets(AppTab.L2_MAC, defaults);
  }, [initWidgets]);

  const tabWidgets = widgets[AppTab.L2_MAC] || {};
  const meta = {
      'dl-total': { title: 'TOTAL DL', color: 'success' },
      'ul-total': { title: 'TOTAL UL', color: 'primary' },
      'bad-dci': { title: 'BAD DCI', color: 'warning' },
      'ul-code-rate': { title: 'CODE RATE', color: 'secondary' },
      'ul-bps': { title: 'BITS/SYM', color: 'primary' },
      'ul-rb-tb': { title: 'RB/TB', color: 'success' },
      'ul-sym-tb': { title: 'SYM/TB', color: 'accent' },
      'dl-chart': { title: t('chart_dl_perf'), color: 'success' },
      'ul-chart': { title: t('chart_ul_perf'), color: 'primary' },
  } as const;

  return (
    <InfiniteCanvas tabId={AppTab.L2_MAC}>
      {Object.values(tabWidgets).map((layout) => {
        const key = layout.id as keyof typeof renderMap;
        if (!renderMap[key]) return null;
        const info = meta[key] || { title: 'Metric', color: 'primary' };

        return (
          <FreeWidget
            key={layout.id}
            tabId={AppTab.L2_MAC}
            layout={layout}
            title={info.title}
            color={info.color as any}
          >
            {renderMap[key]()}
          </FreeWidget>
        );
      })}
    </InfiniteCanvas>
  );
};