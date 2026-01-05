import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { NeonCard } from '../components/ui/NeonCard';
import { DigitalDisplay } from '../components/ui/DigitalDisplay';
import { SignalChart } from '../components/widgets/SignalChart';
import { BlerGauge } from '../components/widgets/BlerGauge';
import { useTranslation } from 'react-i18next';

export const Overview: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const rsrp = latestMetric?.rsrp ?? -120;
  const snr = latestMetric?.snr ?? 0;

  const dlBler = latestMetric ? (latestMetric.dl_err_delta / (latestMetric.dl_ok_delta + latestMetric.dl_err_delta)) * 100 : 0;
  const ulBler = latestMetric ? (latestMetric.ul_err_delta / (latestMetric.ul_ok_delta + latestMetric.ul_err_delta)) * 100 : 0;

  const colorPrimary = isDark ? "text-primary text-glow-cyan" : "text-blue-700";
  const colorSecondary = isDark ? "text-secondary text-glow-magenta" : "text-purple-700";
  const colorSuccess = isDark ? "text-success text-glow-green" : "text-green-700";
  const colorAccent = isDark ? "text-accent text-glow-red" : "text-red-700";

  return (
    <div className="grid grid-cols-12 gap-6 pb-10">
      {/* Row 1: Key Metrics */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <NeonCard color="primary" title={t('metric_rsrp')} className="h-40">
          <div className="mt-2">
            <DigitalDisplay
              value={rsrp.toFixed(1)}
              unit={t('label_dbm')}
              color={rsrp > -100 ? colorPrimary : colorAccent}
              size="xl"
            />
             <div className="w-full h-2 bg-gray-200 dark:bg-[#222] mt-4 relative overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, (rsrp + 140) * 1.5))}%` }} />
             </div>
          </div>
        </NeonCard>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <NeonCard color="secondary" title={t('metric_snr')} className="h-40">
          <div className="mt-2">
            <DigitalDisplay
              value={snr.toFixed(1)}
              unit={t('label_db')}
              color={colorSecondary}
              size="xl"
            />
             <div className="w-full h-2 bg-gray-200 dark:bg-[#222] mt-4 relative overflow-hidden">
               <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, snr * 3.3))}%` }} />
            </div>
          </div>
        </NeonCard>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <NeonCard color="success" title={t('metric_dl_traffic')} className="h-40">
           <div className="mt-2">
             <DigitalDisplay
                value={(latestMetric?.dl_ok_delta ?? 0).toFixed(0)}
                unit={t('label_blocks_s')}
                color={colorSuccess}
                size="xl"
              />
          </div>
        </NeonCard>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <NeonCard color="primary" title={t('metric_ul_traffic')} className="h-40">
           <div className="mt-2">
             <DigitalDisplay
                value={(latestMetric?.ul_ok_delta ?? 0).toFixed(0)}
                unit={t('label_blocks_s')}
                color={colorPrimary}
                size="xl"
              />
          </div>
        </NeonCard>
      </div>

      {/* Row 2: Charts */}
      <div className="col-span-12 lg:col-span-8">
        <NeonCard color="primary" className="h-[400px]" title={t('chart_signal')}>
           <SignalChart data={history} />
        </NeonCard>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <NeonCard color="accent" className="flex-1" title={t('chart_bler')}>
           <div className="flex flex-col justify-center h-full p-2">
             <BlerGauge label="DL BLER" value={dlBler} color="success" />
             <BlerGauge label="UL BLER" value={ulBler} color="primary" />
           </div>
        </NeonCard>
      </div>
    </div>
  );
};