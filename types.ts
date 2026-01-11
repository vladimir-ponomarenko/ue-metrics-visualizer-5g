export interface ProcessedMetric {
  ts: number;         // Unix timestamp (ms)
  rnti: number;       // UE Identity
  frame: number;      // Frame Number
  slot: number;       // Current Slot
  rsrp: number;       // Signal Power (dBm)
  rssi: number;       // Received Signal Strength (dBm)
  snr: number;        // Signal-to-Noise Ratio (dB)
  cqi: number;        // Channel Quality Indicator (0-15)

  // Throughput (Blocks per second)
  dl_ok_delta: number;  // Successful DL blocks in last second
  dl_err_delta: number; // Failed DL blocks
  ul_ok_delta: number;  // Successful UL blocks
  ul_err_delta: number; // Failed UL blocks

  // Cumulative Counters
  dl_ok_total: number;
  dl_err_total: number;
  ul_ok_total: number;
  ul_err_total: number;

  bad_dci: number;
  ul_code_rate: number;
  ul_bps: number;
  ul_rb_tb: number;
  ul_sym_tb: number;

  pci: number;                  // Physical Cell ID
  n0_power: number;             // Noise Power
  rank: number;                 // MIMO Rank
  rx_gain: number;              // Total RX Gain
  nta_offset: number;           // N_TA Offset
  ssb_rsrp_beams: number[];     // Array of 4 RSRP values
  ssb_sinr_beams: number[];     // Array of 4 SINR values
}

export interface LogEntry {
  id: string;
  ts: number;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export enum AppTab {
  OVERVIEW = 'OVERVIEW',
  L1_PHY = 'L1_PHY',
  L2_MAC = 'L2_MAC',
  L3_RRC = 'L3_RRC',
  LOGS = 'LOGS',
  SETTINGS = 'SETTINGS'
}