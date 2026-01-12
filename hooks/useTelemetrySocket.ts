import { useEffect, useRef, useCallback } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { ConnectionStatus, ProcessedMetric } from '../types';

const WS_URL = 'ws://localhost:8080/ws';
const API_URL = 'http://localhost:8080/api/history';
const RECONNECT_DELAY = 2000;

export const useTelemetrySocket = () => {
  const { addMetric, setHistory, setStatus, addLog } = useTelemetryStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const isMounted = useRef(false);

  const fetchHistory = useCallback(async () => {
      try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error('Network response was not ok');
          const rawData: any[] = await response.json();

          const data: ProcessedMetric[] = rawData.map(item => ({
            ...item,
            antennasRx: item.antennas_rx,
          }));

          console.log(`[Telemetry] Loaded ${data.length} historical points`);
          setHistory(data);
          addLog({
              ts: Date.now(),
              level: 'info',
              message: `History loaded: ${data.length} records fetched from backend`
          });
      } catch (error) {
          console.error('[Telemetry] Failed to load history:', error);
          addLog({
              ts: Date.now(),
              level: 'error',
              message: `Failed to load history: ${error}`
          });
      }
  }, [setHistory, addLog]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
        return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setStatus(ConnectionStatus.CONNECTING);
    addLog({ ts: Date.now(), level: 'info', message: `Connecting to ${WS_URL}...` });

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) {
         ws.close();
         return;
      }
      console.log('[Telemetry] WS Connected');
      setStatus(ConnectionStatus.CONNECTED);
      addLog({ ts: Date.now(), level: 'info', message: 'WebSocket Connection Established' });

      // fetchHistory();
    };

    ws.onmessage = (event) => {
      if (!isMounted.current) return;
      try {
        const rawData = JSON.parse(event.data);
        const data: ProcessedMetric = {
          ...rawData,
          antennasRx: rawData.antennas_rx,
        };
        addMetric(data);
        checkThresholds(data, addLog);
      } catch (err) {
        console.error('[Telemetry] Failed to parse message:', err);
      }
    };

    ws.onclose = () => {
      if (isMounted.current) {
        console.log('[Telemetry] WS Disconnected');
        setStatus(ConnectionStatus.DISCONNECTED);
        addLog({ ts: Date.now(), level: 'warning', message: 'WebSocket Disconnected. Reconnecting...' });
        wsRef.current = null;
        reconnectTimeoutRef.current = window.setTimeout(connect, RECONNECT_DELAY);
      }
    };

    ws.onerror = (error) => {
       console.error('[Telemetry] Socket Error:', error);
       addLog({ ts: Date.now(), level: 'error', message: 'WebSocket Error occurred' });
       if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [addMetric, setStatus, addLog, fetchHistory]);

  useEffect(() => {
    isMounted.current = true;

    fetchHistory();
    connect();

    return () => {
      isMounted.current = false;
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect, fetchHistory]);
};

/**
 * Analyzes incoming real data for critical events and adds them to the log store.
 */
const checkThresholds = (data: ProcessedMetric, addLog: (log: any) => void) => {
    const dlBler = data.dl_ok_delta + data.dl_err_delta > 0
        ? (data.dl_err_delta / (data.dl_ok_delta + data.dl_err_delta)) * 100
        : 0;

    if (dlBler > 10) {
        addLog({
            ts: data.ts,
            level: 'warning',
            message: `High DL BLER Detected: ${dlBler.toFixed(1)}% (Frame: ${data.frame})`
        });
    }

    if (data.rsrp < -110) {
        addLog({
            ts: data.ts,
            level: 'error',
            message: `Critical Signal: ${data.rsrp.toFixed(1)} dBm`
        });
    } else if (data.rsrp < -95) {
        addLog({
            ts: data.ts,
            level: 'warning',
            message: `Weak Signal: ${data.rsrp.toFixed(1)} dBm`
        });
    }

    if (data.ul_err_delta > 5) {
        addLog({
            ts: data.ts,
            level: 'error',
            message: `UL Transmission Failures: ${data.ul_err_delta} blocks dropped`
        });
    }
};