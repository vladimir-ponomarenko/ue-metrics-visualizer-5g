// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { useLayoutStore, WidgetLayout } from '../store/useLayoutStore';
import { InfiniteCanvas } from '../components/canvas/InfiniteCanvas';
import { FreeWidget } from '../components/canvas/FreeWidget';
import { AppTab } from '../types';
import { MetricsDrawer } from '../components/layout/MetricsDrawer';
import { OVERVIEW_WIDGETS } from '../config/overviewWidgets';

const DEFAULTS: Omit<WidgetLayout, 'zIndex'>[] = [];

export const Overview: React.FC = () => {
  const { history, latestMetric, theme } = useTelemetryStore();
  const { t } = useTranslation();
  const { widgets, initWidgets, addWidget, canvasStates } = useLayoutStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    initWidgets(AppTab.OVERVIEW, DEFAULTS);
  }, [initWidgets]);

  const tabWidgets = widgets[AppTab.OVERVIEW] || {};
  const currentCanvasState = canvasStates[AppTab.OVERVIEW] || { scale: 1, positionX: 0, positionY: 0 };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetId = e.dataTransfer.getData('widgetId');
    if (!widgetId) return;

    const widgetDef = OVERVIEW_WIDGETS[widgetId];
    if (!widgetDef) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const offsetX = containerRect ? containerRect.left : 0;
    const offsetY = containerRect ? containerRect.top : 0;

    const canvasX = (e.clientX - offsetX - currentCanvasState.positionX) / currentCanvasState.scale;
    const canvasY = (e.clientY - offsetY - currentCanvasState.positionY) / currentCanvasState.scale;

    const finalX = canvasX - (widgetDef.defaultW / 2);
    const finalY = canvasY - (widgetDef.defaultH / 2);

    addWidget(AppTab.OVERVIEW, {
        id: widgetId,
        x: finalX,
        y: finalY,
        w: widgetDef.defaultW,
        h: widgetDef.defaultH,
        zIndex: 100 
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
        ref={containerRef}
        className="w-full h-full relative" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
    >
       <InfiniteCanvas tabId={AppTab.OVERVIEW}>
         {Object.values(tabWidgets).map((layout) => {
           const widgetDef = OVERVIEW_WIDGETS[layout.id];
           if (!widgetDef) return null;

           return (
             <FreeWidget
               key={layout.id}
               tabId={AppTab.OVERVIEW}
               layout={layout}
               title={widgetDef.title}
               color={widgetDef.color}
             >
               {widgetDef.renderLive({ latestMetric, history, t, isDark })}
             </FreeWidget>
           );
         })}
       </InfiniteCanvas>

       <MetricsDrawer />
    </div>
  );
};