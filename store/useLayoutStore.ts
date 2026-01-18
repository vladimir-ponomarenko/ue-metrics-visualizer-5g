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

interface CanvasState {
  scale: number;
  positionX: number;
  positionY: number;
}

interface LayoutState {
  widgets: Record<string, Record<string, WidgetLayout>>;
  canvasStates: Record<string, CanvasState>;
  updateWidget: (tabId: string, widgetId: string, updates: Partial<Omit<WidgetLayout, 'id'>>) => void;
  initWidgets: (tabId: string, defaults: Omit<WidgetLayout, 'zIndex'>[]) => void;
  bringToFront: (tabId: string, widgetId: string) => void;
  updateCanvasState: (tabId: string, state: CanvasState) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      widgets: {},
      canvasStates: {},

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

      initWidgets: (tabId, defaults) => {
        set((state) => {
          const currentTabWidgets = state.widgets[tabId] || {};
          const newWidgets = { ...currentTabWidgets };
          let hasChanges = false;

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
              hasChanges = true;
            }
          });

          
          if (hasChanges || Object.keys(currentTabWidgets).length === 0) {
            console.log(`[LayoutStore] Initialized widgets for ${tabId}:`, Object.keys(newWidgets));
            return {
              widgets: {
                ...state.widgets,
                [tabId]: newWidgets
              }
            };
          }
          return state;
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
      name: 'net-metrics-layout-v10-final', 
    }
  )
);