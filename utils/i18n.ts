// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav_overview: "OVERVIEW",
      nav_l1: "L1 PHY",
      nav_l2: "L2 MAC",
      nav_l3: "L3 RRC",
      nav_logs: "LOGS",
      nav_settings: "SETTINGS",

      metric_rsrp: "RSRP",
      metric_snr: "SNR",
      metric_rssi: "RSSI",
      metric_cqi: "CQI",
      metric_dl_traffic: "DL TRAFFIC",
      metric_ul_traffic: "UL TRAFFIC",

      label_blocks_s: "Blocks/s",
      label_dbm: "dBm",
      label_db: "dB",

      chart_signal: "SIGNAL MONITOR",
      chart_bler: "BLOCK ERROR RATE",
      chart_cqi: "CQI HISTORY",
      chart_rssi_rsrp: "RSSI vs RSRP",
      chart_dl_perf: "DL PERFORMANCE",
      chart_ul_perf: "UL PERFORMANCE",

      status_connected: "CONNECTED",
      status_disconnected: "DISCONNECTED",
      status_connecting: "CONNECTING",

      settings_lang: "LANGUAGE",
      settings_lang_desc: "Select system language for interface",
      settings_theme: "THEME",
      settings_theme_desc: "Toggle between dark and light mode",

      sys_title: "SYSTEM INFO",
      sys_version: "VERSION",
      sys_build: "BUILD",
      sys_license: "LICENSE",

      log_level: "LEVEL",
      log_message: "MESSAGE",
      log_ts: "TIMESTAMP"
    }
  },
  ru: {
    translation: {
      nav_overview: "ОБЗОР",
      nav_l1: "ФИЗ. УРОВЕНЬ",
      nav_l2: "КАНАЛ. УРОВЕНЬ",
      nav_l3: "СЕТЕВОЙ УРОВЕНЬ",
      nav_logs: "ЖУРНАЛ",
      nav_settings: "НАСТРОЙКИ",

      metric_rsrp: "RSRP",
      metric_snr: "SNR",
      metric_rssi: "RSSI",
      metric_cqi: "CQI",
      metric_dl_traffic: "DL ТРАФИК",
      metric_ul_traffic: "UL ТРАФИК",

      label_blocks_s: "Блоков/с",
      label_dbm: "дБм",
      label_db: "дБ",

      chart_signal: "МОНИТОР СИГНАЛА",
      chart_bler: "КОЭФФИЦИЕНТ ОШИБОК",
      chart_cqi: "ИСТОРИЯ CQI",
      chart_rssi_rsrp: "RSSI vs RSRP",
      chart_dl_perf: "ПРОИЗВОДИТЕЛЬНОСТЬ DL",
      chart_ul_perf: "ПРОИЗВОДИТЕЛЬНОСТЬ UL",

      status_connected: "ПОДКЛЮЧЕНО",
      status_disconnected: "ОТКЛЮЧЕНО",
      status_connecting: "ПОДКЛЮЧЕНИЕ",

      settings_lang: "ЯЗЫК",
      settings_lang_desc: "Выберите язык интерфейса системы",
      settings_theme: "ТЕМА",
      settings_theme_desc: "Переключение между темной и светлой темой",

      sys_title: "СИСТЕМНАЯ ИНФОРМАЦИЯ",
      sys_version: "ВЕРСИЯ",
      sys_build: "СБОРКА",
      sys_license: "ЛИЦЕНЗИЯ",

      log_level: "УРОВЕНЬ",
      log_message: "СООБЩЕНИЕ",
      log_ts: "ВРЕМЯ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;