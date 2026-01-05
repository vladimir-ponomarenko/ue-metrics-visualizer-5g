import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { NeonCard } from '../components/ui/NeonCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatBytes } from '../utils/format';

export const L2Mac: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { t } = useTranslation();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#222' : '#e5e5e5';
  const axisColor = isDark ? '#333' : '#ccc';
  const tooltipBg = isDark ? 'rgba(5, 5, 5, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = isDark ? '#333' : '#000';
  const tooltipText = isDark ? '#fff' : '#000';

  return (
    <div className="grid grid-cols-12 gap-6 pb-10">

      {/* Total Counters */}
      <div className="col-span-12 grid grid-cols-2 gap-6">
         <NeonCard color="success" className="flex items-center justify-between" title="TOTAL DL BLOCKS (OK)">
            <span className={`text-4xl font-mono font-bold ${isDark ? "text-success text-glow-green" : "text-green-600"}`}>
              {new Intl.NumberFormat('en-US').format(latestMetric?.dl_ok_total ?? 0)}
            </span>
         </NeonCard>
         <NeonCard color="primary" className="flex items-center justify-between" title="TOTAL UL BLOCKS (OK)">
            <span className={`text-4xl font-mono font-bold ${isDark ? "text-primary text-glow-cyan" : "text-blue-600"}`}>
               {new Intl.NumberFormat('en-US').format(latestMetric?.ul_ok_total ?? 0)}
            </span>
         </NeonCard>
      </div>

      {/* DL Performance */}
      <div className="col-span-12 lg:col-span-6">
        <NeonCard color="success" className="h-[400px]" title={t('chart_dl_perf')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="ts" hide />
              <YAxis stroke={axisColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  color: tooltipText,
                  fontFamily: 'Share Tech Mono'
                }}
                itemStyle={{
                  color: tooltipText,
                  fontFamily: 'Share Tech Mono'
                }}
                labelStyle={{
                  color: tooltipText,
                  fontFamily: 'Share Tech Mono'
                }}
              />
              <Legend />
              <Bar dataKey="dl_ok_delta" stackId="a" fill={isDark ? "#39FF14" : "#22c55e"} name="OK" isAnimationActive={false} />
              <Bar dataKey="dl_err_delta" stackId="a" fill={isDark ? "#FF0033" : "#ef4444"} name="ERR" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </NeonCard>
      </div>

      {/* UL Performance */}
      <div className="col-span-12 lg:col-span-6">
        <NeonCard color="primary" className="h-[400px]" title={t('chart_ul_perf')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="ts" hide />
              <YAxis stroke={axisColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  color: tooltipText,
                  fontFamily: 'Share Tech Mono'
                }}
                itemStyle={{
                  color: tooltipText,
                  fontFamily: 'Share Tech Mono'
                }}
                labelStyle={{
                  color: tooltipText,
                  fontFamily: 'Share Tech Mono'
                }}
              />
              <Legend />
              <Bar dataKey="ul_ok_delta" stackId="a" fill={isDark ? "#00F0FF" : "#0ea5e9"} name="OK" isAnimationActive={false} />
              <Bar dataKey="ul_err_delta" stackId="a" fill={isDark ? "#FF0033" : "#ef4444"} name="ERR" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </NeonCard>
      </div>
    </div>
  );
};