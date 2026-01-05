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
    <div className="w-full h-full min-h-[300px] relative">
      {/* Сетка на фоне только для темной темы для стиля */}
      {isDark && <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

          <XAxis
            dataKey="ts"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            hide={true}
          />

          <YAxis
            yAxisId="left"
            orientation="left"
            stroke={rsrpColor}
            domain={['auto', 'auto']}
            tick={{ fill: rsrpColor, fontSize: 11, fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}
            label={{ value: 'RSRP (dBm)', angle: -90, position: 'insideLeft', fill: rsrpColor, fontSize: 12, fontWeight: 'bold' }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={snrColor}
            domain={['auto', 'auto']}
            tick={{ fill: snrColor, fontSize: 11, fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}
            label={{ value: 'SNR (dB)', angle: 90, position: 'insideRight', fill: snrColor, fontSize: 12, fontWeight: 'bold' }}
          />

          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }}
            itemStyle={{ fontFamily: 'Share Tech Mono' }}
            labelStyle={{ fontFamily: 'Share Tech Mono', color: isDark ? '#888' : '#555' }}
            labelFormatter={(label) => new Date(label).toLocaleTimeString()}
          />

          <Legend wrapperStyle={{ fontFamily: 'Chakra Petch', fontSize: '12px', paddingTop: '10px' }}/>

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rsrp"
            stroke={rsrpColor}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            name="RSRP"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="snr"
            stroke={snrColor}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            name="SNR"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};