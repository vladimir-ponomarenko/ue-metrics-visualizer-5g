// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface BlerGaugeProps {
  label: string;
  value: number;
  color?: 'success' | 'primary' | 'accent';
}

export const BlerGauge: React.FC<BlerGaugeProps> = ({ label, value, color = 'success' }) => {
  const safeValue = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-mono mb-2 text-gray-400 uppercase text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        <span className="text-black dark:text-white">{safeValue.toFixed(2)}%</span>
      </div>
      <div className="h-6 w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-[#333] relative flex">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,#f0f0f0_90%)] dark:bg-[linear-gradient(90deg,transparent_90%,#222_90%)] bg-[length:10px_100%] z-0"></div>

        {/* The "Safe" Bar */}
        <div
          className={clsx("h-full relative overflow-hidden z-10 flex items-center transition-all duration-300",
            color === 'success' ? "bg-success shadow-[0_0_15px_rgba(57,255,20,0.4)]" : "bg-primary shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          )}
          style={{ width: `${100 - safeValue}%` }}
        >
          <div className="w-full h-[1px] bg-black/20 dark:bg-white/20"></div>
        </div>

        {/* The "Error" Bar */}
        <div
          className="h-full bg-accent animate-pulse shadow-[0_0_15px_rgba(255,0,51,0.8)] z-10 transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
};