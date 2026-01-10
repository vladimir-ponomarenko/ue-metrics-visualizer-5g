import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { NeonCard } from '../components/ui/NeonCard';
import { DigitalDisplay } from '../components/ui/DigitalDisplay';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, Label, ZAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

export const L1Phy: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { t } = useTranslation();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#222' : '#ccc';

  const scatterColor = isDark ? '#8884d8' : '#0044FF';
  const axisColorX = isDark ? '#00F0FF' : '#0044FF';
  const axisColorY = isDark ? '#FFE600' : '#B45309';

  const tooltipBg = isDark ? 'rgba(5, 5, 5, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipBorder = isDark ? '#333' : '#666';
  const tooltipText = isDark ? '#fff' : '#000';

  const rssiColor = isDark ? "text-warning text-glow-yellow" : "text-yellow-600";

  return (
    <div className="grid grid-cols-12 gap-6 pb-10">
      {/* Cards */}
      <div className="col-span-12 sm:col-span-3">
        <NeonCard color="warning" title="RSSI">
           <DigitalDisplay value={(latestMetric?.rssi ?? 0).toFixed(1)} unit="dBm" color={rssiColor} size="lg" />
        </NeonCard>
      </div>
      <div className="col-span-12 sm:col-span-3">
        <NeonCard color="secondary" title="CQI">
           <DigitalDisplay value={latestMetric?.cqi ?? 0} unit="(0-15)" color={isDark ? "text-secondary" : "text-purple-700"} size="lg" />
        </NeonCard>
      </div>
      <div className="col-span-12 sm:col-span-3">
        <NeonCard color="primary" title="SNR">
           <DigitalDisplay value={(latestMetric?.snr ?? 0).toFixed(1)} unit="dB" color={isDark ? "text-primary" : "text-blue-700"} size="lg" />
        </NeonCard>
      </div>
      <div className="col-span-12 sm:col-span-3">
        <NeonCard color="success" title="RX ANTENNAS">
           <DigitalDisplay value={latestMetric?.antennasRx ?? 0} color={isDark ? "text-success" : "text-green-600"} size="lg" />
        </NeonCard>
      </div>

      {/* === Row 2 === */}
      <div className="col-span-12 sm:col-span-3">
          <NeonCard color="primary" title="MIMO RANK">
              <DigitalDisplay value={latestMetric?.rank ?? 0} color={isDark ? "text-primary" : "text-blue-600"} size="md" />
          </NeonCard>
      </div>
      <div className="col-span-12 sm:col-span-3">
          <NeonCard color="secondary" title="N0 NOISE">
              <DigitalDisplay value={(latestMetric?.n0_power ?? 0).toFixed(1)} unit="dBm" color={isDark ? "text-secondary" : "text-purple-600"} size="md" />
          </NeonCard>
      </div>
      <div className="col-span-12 sm:col-span-3">
          <NeonCard color="success" title="RX GAIN">
              <DigitalDisplay value={latestMetric?.rx_gain ?? 0} unit="dB" color={isDark ? "text-success" : "text-green-600"} size="md" />
          </NeonCard>
      </div>
      <div className="col-span-12 sm:col-span-3">
          <NeonCard color="warning" title="N_TA OFFSET">
              <DigitalDisplay value={latestMetric?.nta_offset ?? 0} unit="samples" color={isDark ? "text-warning" : "text-yellow-600"} size="md" />
          </NeonCard>
      </div>

      {/* CQI History */}
      <div className="col-span-12 lg:col-span-6">
        <NeonCard color="secondary" className="h-[350px]" title={t('chart_cqi')}>
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={history}>
               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
               <XAxis dataKey="ts" hide />
               <YAxis domain={[0, 15]} stroke={isDark ? "#E000FF" : "#9900FF"} />
               <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }}
                  itemStyle={{ fontFamily: 'Share Tech Mono' }}
               />
               <Line type="stepAfter" dataKey="cqi" stroke={isDark ? "#E000FF" : "#9900FF"} strokeWidth={2} dot={false} isAnimationActive={false} />
             </LineChart>
           </ResponsiveContainer>
        </NeonCard>
      </div>

      {/* RSSI vs RSRP Scatter */}
      <div className="col-span-12 lg:col-span-6">
        <NeonCard color="warning" className="h-[350px]" title={t('chart_rssi_rsrp')}>
          <ResponsiveContainer width="100%" height="100%">
             <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
               <XAxis
                  type="number"
                  dataKey="rsrp"
                  name="RSRP"
                  unit="dBm"
                  stroke={axisColorX}
                  tick={{ fontSize: 10, fill: axisColorX }}
                  domain={['auto', 'auto']}
               >
                  <Label value="RSRP (dBm)" offset={-10} position="insideBottom" fill={axisColorX} style={{fontSize: 12}} />
               </XAxis>

               <YAxis
                  type="number"
                  dataKey="rssi"
                  name="RSSI"
                  unit="dBm"
                  stroke={axisColorY}
                  tick={{ fontSize: 10, fill: axisColorY }}
                  domain={['auto', 'auto']}
               >
                  <Label value="RSSI (dBm)" angle={-90} position="insideLeft" fill={axisColorY} style={{fontSize: 12}} />
               </YAxis>

               <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    color: tooltipText,
                    zIndex: 100,
                    fontFamily: 'Share Tech Mono',
                    fontSize: '12px'
                  }}
                  itemStyle={{
                    color: tooltipText,
                    fontFamily: 'Share Tech Mono',
                    fontSize: '12px'
                  }}
                  labelStyle={{
                    color: tooltipText,
                    fontFamily: 'Share Tech Mono',
                    fontSize: '12px'
                  }}
                  isAnimationActive={false}
               />
               <ZAxis range={[60, 60]} />
               <Scatter name="Signal" data={history} fill={scatterColor} isAnimationActive={false} />
             </ScatterChart>
           </ResponsiveContainer>
        </NeonCard>
      </div>

     <div className="col-span-12 lg:col-span-6">
          <NeonCard color="primary" className="h-[350px]" title="SSB BEAM MONITOR">
              <div className="overflow-y-auto h-full pr-2">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                          <tr className="border-b border-gray-300 dark:border-[#333]">
                              <th className="py-2">BEAM ID</th>
                              <th className="py-2 text-primary">RSRP (dBm)</th>
                              <th className="py-2 text-secondary">SINR (dB)</th>
                          </tr>
                      </thead>
                      <tbody>
                          {latestMetric?.ssb_rsrp_beams.map((rsrp, index) => {
                              const sinr = latestMetric.ssb_sinr_beams[index];
                              // Отображаем только активные лучи
                              if (rsrp === 0 || rsrp < -140) return null;
                              return (
                                  <tr key={index} className="border-b border-gray-200 dark:border-[#222]">
                                      <td className="py-2 text-gray-500">{`Beam #${index}`}</td>
                                      <td className={`py-2 ${rsrp > -90 ? 'text-success' : 'text-warning'}`}>{rsrp.toFixed(1)}</td>
                                      <td className={`py-2 ${sinr > 10 ? 'text-secondary' : 'text-gray-400'}`}>{sinr.toFixed(1)}</td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </NeonCard>
      </div>

    </div>
  );
};