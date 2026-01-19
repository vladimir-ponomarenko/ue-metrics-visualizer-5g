// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ProcessedMetric } from '../../types';
import { useTelemetryStore } from '../../store/useTelemetryStore';

interface SignalChartProps {
  data: ProcessedMetric[];
}

export const SignalChart: React.FC<SignalChartProps> = ({ data }) => {
  const { theme } = useTelemetryStore();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#222' : '#e5e5e5';
  const rsrpColor = isDark ? '#00F0FF' : '#0044FF';
  const snrColor = isDark ? '#E000FF' : '#9900FF';

  const tooltipBg = isDark ? 'rgba(5, 5, 5, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = isDark ? '#333' : '#000';
  const tooltipText = isDark ? '#fff' : '#000';

  return (
    <div className="w-full h-full min-h-0 min-w-0 relative">
      {isDark && <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none z-0"></div>}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

          <XAxis
            dataKey="ts"
            hide={true}
          />

          <YAxis
            yAxisId="left"
            orientation="left"
            stroke={rsrpColor}
            domain={[-130, -50]} 
            tick={{ fill: rsrpColor, fontSize: 10, fontFamily: 'Share Tech Mono' }}
            width={35}
            interval="preserveStartEnd"
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={snrColor}
            domain={[-5, 30]}
            tick={{ fill: snrColor, fontSize: 10, fontFamily: 'Share Tech Mono' }}
            width={35}
            interval="preserveStartEnd"
          />

          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }}
            itemStyle={{ fontFamily: 'Share Tech Mono', fontSize: '12px' }}
            labelStyle={{ display: 'none' }}
          />

          <Legend wrapperStyle={{ fontSize: '10px', marginTop: '0px' }} iconSize={8} verticalAlign="top" height={20}/>

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rsrp"
            stroke={rsrpColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="RSRP"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="snr"
            stroke={snrColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="SNR"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};