import React, { memo } from 'react';
import { Rnd } from 'react-rnd';
import { NeonCard } from '../ui/NeonCard';
import { useLayoutStore, WidgetLayout } from '../../store/useLayoutStore';

interface FreeWidgetProps {
  tabId: string;
  layout: WidgetLayout;
  children: React.ReactNode;
  title?: string;
  color?: 'primary' | 'secondary' | 'success' | 'accent' | 'warning';
  icon?: string;
  minWidth?: number;
  minHeight?: number;
}

export const FreeWidget: React.FC<FreeWidgetProps> = memo(({
  tabId,
  layout,
  children,
  title,
  color,
  icon,
  minWidth = 200,
  minHeight = 100
}) => {
  const { updateWidget, bringToFront, canvasStates } = useLayoutStore();

  const currentScale = canvasStates[tabId]?.scale || 1;

  const width = layout.w && layout.w > 0 ? layout.w : 300;
  const height = layout.h && layout.h > 0 ? layout.h : 200;
  const x = Number.isFinite(layout.x) ? layout.x : 50;
  const y = Number.isFinite(layout.y) ? layout.y : 50;

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      minWidth={minWidth}
      minHeight={minHeight}
      scale={currentScale}
      style={{ zIndex: layout.zIndex }}
      dragHandleClassName="drag-handle"
      bounds=".infinite-canvas-content"

      onMouseDown={() => bringToFront(tabId, layout.id)}

      onDragStop={(e, d) => {
        updateWidget(tabId, layout.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWidget(tabId, layout.id, {
          w: parseInt(ref.style.width),
          h: parseInt(ref.style.height),
          ...position,
        });
      }}

      resizeHandleClasses={{
        bottomRight: "z-50",
      }}
    >
      <div className="w-full h-full">
        <NeonCard
          color={color}
          title={title}
          icon={icon}
          className="w-full h-full shadow-xl bg-surface-light dark:bg-surface-dark"
          dragHandleProps={{ className: "drag-handle w-full h-full" }}
        >
          {children}
        </NeonCard>
      </div>
    </Rnd>
  );
});