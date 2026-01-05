import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ProcessedMetric } from '../../types';

interface ThroughputChartProps {
  data: ProcessedMetric[];
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="ts" hide />
          <YAxis
            tick={{ fill: '#666', fontSize: 10, fontFamily: 'Share Tech Mono' }}
            stroke="#333"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#050505', borderColor: '#333' }}
            itemStyle={{ fontFamily: 'Share Tech Mono' }}
            labelStyle={{ display: 'none' }}
          />
          <Area
            type="monotone"
            dataKey="dl_ok_delta"
            stroke="#39FF14"
            fillOpacity={1}
            fill="url(#colorDl)"
            isAnimationActive={false}
            strokeWidth={2}
            name="DL Throughput"
          />
          <Area
            type="monotone"
            dataKey="ul_ok_delta"
            stroke="#00F0FF"
            fillOpacity={1}
            fill="url(#colorUl)"
            isAnimationActive={false}
            strokeWidth={2}
            name="UL Throughput"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};