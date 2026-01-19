// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, Label, ZAxis } from 'recharts';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { useLayoutStore, WidgetLayout } from '../store/useLayoutStore';
import { InfiniteCanvas } from '../components/canvas/InfiniteCanvas';
import { FreeWidget } from '../components/canvas/FreeWidget';
import { DigitalDisplay } from '../components/ui/DigitalDisplay';
import { AppTab, ProcessedMetric } from '../types';

const CqiChart = React.memo(({ data, isDark, gridColor, tooltipBg, tooltipBorder, tooltipText }: any) => (
    <div className="w-full h-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
             <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
               <XAxis dataKey="ts" hide />
               <YAxis domain={[0, 15]} stroke={isDark ? "#E000FF" : "#9900FF"} tick={{ fontSize: 10 }} width={30} />
               <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }} itemStyle={{ fontFamily: 'Share Tech Mono' }} />
               <Line type="stepAfter" dataKey="cqi" stroke={isDark ? "#E000FF" : "#9900FF"} strokeWidth={2} dot={false} isAnimationActive={false} />
             </LineChart>
        </ResponsiveContainer>
    </div>
));

const ScatterSignalChart = React.memo(({ data, isDark, gridColor, axisColorX, axisColorY, scatterColor, tooltipBg, tooltipBorder, tooltipText }: any) => (
    <div className="w-full h-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
             <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
               <XAxis type="number" dataKey="rsrp" name="RSRP" unit="dBm" stroke={axisColorX} tick={{ fontSize: 10, fill: axisColorX }} domain={['auto', 'auto']}>
                  <Label value="RSRP" offset={-10} position="insideBottom" fill={axisColorX} style={{fontSize: 10}} />
               </XAxis>
               <YAxis type="number" dataKey="rssi" name="RSSI" unit="dBm" stroke={axisColorY} tick={{ fontSize: 10, fill: axisColorY }} domain={['auto', 'auto']} width={35}>
                  <Label value="RSSI" angle={-90} position="insideLeft" fill={axisColorY} style={{fontSize: 10}} />
               </YAxis>
               <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText, zIndex: 100, fontFamily: 'Share Tech Mono', fontSize: '12px' }} isAnimationActive={false} />
               <ZAxis range={[40, 40]} />
               <Scatter name="Signal" data={data} fill={scatterColor} isAnimationActive={false} />
             </ScatterChart>
        </ResponsiveContainer>
    </div>
));

export const L1Phy: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { widgets, initWidgets } = useLayoutStore();
  const { t } = useTranslation();
  const recentHistory = useMemo(() => history.slice(-60), [history]);

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#222' : '#ccc';
  const scatterColor = isDark ? '#8884d8' : '#0044FF';
  const axisColorX = isDark ? '#00F0FF' : '#0044FF';
  const axisColorY = isDark ? '#FFE600' : '#B45309';
  const tooltipBg = isDark ? 'rgba(5, 5, 5, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipBorder = isDark ? '#333' : '#666';
  const tooltipText = isDark ? '#fff' : '#000';
  const rssiColor = isDark ? "text-warning text-glow-yellow" : "text-yellow-600";

  const renderMap = useMemo(() => ({
    'rssi': () => <DigitalDisplay value={(latestMetric?.rssi ?? 0).toFixed(1)} unit="dBm" color={rssiColor} size="xl" />,
    'cqi': () => <DigitalDisplay value={latestMetric?.cqi ?? 0} unit="(0-15)" color={isDark ? "text-secondary" : "text-purple-700"} size="xl" />,
    'snr': () => <DigitalDisplay value={(latestMetric?.snr ?? 0).toFixed(1)} unit="dB" color={isDark ? "text-primary" : "text-blue-700"} size="xl" />,
    'rx-antennas': () => <DigitalDisplay value={latestMetric?.antennasRx ?? 0} color={isDark ? "text-success" : "text-green-600"} size="lg" />,
    'mimo-rank': () => <DigitalDisplay value={latestMetric?.rank ?? 0} color={isDark ? "text-primary" : "text-blue-600"} size="lg" />,
    'n0-noise': () => <DigitalDisplay value={(latestMetric?.n0_power ?? 0).toFixed(1)} unit="dBm" color={isDark ? "text-secondary" : "text-purple-600"} size="md" />,
    'rx-gain': () => <DigitalDisplay value={latestMetric?.rx_gain ?? 0} unit="dB" color={isDark ? "text-success" : "text-green-600"} size="md" />,
    'nta-offset': () => <DigitalDisplay value={latestMetric?.nta_offset ?? 0} unit="samples" color={isDark ? "text-warning" : "text-yellow-600"} size="md" />,
    'cqi-chart': () => (
        <CqiChart
            data={recentHistory}
            isDark={isDark}
            gridColor={gridColor}
            tooltipBg={tooltipBg}
            tooltipBorder={tooltipBorder}
            tooltipText={tooltipText}
        />
    ),
    'scatter-chart': () => (
        <ScatterSignalChart
            data={recentHistory}
            isDark={isDark}
            gridColor={gridColor}
            axisColorX={axisColorX}
            axisColorY={axisColorY}
            scatterColor={scatterColor}
            tooltipBg={tooltipBg}
            tooltipBorder={tooltipBorder}
            tooltipText={tooltipText}
        />
    ),
    'beam-table': () => (
        <div className="w-full h-full overflow-auto pr-1 scrollbar-thin">
            <table className="w-full text-left font-mono text-[10px] lg:text-xs border-collapse">
                <thead className="sticky top-0 bg-surface-light dark:bg-surface-dark z-10">
                    <tr className="border-b border-gray-300 dark:border-[#333]">
                        <th className="py-2">BEAM</th>
                        <th className="py-2 text-primary">RSRP</th>
                        <th className="py-2 text-secondary">SINR</th>
                    </tr>
                </thead>
                <tbody>
                    {latestMetric?.ssb_rsrp_beams.map((rsrp, index) => {
                        const sinr = latestMetric.ssb_sinr_beams[index];
                        if (rsrp === 0 || rsrp < -140) return null;
                        return (
                            <tr key={index} className="border-b border-gray-200 dark:border-[#222]">
                                <td className="py-1 text-gray-500">{`#${index}`}</td>
                                <td className={`py-1 ${rsrp > -90 ? 'text-success' : 'text-warning'}`}>{rsrp.toFixed(1)}</td>
                                <td className={`py-1 ${sinr > 10 ? 'text-secondary' : 'text-gray-400'}`}>{sinr.toFixed(1)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
  }), [recentHistory, latestMetric, isDark, t, gridColor, tooltipBg, tooltipBorder, tooltipText, rssiColor, axisColorX, axisColorY, scatterColor]);

  const defaults: Omit<WidgetLayout, 'zIndex'>[] = [
      { id: 'rssi',        x: 100, y: 100, w: 250, h: 140 },
      { id: 'cqi',         x: 370, y: 100, w: 250, h: 140 },
      { id: 'snr',         x: 640, y: 100, w: 250, h: 140 },
      { id: 'rx-antennas', x: 910, y: 100, w: 250, h: 140 },
      { id: 'mimo-rank',   x: 100, y: 260, w: 250, h: 140 },
      { id: 'n0-noise',    x: 370, y: 260, w: 250, h: 140 },
      { id: 'rx-gain',     x: 640, y: 260, w: 250, h: 140 },
      { id: 'nta-offset',  x: 910, y: 260, w: 250, h: 140 },
      { id: 'cqi-chart',   x: 100, y: 420, w: 520, h: 300 },
      { id: 'scatter-chart', x: 640, y: 420, w: 520, h: 300 },
      { id: 'beam-table',  x: 1180, y: 100, w: 300, h: 620 },
  ];

  useEffect(() => {
    initWidgets(AppTab.L1_PHY, defaults);
  }, [initWidgets]);

  const tabWidgets = widgets[AppTab.L1_PHY] || {};
  return (
    <InfiniteCanvas tabId={AppTab.L1_PHY}>
      {Object.values(tabWidgets).map((layout) => {
        const key = layout.id as keyof typeof renderMap;
        if (!renderMap[key]) return null;
        // @ts-ignore
        const info = {
           'rssi': { title: 'RSSI', color: 'warning' },
           'cqi': { title: 'CQI', color: 'secondary' },
           'snr': { title: 'SNR', color: 'primary' },
           'rx-antennas': { title: 'RX ANT', color: 'success' },
           'mimo-rank': { title: 'MIMO', color: 'primary' },
           'n0-noise': { title: 'N0 PWR', color: 'secondary' },
           'rx-gain': { title: 'GAIN', color: 'success' },
           'nta-offset': { title: 'N_TA', color: 'warning' },
           'cqi-chart': { title: t('chart_cqi'), color: 'secondary' },
           'scatter-chart': { title: t('chart_rssi_rsrp'), color: 'warning' },
           'beam-table': { title: 'BEAMS', color: 'primary' },
        }[key] || { title: 'Data', color: 'primary' };

        return (
          <FreeWidget
            key={layout.id}
            tabId={AppTab.L1_PHY}
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