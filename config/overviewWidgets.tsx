import React from 'react';
import { DigitalDisplay } from '../components/ui/DigitalDisplay';
import { SignalChart } from '../components/widgets/SignalChart';
import { BlerGauge } from '../components/widgets/BlerGauge';
import { ProcessedMetric } from '../types';

const DummyChart = () => (
  <div className="w-full h-full bg-gray-50 dark:bg-[#080808] relative overflow-hidden flex items-center justify-center p-2">
     <svg viewBox="0 0 100 50" className="w-full h-full opacity-50 stroke-primary fill-none" preserveAspectRatio="none">
        <path d="M0,25 Q10,5 20,25 T40,25 T60,25 T80,25 T100,25" strokeWidth="2" vectorEffect="non-scaling-stroke" />
     </svg>
  </div>
);

export type WidgetType = string;

export interface WidgetDefinition {
  id: WidgetType;
  title: string;
  color: 'primary' | 'secondary' | 'success' | 'accent' | 'warning';
  defaultW: number;
  defaultH: number;
  renderPreview: () => React.ReactNode;
  renderLive: (data: { latestMetric: ProcessedMetric | null; history: ProcessedMetric[]; t: any; isDark: boolean }) => React.ReactNode;
}

export const OVERVIEW_WIDGETS: Record<string, WidgetDefinition> = {
  // --- CORE METRICS ---
  'rsrp-card': {
    id: 'rsrp-card',
    title: 'RSRP',
    color: 'primary',
    defaultW: 300,
    defaultH: 180,
    renderPreview: () => <DigitalDisplay value="-85.0" unit="dBm" color="text-primary" size="lg" />,
    renderLive: ({ latestMetric, t, isDark }) => {
        const val = latestMetric?.rsrp;
        const color = (val ?? -120) > -100 ? (isDark ? "text-primary text-glow-cyan" : "text-blue-700") : "text-accent";
        return <DigitalDisplay value={val?.toFixed(1) ?? '---'} unit={t('label_dbm')} color={color} size="xl" />;
    }
  },
  'snr-card': {
    id: 'snr-card',
    title: 'SNR',
    color: 'secondary',
    defaultW: 300,
    defaultH: 180,
    renderPreview: () => <DigitalDisplay value="24.5" unit="dB" color="text-secondary" size="lg" />,
    renderLive: ({ latestMetric, t, isDark }) => (
        <DigitalDisplay value={latestMetric?.snr?.toFixed(1) ?? '---'} unit={t('label_db')} color={isDark ? "text-secondary" : "text-purple-700"} size="xl" />
    )
  },
  'rssi': {
    id: 'rssi',
    title: 'RSSI',
    color: 'warning',
    defaultW: 250,
    defaultH: 140,
    renderPreview: () => <DigitalDisplay value="-65.0" unit="dBm" color="text-warning" size="md" />,
    renderLive: ({ latestMetric, isDark }) => (
        <DigitalDisplay value={latestMetric?.rssi?.toFixed(1) ?? '---'} unit="dBm" color={isDark ? "text-warning" : "text-yellow-600"} size="lg" />
    )
  },
  'cqi': {
    id: 'cqi',
    title: 'CQI',
    color: 'secondary',
    defaultW: 250,
    defaultH: 140,
    renderPreview: () => <DigitalDisplay value="12" unit="" color="text-secondary" size="md" />,
    renderLive: ({ latestMetric, isDark }) => (
        <DigitalDisplay value={latestMetric?.cqi ?? 0} unit="(0-15)" color={isDark ? "text-secondary" : "text-purple-700"} size="lg" />
    )
  },

  // --- TRAFFIC ---
  'dl-traffic': {
    id: 'dl-traffic',
    title: 'DL TRAFFIC',
    color: 'success',
    defaultW: 300,
    defaultH: 180,
    renderPreview: () => <DigitalDisplay value="1205" unit="Blk/s" color="text-success" size="md" />,
    renderLive: ({ latestMetric, t, isDark }) => (
        <DigitalDisplay value={latestMetric?.dl_ok_delta?.toFixed(0) ?? '---'} unit={t('label_blocks_s')} color={isDark ? "text-success" : "text-green-700"} size="xl" />
    )
  },
  'ul-traffic': {
    id: 'ul-traffic',
    title: 'UL TRAFFIC',
    color: 'primary',
    defaultW: 300,
    defaultH: 180,
    renderPreview: () => <DigitalDisplay value="840" unit="Blk/s" color="text-primary" size="md" />,
    renderLive: ({ latestMetric, t, isDark }) => (
        <DigitalDisplay value={latestMetric?.ul_ok_delta?.toFixed(0) ?? '---'} unit={t('label_blocks_s')} color={isDark ? "text-primary" : "text-blue-700"} size="xl" />
    )
  },

  // --- COUNTERS ---
  'dl-total': {
    id: 'dl-total',
    title: 'TOTAL DL',
    color: 'success',
    defaultW: 400,
    defaultH: 140,
    renderPreview: () => <span className="text-xl font-mono text-success">1,234,567</span>,
    renderLive: ({ latestMetric, isDark }) => (
        <div className="flex items-center justify-center h-full w-full">
           <span className={`font-mono font-bold ${isDark ? "text-success" : "text-green-700"} truncate`} style={{ fontSize: '30cqh' }}>
            {new Intl.NumberFormat('en-US').format(latestMetric?.dl_ok_total ?? 0)}
          </span>
        </div>
    )
  },
  'ul-total': {
    id: 'ul-total',
    title: 'TOTAL UL',
    color: 'primary',
    defaultW: 400,
    defaultH: 140,
    renderPreview: () => <span className="text-xl font-mono text-primary">890,123</span>,
    renderLive: ({ latestMetric, isDark }) => (
        <div className="flex items-center justify-center h-full w-full">
           <span className={`font-mono font-bold ${isDark ? "text-primary" : "text-blue-700"} truncate`} style={{ fontSize: '30cqh' }}>
            {new Intl.NumberFormat('en-US').format(latestMetric?.ul_ok_total ?? 0)}
          </span>
        </div>
    )
  },

  // --- PARAMETERS ---
  'rx-antennas': {
    id: 'rx-antennas',
    title: 'RX ANT',
    color: 'success',
    defaultW: 200,
    defaultH: 120,
    renderPreview: () => <DigitalDisplay value="4" color="text-success" size="sm" />,
    renderLive: ({ latestMetric, isDark }) => <DigitalDisplay value={latestMetric?.antennasRx ?? 0} color={isDark ? "text-success" : "text-green-600"} size="lg" />
  },
  'mimo-rank': {
    id: 'mimo-rank',
    title: 'MIMO',
    color: 'primary',
    defaultW: 200,
    defaultH: 120,
    renderPreview: () => <DigitalDisplay value="2" color="text-primary" size="sm" />,
    renderLive: ({ latestMetric, isDark }) => <DigitalDisplay value={latestMetric?.rank ?? 0} color={isDark ? "text-primary" : "text-blue-600"} size="lg" />
  },
  'n0-noise': {
    id: 'n0-noise',
    title: 'NOISE',
    color: 'secondary',
    defaultW: 250,
    defaultH: 140,
    renderPreview: () => <DigitalDisplay value="-114" color="text-secondary" size="sm" />,
    renderLive: ({ latestMetric, isDark }) => <DigitalDisplay value={latestMetric?.n0_power?.toFixed(0) ?? 0} color={isDark ? "text-secondary" : "text-purple-600"} size="lg" />
  },
  'rx-gain': {
    id: 'rx-gain',
    title: 'GAIN',
    color: 'success',
    defaultW: 200,
    defaultH: 120,
    renderPreview: () => <DigitalDisplay value="30" color="text-success" size="sm" />,
    renderLive: ({ latestMetric, isDark }) => <DigitalDisplay value={latestMetric?.rx_gain ?? 0} color={isDark ? "text-success" : "text-green-600"} size="lg" />
  },
  'bad-dci': {
    id: 'bad-dci',
    title: 'BAD DCI',
    color: 'warning',
    defaultW: 200,
    defaultH: 140,
    renderPreview: () => <DigitalDisplay value="5" color="text-warning" size="sm" />,
    renderLive: ({ latestMetric, isDark }) => <DigitalDisplay value={latestMetric?.bad_dci ?? 0} color={isDark ? "text-warning" : "text-yellow-600"} size="lg" />
  },
  'code-rate': {
    id: 'code-rate',
    title: 'CODE RATE',
    color: 'secondary',
    defaultW: 200,
    defaultH: 140,
    renderPreview: () => <DigitalDisplay value="0.5" color="text-secondary" size="sm" />,
    renderLive: ({ latestMetric, isDark }) => <DigitalDisplay value={latestMetric?.ul_code_rate?.toFixed(2) ?? 0} color={isDark ? "text-secondary" : "text-purple-600"} size="lg" />
  },

  // --- CHARTS ---
  'signal-chart': {
    id: 'signal-chart',
    title: 'SIGNAL MONITOR',
    color: 'primary',
    defaultW: 600,
    defaultH: 300,
    renderPreview: () => <DummyChart />,
    renderLive: ({ history }) => <SignalChart data={history} />
  },
  'bler-gauge': {
    id: 'bler-gauge',
    title: 'BLER STATS',
    color: 'accent',
    defaultW: 300,
    defaultH: 300,
    renderPreview: () => (
        <div className="flex flex-col gap-2 p-2 justify-center h-full">
            <div className="h-2 bg-success/50 w-full rounded"></div>
            <div className="h-2 bg-primary/50 w-3/4 rounded"></div>
        </div>
    ),
    renderLive: ({ latestMetric }) => {
        const dlBler = latestMetric ? (latestMetric.dl_err_delta / (latestMetric.dl_ok_delta + latestMetric.dl_err_delta)) * 100 : 0;
        const ulBler = latestMetric ? (latestMetric.ul_err_delta / (latestMetric.ul_ok_delta + latestMetric.ul_err_delta)) * 100 : 0;
        return (
            <div className="flex flex-col justify-center h-full w-full gap-4 overflow-hidden">
                <BlerGauge label="DL BLER" value={dlBler} color="success" />
                <BlerGauge label="UL BLER" value={ulBler} color="primary" />
            </div>
        );
    }
  }
};