// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(num);
};

export const getSignalColor = (rsrp: number): string => {
  if (rsrp > -80) return '#39FF14'; // Good (Green)
  if (rsrp > -100) return '#00F0FF'; // Fair (Cyan)
  if (rsrp > -110) return '#FFE600'; // Poor (Yellow)
  return '#FF0033'; // Bad (Red)
};