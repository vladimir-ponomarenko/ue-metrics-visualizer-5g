// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WidgetLayout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
}

export interface CanvasState {
  scale: number;
  positionX: number;
  positionY: number;
}

interface LayoutState {
  widgets: Record<string, Record<string, WidgetLayout>>;
  canvasStates: Record<string, CanvasState>;
  drawerSortOrder: string[];
  isDrawerOpen: boolean;
  initializedTabs: string[];

  updateWidget: (tabId: string, widgetId: string, updates: Partial<Omit<WidgetLayout, 'id'>>) => void;
  addWidget: (tabId: string, widget: WidgetLayout) => void;
  removeWidget: (tabId: string, widgetId: string) => void;
  restoreWidgetToDrawer: (tabId: string, widgetId: string, targetIndex: number) => void;
  setDrawerOrder: (order: string[]) => void;
  setDrawerOpen: (isOpen: boolean) => void;

  initWidgets: (tabId: string, defaults: Omit<WidgetLayout, 'zIndex'>[]) => void;
  bringToFront: (tabId: string, widgetId: string) => void;
  updateCanvasState: (tabId: string, state: CanvasState) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      widgets: {},
      canvasStates: {},
      drawerSortOrder: [],
      isDrawerOpen: true,
      initializedTabs: [],

      updateWidget: (tabId, widgetId, updates) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [tabId]: {
              ...state.widgets[tabId],
              [widgetId]: {
                ...state.widgets[tabId]?.[widgetId],
                ...updates,
                id: widgetId,
              },
            },
          },
        })),

      addWidget: (tabId, widget) =>
        set((state) => ({
            widgets: {
                ...state.widgets,
                [tabId]: {
                    ...state.widgets[tabId],
                    [widget.id]: widget
                }
            }
        })),

      removeWidget: (tabId, widgetId) =>
        set((state) => {
            const newTabWidgets = { ...state.widgets[tabId] };
            delete newTabWidgets[widgetId];
            return {
                widgets: {
                    ...state.widgets,
                    [tabId]: newTabWidgets
                }
            };
        }),

      restoreWidgetToDrawer: (tabId, widgetId, targetIndex) =>
        set((state) => {
            const newTabWidgets = { ...state.widgets[tabId] };
            delete newTabWidgets[widgetId];

            const currentOrder = [...state.drawerSortOrder];
            const cleanOrder = currentOrder.filter(id => id !== widgetId);
            const safeIndex = Math.min(Math.max(0, targetIndex), cleanOrder.length);
            cleanOrder.splice(safeIndex, 0, widgetId);

            return {
                widgets: {
                    ...state.widgets,
                    [tabId]: newTabWidgets
                },
                drawerSortOrder: cleanOrder
            };
        }),

      setDrawerOrder: (order) => set({ drawerSortOrder: order }),
      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

      initWidgets: (tabId, defaults) => {
        const state = get();

        if (state.initializedTabs.includes(tabId)) {
            return;
        }

        set((state) => {
          const currentTabWidgets = state.widgets[tabId] || {};
          const currentCanvasState = state.canvasStates[tabId];

          const newWidgets = { ...currentTabWidgets };

          defaults.forEach((def, index) => {
            if (!newWidgets[def.id]) {
              newWidgets[def.id] = {
                ...def,
                x: def.x ?? 50,
                y: def.y ?? 50,
                w: def.w ?? 300,
                h: def.h ?? 200,
                zIndex: index + 10
              };
            }
          });

          const newCanvasStates = currentCanvasState ? state.canvasStates : {
            ...state.canvasStates,
            [tabId]: { scale: 1, positionX: 0, positionY: 0 }
          };

          return {
            widgets: {
              ...state.widgets,
              [tabId]: newWidgets
            },
            canvasStates: newCanvasStates,
            initializedTabs: [...state.initializedTabs, tabId]
          };
        });
      },

      bringToFront: (tabId, widgetId) => {
        set((state) => {
          const tabWidgets = state.widgets[tabId];
          if (!tabWidgets) return state;
          const maxZ = Math.max(...Object.values(tabWidgets).map((w) => w.zIndex || 0), 0);
          if (tabWidgets[widgetId]?.zIndex === maxZ) return state;

          return {
            widgets: {
              ...state.widgets,
              [tabId]: {
                ...tabWidgets,
                [widgetId]: {
                  ...tabWidgets[widgetId],
                  zIndex: maxZ + 1,
                },
              },
            },
          };
        });
      },

      updateCanvasState: (tabId, newState) =>
        set((state) => ({
          canvasStates: {
            ...state.canvasStates,
            [tabId]: newState,
          },
        })),
    }),
    {
      name: 'net-metrics-layout-v16',
    }
  )
);